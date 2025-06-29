import parser from '@babel/parser';

import { readFile } from './file.mjs';
/**
 * @param {string} fileName
 * @returns {Promise<parser.ParseResult<import('@babel/types').File>>}
 */
export async function getAst(fileName) {
  const code = await readFile(fileName);
  const ast = parser.parse(code, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript'],
  });
  return ast;
}
