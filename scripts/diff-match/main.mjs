/// <reference path="../util/type.mjs" />

import { XMLParser } from 'fast-xml-parser';
import yargs from 'yargs';
import { RECORD_ACTION_PROP_NAMES } from '../util/constant.mjs';
import { readFile, writeFile } from '../util/file.mjs';

/**
 * @typedef {object} DiffXml
 * @property {string} context
 * @property {DiffNode} root
 */

/**
 * @typedef {object} DiffNode
 * @property {DiffNode | DiffNode[]} [tree]
 * @property {string} '@_type'
 * @property {string} [@_label]
 * @property {string} '@_pos'
 * @property {string} '@_length'
 * @property {string} [@_other_pos]
 * @property {string} [@_other_length]
 */

const argv = await yargs(process.argv.slice(2))
  .option('file', {
    demandOption: true,
    string: true,
  })
  .parse();

const fileName = argv.file;

const rawXml = await readFile(`${fileName}.diff.xml`);
/** @type {DiffXml} */
const xml = new XMLParser({
  ignoreAttributes: false,
  ignoreDeclaration: true,
}).parse(rawXml);

const rawIdMap = await readFile(`${fileName}.id-map.json`);
/** @type {IdMap} */
const idMap = JSON.parse(rawIdMap);
/** @type {IdMap} */
const newIdMap = {};

/**
 * @param {DiffNode} xml
 * @param {DiffNode} [parent]
 * @return {void}
 */
const runXml = (xml, parent) => {
  switch (xml['@_type']) {
    case 'JSXAttribute': {
      if (!Array.isArray(xml.tree)) {
        throw new Error('JSXAttribute should have children.');
      }
      if (!parent) {
        throw new Error('Parent is missing.');
      }

      const identifier = xml.tree[0];
      if (identifier['@_type'] !== 'JSXIdentifier') {
        throw new Error('JSXAttribute should have identifier.');
      }
      if (!identifier['@_label']) {
        throw new Error('JSXIdentifier should have label.');
      }

      if (!xml['@_other_pos']) {
        // Added node.
        break;
      }

      const afterPos = parseInt(xml['@_pos']);
      const beforePos = parseInt(xml['@_other_pos']);
      if (RECORD_ACTION_PROP_NAMES[identifier['@_label']]) {
        const parentPos = parseInt(parent['@_pos']);

        newIdMap[afterPos] = {
          position: afterPos,
          propName: identifier['@_label'],
          parentNodeId: newIdMap[parentPos].id,
          prevParentNodeId: idMap[beforePos].parentNodeId,
        };
      }
      break;
    }
    case 'JSXOpeningElement': {
      if (!xml['@_other_pos']) {
        // Added node.
        break;
      }

      const afterPos = parseInt(xml['@_pos']);
      const beforePos = parseInt(xml['@_other_pos']);

      newIdMap[afterPos] = { ...idMap[beforePos], position: afterPos };
      break;
    }
  }

  // record children data
  if (xml.tree) {
    if (Array.isArray(xml.tree)) {
      xml.tree.forEach((node) => runXml(node, xml));
    } else {
      runXml(xml.tree, xml);
    }
  }
};

runXml(xml.root);

writeFile(`${fileName}.id-map.json`, JSON.stringify(newIdMap, null, 2));
