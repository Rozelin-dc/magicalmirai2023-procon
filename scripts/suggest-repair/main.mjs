import path from 'path'
import _traverse from '@babel/traverse'
import yargs from 'yargs'

import { getAst } from '../util/get-ast.mjs'
import { readFile } from '../util/file.mjs'

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
      if (!results[describeKey]) {
        results[describeKey] = []
      }
      results[describeKey].push({
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
        let selectorType = code.ast.arguments[0].callee.property.name
        switch (selectorType) {
          case 'xpath': {
            suggestedRepairs.push(
              `Fixing for "${code.method}" in "${testName}" at line ${code.line}: "By.xpath('${res.fixedXpath}')"`
            )
            break
          }
          case 'className': {
            const newClassName = res.attributes['class'] ?? ''
            if (newClassName === '') {
              console.warn(
                `Cannot fix className for "${code.method}" in "${testName}" at line ${code.line}: no className provided in new attributes.`
              )
              continue
            }
            suggestedRepairs.push(
              `Fixing for "${code.method}" in "${testName}" at line ${code.line}: "By.className('${newClassName}')"`
            )
            break
          }
          default: {
            console.warn(
              `Unsupported selector type: "${selectorType}" in "${code.method}" at line ${code.line}`
            )
            continue
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
    `Suggested Repairs for file "${argv.testFile}":\n  ${suggestedRepairs.join(
      '\n  '
    )}`
  )
}
