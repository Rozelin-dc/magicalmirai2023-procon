/// <reference path="../util/type.mjs" />
/// <reference path="./type.mjs" />

import path from 'path'
import crypto from 'crypto'

import { XMLParser } from 'fast-xml-parser'
import yargs from 'yargs'
import { RECORD_ACTION_PROP_NAMES } from '../util/constant.mjs'
import { readFile, writeFile } from '../util/file.mjs'

const argv = await yargs(process.argv.slice(2))
  .option('file', {
    demandOption: true,
    string: true,
  })
  .option('multiFiles', {
    demandOption: true,
    string: true,
    coerce: (arg) => arg.split(',')
  })
  .option('projectRootDir', {
    demandOption: true,
    string: true,
  })
  .option('idMapDir', {
    demandOption: true,
    string: true,
  })
  .option('beforeTmpDir', {
    demandOption: true,
    string: true,
  })
  .option('afterTmpDir', {
    demandOption: true,
    string: true,
  })
  .parse()

const fileName = argv.file
const multiFiles = argv.multiFiles
const projectRootDir = argv.projectRootDir
const idMapDir = argv.idMapDir
const beforeTmpDir = argv.beforeTmpDir
const afterTmpDir = argv.afterTmpDir

const rawXml = await readFile(fileName)

console.log(`Processing file: ${fileName}`)
// console.log('file content:', rawXml)

/** @type {DiffXml} */
const xml = new XMLParser({
  ignoreAttributes: false,
  ignoreDeclaration: true,
}).parse(rawXml)

/** @type {Record<string, IdMap>} */
const idMap = {}
/** @type {Record<string, IdMap>} */
const newIdMap = {}
/** @type {{fileName: string; startPos: number; len: number}[]} */
const beforePosMap = []
/** @type {{fileName: string; startPos: number; len: number}[]} */
const afterPosMap = []

let beforeStartPos = 1
let afterStartPos = 1
for (const file of multiFiles) {
  const rawIdMap = await readFile(
    path.join(projectRootDir, idMapDir, `${file}.id-map.json`)
  )
  idMap[file] = JSON.parse(rawIdMap)
  newIdMap[file] = {}
  const beforeRawFile = await readFile(path.join(beforeTmpDir, file))
  const afterRawFile = await readFile(path.join(afterTmpDir, file))
  beforePosMap.push({
    fileName: file,
    startPos: beforeStartPos,
    len: beforeRawFile.length,
  })
  afterPosMap.push({
    fileName: file,
    startPos: afterStartPos,
    len: afterRawFile.length,
  })
  beforeStartPos += beforeRawFile.length + 1
  afterStartPos += afterRawFile.length + 1
}

/**
 * @param {'before' | 'after'} type
 * @param {number} pos
 * @return {{fileName: string; position: number}}
 */
const normalizePos = (type, pos) => {
  const posMap = type === 'before' ? beforePosMap : afterPosMap
  let center = Math.floor(posMap.length / 2)
  let centerFile = posMap[center]
  while (
    centerFile.startPos > pos ||
    centerFile.startPos + centerFile.len < pos
  ) {
    console.log(`Searching for position ${pos} in ${type} map...`)
    console.log('Current center: ', centerFile)

    if (centerFile.startPos > pos) {
      center = Math.floor(center / 2)
    } else {
      center = Math.floor((center + posMap.length) / 2)
    }
    if (center < 0 || center >= posMap.length) {
      throw new Error(`Position ${pos} is out of bounds.`)
    }
    centerFile = posMap[center]
  }

  console.log(`Found position ${pos} in ${type} map:`, centerFile)

  return {
    fileName: centerFile.fileName,
    position: pos - centerFile.startPos,
  }
}

/**
 * @param {DiffNode} xml
 * @param {DiffNode} [parent]
 * @return {void}
 */
const runXml = (xml, parent) => {
  switch (xml['@_type']) {
    case 'JSXAttribute': {
      if (!Array.isArray(xml.tree)) {
        throw new Error('JSXAttribute should have children.')
      }
      if (!parent) {
        throw new Error('Parent is missing.')
      }

      const identifier = xml.tree[0]
      if (identifier['@_type'] !== 'JSXIdentifier') {
        throw new Error('JSXAttribute should have identifier.')
      }
      if (!identifier['@_label']) {
        throw new Error('JSXIdentifier should have label.')
      }

      if (!xml['@_other_pos']) {
        // Added node.
        break
      }

      const afterPos = parseInt(xml['@_pos'])
      const beforePos = parseInt(xml['@_other_pos'])
      if (RECORD_ACTION_PROP_NAMES[identifier['@_label']]) {
        const parentPos = parseInt(parent['@_pos'])

        const normalizedBefore = normalizePos('before', beforePos)
        const normalizedAfter = normalizePos('after', afterPos)
        const normalizedParent = normalizePos('after', parentPos)

        newIdMap[normalizedAfter.fileName][normalizedAfter.position] = {
          position: normalizedAfter.position,
          propName: identifier['@_label'],
          parentNodeId:
            newIdMap[normalizedParent.fileName][normalizedParent.position].id,
          prevParentNodeId:
            idMap[normalizedBefore.fileName][normalizedBefore.position]
              .parentNodeId,
        }
      }
      break
    }
    case 'JSXOpeningElement': {
      if (!xml['@_other_pos']) {
        // Added node.
        // Generate ID for the Attribute.
        const afterPos = parseInt(xml['@_pos'])
        const normalizedAfter = normalizePos('after', afterPos)
        newIdMap[normalizedAfter.fileName][normalizedAfter.position] = {
          position: normalizedAfter.position,
          id: crypto.randomUUID(),
        }
        break
      }

      const afterPos = parseInt(xml['@_pos'])
      const beforePos = parseInt(xml['@_other_pos'])

      const normalizedBefore = normalizePos('before', beforePos)
      const normalizedAfter = normalizePos('after', afterPos)

      newIdMap[normalizedAfter.fileName][normalizedAfter.position] = {
        ...idMap[normalizedBefore.fileName][normalizedBefore.position],
        position: normalizedAfter.position,
      }
      break
    }
  }

  // record children data
  if (xml.tree) {
    if (Array.isArray(xml.tree)) {
      xml.tree.forEach((node) => runXml(node, xml))
    } else {
      runXml(xml.tree, xml)
    }
  }
}

runXml(xml.root)

for (const file of multiFiles) {
  const newIdMapFile = newIdMap[file]
  writeFile(
    path.join(projectRootDir, idMapDir, `${file}.id-map.json`),
    JSON.stringify(newIdMapFile, null, 2)
  )
}
