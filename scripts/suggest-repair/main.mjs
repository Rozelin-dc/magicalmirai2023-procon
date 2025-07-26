import path from 'path'
import _traverse from '@babel/traverse'
import yargs from 'yargs'

import { getAst } from '../util/get-ast.mjs'
import { readFile } from '../util/file.mjs'
import { TEST_ID_ATTRIBUTE_NAME } from '../util/constant.mjs'

/** @type {typeof _traverse} */
const traverse = _traverse.default

/**
 * @typedef {object} CodeData
 * @property {number} order
 * @property {number} line
 * @property {string} code
 * @property {string} method
 * @property {import('@babel/types').CallExpression} ast
 */

/**
 * @typedef {object} FixedResult
 * @property {number} eventId
 * @property {string} eventMethod
 * @property {string} fixedXpath
 * @property {Record<string, string>} attributes
 */

const COLLECT_FUNCTIONS = new Set([
  'findElement',
  'wait',
  'click',
  'sendKeys',
  'getText',
])

const argv = await yargs(process.argv.slice(2))
  .options({
    testFile: {
      demandOption: true,
      string: true,
    },
    resultFileDir: {
      demandOption: true,
      string: true,
    },
  })
  .parse()

const ast = await getAst(argv.testFile)

let currentDescribe = ''
let describeStack = []
let findElementIndex = {}
/** @type {Record<string, CodeData[]>} */
let results = {}

/**
 * @template K
 * @template V
 * @param {Record<K, V[]>} record
 * @param {K} key
 * @param {V} value
 * @return {void}
 */
function addRecordArray(record, key, value) {
  if (!record[key]) {
    record[key] = []
  }
  record[key].push(value)
}

/**
 * @template K
 * @template V
 * @param {Record<K, V>} record
 * @param {V} value
 * @return {K | null}
 */
function getRecordKey(record, value) {
  for (const key in record) {
    if (record[key] === value) {
      return key
    }
  }
  return null
}

/**
 * @param {string} attrName
 * @param {string} attrValue
 * @return {string}
 */
function getAttributeSelector(attrName, attrValue) {
  switch (attrName) {
    case 'class':
      return `.${attrValue}`
    case 'id':
      return `#${attrValue}`
    case 'tag':
      return attrValue
    default:
      return `[${attrName}="${attrValue}"]`
  }
}

traverse(ast, {
  enter(path) {
    // トップレベル describe ブロックの検出
    if (path.isCallExpression() && path.node.callee.name === 'it') {
      const describeName = path.node.arguments[0]?.value || 'anonymous'
      describeStack.push(describeName)
      currentDescribe = describeStack.join(' > ')
      if (!findElementIndex[currentDescribe]) {
        findElementIndex[currentDescribe] = 0
      }
    }

    // findElement の検出
    if (
      path.isCallExpression() &&
      COLLECT_FUNCTIONS.has(path.node.callee.property?.name)
    ) {
      const loc = path.node.loc.start
      const describeKey = currentDescribe
      const order = findElementIndex[describeKey]++
      addRecordArray(results, describeKey, {
        order,
        line: loc.line,
        // code: code.split('\n')[loc.line - 1].trim(),
        method: path.node.callee.property.name,
        ast: path.node,
      })
    }
  },
  exit(path) {
    // describe スコープから出たらスタックから除去
    if (path.isCallExpression() && path.node.callee.name === 'it') {
      describeStack.pop()
      currentDescribe = describeStack.join(' > ')
    }
  },
})

