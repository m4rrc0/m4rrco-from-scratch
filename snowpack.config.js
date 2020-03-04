const svelte = require('rollup-plugin-svelte')
// import svelte from 'rollup-plugin-svelte'
const pkg = require('./package.json')

const IS_PRODUCTION_MODE = process.env.NODE_ENV === 'production'

module.exports = {
  rollup: {
    // input: config.server.input(),
    // output: config.server.output(),
    plugins: [
      svelte({
        // generate: 'ssr',
        // hydratable: true,
        // dev: !IS_PRODUCTION_MODE,
      }),
      // replace({
      //   'process.browser': false,
      //   'process.env.NODE_ENV': JSON.stringify(mode)
      // }),
      // svelte({
      //   generate: 'ssr',
      //   dev
      // }),
      // resolve({
      //   dedupe: ['svelte']
      // }),
      // commonjs()
    ],
    // external: Object.keys(pkg.dependencies).concat(
    //   require('module').builtinModules ||
    //     Object.keys(process.binding('natives'))
    // ),

    // onwarn,
  },
}
