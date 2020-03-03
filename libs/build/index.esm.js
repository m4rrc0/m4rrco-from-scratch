import { promises as fs, existsSync } from 'fs'
import * as chokidar from 'chokidar'
import * as glob from 'glob'
import pLimit from 'p-limit'
import * as path from 'path'
import throttle from 'lodash.throttle'

import {
  cleanDist,
  copyFile,
  compile,
  snowpack,
  transform,
  minify,
  // startWatchMode,
  startDevServer,
} from './svelvet.esm.js'

const IS_PRODUCTION_MODE = process.env.NODE_ENV === 'production'

export function startWatchMode() {
  console.info(`\nWatching for files...`)

  const handleFile = async srcPath => {
    // Copy updated non-js/svelte files
    if (
      !srcPath.endsWith('.svelte') &&
      !srcPath.endsWith('.js') &&
      !srcPath.endsWith('.mjs')
    ) {
      copyFile(srcPath)
      return
    }

    // const { destPath, logSvelteWarnings } = await compile(srcPath)
    const { destPath, logSvelteWarnings } = await compile(
      srcPath,
      {
        outputDir: 'dist',
      },
      {
        hydratable: true,
      }
    )
    const { buildPath, logSvelteWarnings: logSvelteWarnings2 } = await compile(
      srcPath,
      {
        outputDir: 'build',
      },
      {
        generate: 'ssr',
        hydratable: true,
        // format: 'cjs',
      }
    )

    const { pagePath } = await compileHtml(destPath, {})

    if (!destPath) return
    await transform(destPath, true)
    logSvelteWarnings()
    logSvelteWarnings2()
  }

  const srcWatcher = chokidar.watch('src', {
    ignored: /(^|[/\\])\../, // Ignore dotfiles
    ignoreInitial: true, // Don't fire "add" events when starting the watcher
  })

  srcWatcher.on('add', handleFile)
  // Throttle duplicate change events to prevent unnecessary recompiles
  srcWatcher.on('change', throttle(handleFile, 500, { trailing: false }))
}

// /* eslint-disable no-console */
// import * as util from 'util'
// import { exec as execSync } from 'child_process'
// import { promises as fs, existsSync } from 'fs'
// import * as path from 'path'
// import * as svelte from 'svelte/compiler'
// // require('svelte/register')({
// //     // extensions: ['.customextension'], // defaults to ['.html', '.svelte']
// //     // preserveComments: true,
// //     generate: 'ssr',
// //     hydratable: true,
// //     // format: 'cjs',
// // });
// import * as chokidar from 'chokidar'
// import * as babel from '@babel/core'
// import * as glob from 'glob'
// import * as terser from 'terser'
// import pLimit from 'p-limit'
// import throttle from 'lodash.throttle'
// import servor from 'servor'

// const exec = util.promisify(execSync)

// const IS_PRODUCTION_MODE = process.env.NODE_ENV === 'production'
// const BABEL_CONFIG = loadBabelConfig()
// // const SVELTE_PREPROCESSOR_CONFIG = loadSveltePreprocessors()

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// function loadBabelConfig() {
//   if (existsSync('./babel.config.js')) {
//     return require(path.join(process.cwd(), 'babel.config.js'))
//   }

//   return {
//     plugins: [
//       [
//         'snowpack/assets/babel-plugin.js',
//         {
//           // Append .js to all src file imports
//           optionalExtensions: true,
//           importMap: '../dist/web_modules/import-map.json',
//         },
//       ],
//     ],
//   }
// }

// async function compile(srcPath, options, svelteOpts) {
//   const { outputDir = 'dist' } = options
//   // eslint-disable-next-line @typescript-eslint/no-empty-function
//   let logSvelteWarnings = () => {}

//   try {
//     let source = await fs.readFile(srcPath, 'utf8')
//     const isSvelte = srcPath.endsWith('.svelte')

//     // Only compile svelte files
//     if (isSvelte) {
//       const svelteOptions = {
//         // https://svelte.dev/docs#Compile_time
//         filename: srcPath,
//         dev: !IS_PRODUCTION_MODE,
//         hydratable: process.argv.includes('--hydratable'),
//         immutable: process.argv.includes('--immutable'),
//         ...svelteOpts,
//       }

//       const result = svelte.compile(source, svelteOptions)