for (const testName in results) {
  const fixedResults = await readFile(
    path.join(argv.resultFileDir, `${testName}.json`),
    true
  )
  if (!fixedResults) {
    console.log(`No fixed results found for test: ${testName}`)
    continue
  }

  /** @type {{ fixed: FixedResult[] }} */
  const resultData = JSON.parse(fixedResults)

  /** @type {string[]} */
  const suggestedRepairs = []
  for (const res of resultData.fixed) {
    const code = results[testName][res.eventId]
    if (!code) {
      console.warn(`No code found for eventId: ${res.eventId} in ${testName}`)
      continue
    }

    switch (code.method) {
      case 'findElement': {
        const selectorType = code.ast.arguments[0].callee.property.name
        switch (selectorType) {
          case 'xpath': {
            suggestedRepairs.push(
              `Fixing for "${code.method}" in "${testName}" at line ${code.line}: "By.xpath('${res.fixedXpath}')"`
            )
            break
          }
          case 'id':
          case 'tagName':
          case 'name':
          case 'css':
          case 'className': {
            const selectors =
              selectorType === 'name'
                ? `[name="${code.ast.arguments[0].arguments[0].value}"]`
                : `${
                    selectorType === 'className'
                      ? '.'
                      : selectorType === 'id'
                      ? '#'
                      : ''
                  }${code.ast.arguments[0].arguments[0].value}`.split(' ')
            /** @type {Record<string, string>} */
            const selectorAttributes = {}
            for (const selector of selectors) {
              if (selector.startsWith('.')) {
                // class
                selectorAttributes['class'] = selector.slice(1)
              } else if (selector.startsWith('#')) {
                // id
                selectorAttributes['id'] = selector.slice(1)
              } else if (selector.match(/^[a-z]+$/g)) {
                // tag name
                selectorAttributes['tag'] = selector
              } else if (selector.match(/^\[(.+)=(.+)\]$/g)) {
                // attribute
                const [key, value] = selector.slice(1, -1).split('=')
                selectorAttributes[key] = value
              } else {
                console.warn(
                  `Unsupported selector format: "${selector}" in "${code.method}" at line ${code.line}`
                )
                continue
              }
            }

            /** @type {[string[], string[], string[]]} */
            let newSelector = [[], [], []]
            /** @type {Set<string>} */
            const usedAttrNames = new Set()
            for (const attrName in selectorAttributes) {
              const attrValue = selectorAttributes[attrName]
              const newAttrName = getRecordKey(res.attributes, attrValue)
              const newAttrValue = res.attributes[attrName]
              if (newAttrName) {
                newSelector[0].push(
                  getAttributeSelector(newAttrName, attrValue)
                )
                usedAttrNames.add(newAttrName)
              }
              if (newAttrValue) {
                newSelector[1].push(
                  getAttributeSelector(attrName, newAttrValue)
                )
                usedAttrNames.add(attrName)
              }
            }

            for (const attrName in res.attributes) {
              if (
                attrName === TEST_ID_ATTRIBUTE_NAME ||
                usedAttrNames.has(attrName)
              ) {
                continue
              }

              const newValue = res.attributes[attrName]
              if (attrName === 'class') {
                newSelector[2].push([`.${newValue}`])
              } else if (attrName === 'id') {
                newSelector[2].push([`#${newValue}`])
              } else if (attrName === 'tag') {
                newSelector[2].push([newValue])
              } else {
                newSelector[2].push([`[${attrName}="${newValue}"]`])
              }
            }

            if (newSelector.length === 0) {
              console.warn(
                `No valid selectors found for "${code.method}" in "${testName}" at line ${code.line}`
              )
              break
            }

            let suggestedRepair = `- Fixing for "${code.method}" in "${testName}" at line ${code.line}\n`
            suggestedRepair += `  1. ${
              newSelector[0].length > 0
                ? `By.css('${newSelector[0].join(' ')}')`
                : 'No valid selector'
            }\n`
            suggestedRepair += `  2. ${
              newSelector[1].length > 0
                ? `By.css('${newSelector[1].join(' ')}')`
                : 'No valid selector'
            }\n`
            suggestedRepair += `  3. ${
              newSelector[2].length > 0
                ? newSelector[2].map((sel) => `By.css('${sel}')`).join(', ')
                : 'No valid selector'
            }`

            suggestedRepairs.push(suggestedRepair)
            break
          }
          default: {
            console.warn(
              `Unsupported selector type: "${selectorType}" in "${code.method}" at line ${code.line}`
            )
          }
        }
        break
      }
      default: {
        console.warn(`Unsupported method: ${code.method}`)
      }
    }
  }

  console.log(
    `### Suggested Repairs for file "${argv.testFile}"\n${suggestedRepairs.join(
      '\n'
    )}`
  )
}
