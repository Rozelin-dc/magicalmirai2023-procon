/**
 * @typedef {object} ElementData
 * @property {number} position
 * @property {string} id
 * @property {never} [propName]
 * @property {never} [parentNodeId]
 * @property {never} [prevParentNodeId]
 */

/**
 * @typedef {object} PropData
 * @property {number} position
 * @property {never} [id]
 * @property {string} propName
 * @property {string} parentNodeId
 * @property {string} [prevParentNodeId]
 */

/**
 * @typedef {Record<number, ElementData | PropData>} IdMap
 */
