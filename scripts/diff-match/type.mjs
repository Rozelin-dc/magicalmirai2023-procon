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
