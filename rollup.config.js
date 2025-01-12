import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import { defineConfig } from 'rollup';
import fs from 'fs';

const version = process.env.SEMANTIC_RELEASE_NEXT_VERSION || JSON.parse(fs.readFileSync('./package.json')).version;

console.log('building version:', version);

const banner = `/**
 * marked-jira v${version} - a markdown to jira converter
 * Copyright (c) 2024-${new Date().getFullYear()}, Alvaro Tinoco. (MIT Licensed)
 * https://github.com/mrmarble/marked-jira
 */

/**
 * DO NOT EDIT THIS FILE
 * The code in this file is generated from files in ./src/
 */
`;

export default defineConfig([
  {
    input: 'src/index.ts',
    plugins: [typescript()],
    external: ['marked'],
    output: [{
      file: 'lib/index.esm.js',
      format: 'esm',
      sourcemap: true,
      banner,
    },
    {
      file: 'lib/index.umd.js',
      format: 'umd',
      name: 'index',
      sourcemap: true,
      globals: {
        marked: 'marked',
      },
      banner,
    },
    {
      file: 'marked-jira.min.js',
      format: 'umd',
      name: 'markedJira',
      sourcemap: false,
      plugins: [terser({
        format: {
          comments: (node, comment) => {
            if (comment.type === 'comment2') {
              return comment.value.includes('Copyright (c)');
            }
          },
        },
      })],
      banner,
      globals: {
        marked: 'marked',
      },
    },
    {
      file: 'lib/index.cjs',
      format: 'cjs',
      name: 'index',
      banner,
      sourcemap: true,
    }],
  },
]);