//       logSvelteWarnings = () => {
//         result.warnings.forEach(warning => {
//           console.log('')
//           console.warn(
//             '\x1b[33m%s\x1b[0m',
//             `SVELTE WARNING (${warning.filename}) -> ${warning.message}`
//           )
//           console.warn(warning.frame)
//         })
//       }

//       source = result.js.code
//     }

//     const destPath = srcPath
//       .replace(/^src\//, `${outputDir}/`)
//       .replace(/.svelte$/, '.js')

//     // Create all ancestor directories for this file
//     await fs.mkdir(path.dirname(destPath), { recursive: true })
//     await fs.writeFile(destPath, source)

//     console.info(`Svelte compiled ${destPath}`)

//     return {
//       destPath,
//       logSvelteWarnings,
//     }
//   } catch (err) {
//     console.log('')
//     console.error(`Failed to compile with svelte: ${srcPath}`)
//     console.error(err)
//     console.log('')
//     return {
//       destPath: null,
//       logSvelteWarnings,
//     }
//   }
// }

async function compileHtml(destPath /*, options */) {
  // TODO: Exclude processing if this is not a page

  const buildPath = `${destPath}`.replace(/^dist\//, 'build/')
  const pagePath = `${destPath}`.replace(/.js$/, '.html')

  const srcPathSplit = destPath.split('/')
  const fileName = srcPathSplit[srcPathSplit.length - 1]

  try {
    // buildPath is the js file compile for ssr
    const Comp = require(path.join(process.cwd(), buildPath)).default

    const { head, html, css } = Comp.render({
      answer: 42,
    })

    await fs.mkdir(path.dirname(pagePath), { recursive: true })
    await fs.writeFile(
      pagePath,
      `
  <!DOCTYPE html>
  <html lang="en">
      <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          ${head}
          <style>${css && css.code}</style>
      </head>

      <body>
          <div id="app">${html}</div>

          <script type="module">
              import Comp from './${fileName}';

              new Comp({
                  target: document.querySelector('#app'),
                  hydrate: true
              });
          </script>
      </body>
  </html>
  `
    )

    console.info(`Compiled HTML ${pagePath}`)

    return { pagePath }
  } catch (err) {
    console.log('')
    console.error(`Failed to compile page: ${pagePath}`)
    console.error(err)
    console.log('')
    return {
      pagePath: null,
    }
  }
}

// async function copyFile(srcPath) {
//   const destPath = srcPath.replace(/^src\//, 'dist/')
//   // Create all ancestor directories for this file
//   await fs.mkdir(path.dirname(destPath), { recursive: true })
//   await fs.copyFile(srcPath, destPath)
//   console.info(`Copied asset ${destPath}`)
// }

// // Update the import paths to correctly point to web_modules.
// async function transform(destPath) {
//   try {
//     const source = await fs.readFile(destPath, 'utf8')

//     const transformed = await babel.transformAsync(source, BABEL_CONFIG)

//     await fs.writeFile(destPath, transformed.code)
//     console.info(`Babel transformed ${destPath}`)
//   } catch (err) {
//     console.log('')
//     console.error(`Failed to transform with babel: ${destPath}`)
//     console.error(err)
//     console.log('')
//   }
// }

// // Minify file with terser.
// async function minify(destPath) {
//   try {
//     const source = await fs.readFile(destPath, 'utf8')

//     const result = terser.minify(source, {
//       module: true,
//     })

//     await fs.writeFile(destPath, result.code)
//     console.info(`Terser minified ${destPath}`)
//   } catch (err) {
//     console.log('')
//     console.error(`Failed to minify with terser: ${destPath}`)
//     console.error(err)
//     console.log('')
//   }
// }

// // Only needs to run during the initial compile cycle. If a developer adds a new package dependency,
// // they should restart.
// const snowpack = async () => {
//   const maybeOptimize = IS_PRODUCTION_MODE ? '--optimize' : ''

//   console.info(`\nBuilding web_modules with snowpack...`)

//   try {
//     const snowpackLocation = path.resolve(
//       require.resolve('snowpack'),
//       '../index.bin.js'
//     )

//     const { stdout, stderr } = await exec(
//       `${snowpackLocation} --include 'dist/**/*' --dest dist/web_modules ${maybeOptimize}`
//     )

//     // TODO: hide behind --verbose flag
//     // Show any output from snowpack...
//     stdout && console.info(stdout)
//     stderr && console.info(stderr)
//   } catch (err) {
//     console.log('')
//     console.error('Failed to build with snowpack')
//     console.error(err.stderr || err)
//     // Don't continue trying to build if snowpack fails.
//     process.exit(1)
//   }
// }

// async function initialBuild() {
//   if (IS_PRODUCTION_MODE) console.info(`Building in production mode...`)

//   const concurrencyLimit = pLimit(8)
//   const globConfig = { nodir: true }
//   const svelteAndJsFiles = glob.sync(
//     'src/**/!(*+(spec|test)).+(js|mjs|svelte)',
//     globConfig
//   )
//   const otherAssetFiles = glob.sync(
//     'src/**/*.!(spec.[tj]s|test.[tj]s|[tj]s|mjs|svelte|md)',
//     globConfig
//   )

//   // Just copy all other asset types, no point in reading them.
//   await Promise.all(
//     otherAssetFiles.map(srcPath =>
//       concurrencyLimit(async () => copyFile(srcPath))
//     )
//   )

//   // Compile all source files with svelte.
//   const svelteWarnings = []
//   const destFiles = await Promise.all(
//     svelteAndJsFiles.map(srcPath =>
//       concurrencyLimit(async () => {
//         const { destPath, logSvelteWarnings } = await compile(
//           srcPath,
//           {
//             outputDir: 'dist',
//           },
//           {
//             hydratable: true,
//           }
//         )

//         svelteWarnings.push(logSvelteWarnings)
//         return destPath
//       })
//     )
//   )

//   // Compile all source files with svelte for SSR.
//   const buildFiles = await Promise.all(
//     svelteAndJsFiles.map(srcPath =>
//       concurrencyLimit(async () => {
//         const { destPath, logSvelteWarnings } = await compile(
//           srcPath,
//           {
//             outputDir: 'build',
//           },
//           {
//             generate: 'ssr',
//             hydratable: true,
//             // format: 'cjs',
//           }
//         )

//         svelteWarnings.push(logSvelteWarnings)
//         return destPath
//       })
//     )
//   )

//   // Need to run this (only once) before transforming the import paths, or else it will fail.
//   await snowpack()

//   // Transform all generated js files with babel.
//   await Promise.all(
//     destFiles.map(destPath =>
//       concurrencyLimit(async () => {
//         if (!destPath) return
//         await transform(destPath)
//       })
//     )
//   )

//   // Transform all build js files with babel.
//   await Promise.all(
//     buildFiles.map(destPath =>
//       concurrencyLimit(async () => {
//         if (!destPath) return
//         await transform(destPath)
//       })
//     )
//   )

//   // Compile html files from temp js components in build folder.
//   // const pages = await Promise.all(
//   //   destFiles.map(destPath =>
//   //     concurrencyLimit(async () => {
//   //       const { pagePath } = await compileHtml(destPath, {})
//   //       return pagePath
//   //     })
//   //   )
//   // )

//   // Minify js files with terser if in production.
//   if (IS_PRODUCTION_MODE && !process.argv.includes('--no-minify')) {
//     await Promise.all(
//       destFiles.map(destPath =>
//         concurrencyLimit(async () => {
//           if (!destPath) return
//           await minify(destPath)
//         })
//       )
//     )
//   }

//   // Log all svelte warnings
//   svelteWarnings.forEach(f => f())
// }

// function startWatchMode() {
//   console.info(`\nWatching for files...`)

//   const handleFile = async srcPath => {
//     // Copy updated non-js/non-svelte files
//     if (
//       !srcPath.endsWith('.svelte') &&
//       !srcPath.endsWith('.js') &&
//       !srcPath.endsWith('.mjs')
//     ) {
//       copyFile(srcPath)
//       return
//     }

//     const { destPath, logSvelteWarnings } = await compile(srcPath, {
//       // htmlOnly: true,
//     })
//     const { pagePath } = await compileHtml(destPath, {
//       // htmlOnly: true,
//     })
//     if (!destPath) return
//     await transform(destPath)
//     logSvelteWarnings()
//   }

//   const srcWatcher = chokidar.watch('src', {
//     ignored: /(^|[/\\])\../, // Ignore dotfiles
//     ignoreInitial: true, // Don't fire "add" events when starting the watcher
//   })

//   srcWatcher.on('add', handleFile)
//   // Throttle duplicate change events to prevent unnecessary recompiles
//   srcWatcher.on('change', throttle(handleFile, 500, { trailing: false }))
//   // srcWatcher.on('change', handleFile)
// }

// async function startDevServer() {
//   if (process.argv.includes('--no-serve')) return
//   const { url } = await servor({
//     root: './dist',
//     fallback: 'index.html',
//     port: 8080,
//     reload: true,
//   })
//   console.info(`Server running on ${url}`)
// }

// async function main() {
//   // const outputDirectory = 'public'
//   // const inputDirectory = 'src'
//   // const pages = ['index/index.svelte']

//   await initialBuild()
//   if (IS_PRODUCTION_MODE) return
//   startWatchMode()
//   startDevServer()
// }

// main()

export async function initialBuild() {
  if (IS_PRODUCTION_MODE) console.info(`Building in production mode...`)

  const concurrencyLimit = pLimit(8)
  const globConfig = { nodir: true }
  const svelteAndJsFiles = glob.sync(
    'src/**/!(*+(spec|test)).+(js|mjs|svelte)',
    globConfig
  )
  const otherAssetFiles = glob.sync(
    'src/**/*.!(spec.[tj]s|test.[tj]s|[tj]s|mjs|svelte|md)',
    globConfig
  )

  // Just copy all other asset types, no point in reading them.
  await Promise.all(
    otherAssetFiles.map(srcPath =>
      concurrencyLimit(async () => copyFile(srcPath))
    )
  )

  // Compile all source files with svelte.
  const svelteWarnings = []
  // const destFiles = await Promise.all(
  //   svelteAndJsFiles.map(srcPath =>
  //     concurrencyLimit(async () => {
  //       const { destPath, logSvelteWarnings } = await compile(srcPath)
  //       svelteWarnings.push(logSvelteWarnings)
  //       return destPath
  //     })
  //   )
  // )
  const destFiles = await Promise.all(
    svelteAndJsFiles.map(srcPath =>
      concurrencyLimit(async () => {
        const { destPath, logSvelteWarnings } = await compile(
          srcPath,
          {
            outputDir: 'dist',
          },
          {
            hydratable: true,
          }
        )

        svelteWarnings.push(logSvelteWarnings)
        return destPath
      })
    )
  )

  // Compile all source files with svelte for SSR.
  const buildFiles = await Promise.all(
    svelteAndJsFiles.map(srcPath =>
      concurrencyLimit(async () => {
        const { destPath, logSvelteWarnings } = await compile(
          srcPath,
          {
            outputDir: 'build',
          },
          {
            generate: 'ssr',
            hydratable: true,
            // format: 'cjs',
          }
        )

        svelteWarnings.push(logSvelteWarnings)
        return destPath
      })
    )
  )

  // Compile html files from temp js components in build folder.
  const pages = await Promise.all(
    destFiles.map(destPath =>
      concurrencyLimit(async () => {
        const { pagePath } = await compileHtml(destPath, {})
        return pagePath
      })
    )
  )

  try {
    // Need to run this (only once) before transforming the import paths, or else it will fail.
    await snowpack('dist/**/*')
  } catch (err) {
    console.error('\n\nFailed to build with snowpack')
    err && console.error(err.stderr || err)
    // Don't continue building...
    process.exit(1)
  }

  // Transform all generated js files with babel.
  await Promise.all(
    destFiles.map(destPath =>
      concurrencyLimit(async () => {
        if (!destPath) return
        await transform(destPath, false)
      })
    )
  )

  // Transform all build js files with babel.
  await Promise.all(
    buildFiles.map(destPath =>
      concurrencyLimit(async () => {
        if (!destPath) return
        await transform(destPath, false)
      })
    )
  )

  // Minify js files with terser if in production.
  if (IS_PRODUCTION_MODE && !process.argv.includes('--no-minify')) {
    await Promise.all(
      destFiles.map(destPath =>
        concurrencyLimit(async () => {
          if (!destPath) return
          await minify(destPath)
        })
      )
    )
  }

  // Log all svelte warnings
  svelteWarnings.forEach(f => f())
}

async function main() {
  await cleanDist()
  await initialBuild()
  if (IS_PRODUCTION_MODE) return
  startWatchMode()
  startDevServer()
}

main()
