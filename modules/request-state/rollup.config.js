// rollup.config.js
import typescript from '@rollup/plugin-typescript';

export default {
    input: './dist/main.js',
    output: {
      file: './dist/index.js',
      format: 'cjs'
    },
    plugins: [typescript]
  };