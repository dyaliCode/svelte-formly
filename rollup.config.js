import svelte from 'rollup-plugin-svelte'
import resolve from 'rollup-plugin-node-resolve'
import browsersync from 'rollup-plugin-browsersync'
import { terser } from 'rollup-plugin-terser'
import commonjs from 'rollup-plugin-commonjs'
import pkg from './package.json'
import sveltePreprocess from 'svelte-preprocess'
import postcss from 'rollup-plugin-postcss'

const watch = process.env.WATCH
const mainpath = watch ? 'docs/index.js' : pkg.main
const dedupe = (importee) =>
  importee === 'svelte' || importee.startsWith('svelte/')

const scssOptions = {
  transformers: {
    scss: {
      includePaths: ['node_modules', 'src']
    },
    postcss: {
      plugins: [require('autoprefixer')]
    }
  }
}

const production = !process.env.ROLLUP_WATCH

export default {
  input: !production ? 'src/main.js' : 'src/index.js',
  output: [
    { file: pkg.module, format: 'es' },
    { file: mainpath, format: 'iife' }
  ],
  plugins: [
    commonjs(),
    svelte({
      preprocess: sveltePreprocess(scssOptions)
    }),
    resolve({
      dedupe
    }),
    postcss(),
    watch && browsersync({ server: 'docs' }),
    !watch && terser()
  ]
}
