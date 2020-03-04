const svelte = require('rollup-plugin-svelte')
// import svelte from 'rollup-plugin-svelte'
const pkg = require('./package.json')

const IS_PRODUCTION_MODE = process.env.NODE_ENV === 'production'

module.exports = {
  rollup: {
    // installOptions: {
    //   externalPackage: ['svelte-routing'],
    // },
    plugins: [
      svelte({
        // generate: 'ssr',
        // hydratable: true,
        // dev: !IS_PRODUCTION_MODE,
      }),
    ],
    // external: Object.keys(pkg.dependencies).concat(
    //   require('module').builtinModules ||
    //     Object.keys(process.binding('natives'))
    // ),
  },
}
