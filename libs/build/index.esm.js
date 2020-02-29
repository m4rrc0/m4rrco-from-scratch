/* eslint-disable no-console */
import * as util from 'util'
import { exec as execSync } from 'child_process'
import { promises as fs, existsSync } from 'fs'
import * as path from 'path'
import * as svelte from 'svelte/compiler'
// require('svelte/register')({
//     // extensions: ['.customextension'], // defaults to ['.html', '.svelte']
//     // preserveComments: true,
//     generate: 'ssr',
//     hydratable: true,
//     // format: 'cjs',
// });
import * as chokidar from 'chokidar'
import * as babel from '@babel/core'
import * as glob from 'glob'
import * as terser from 'terser'
import pLimit from 'p-limit'

const exec = util.promisify(execSync)

const IS_PRODUCTION_MODE = process.env.NODE_ENV === 'production'

// Check for and load a custom babel config file
const BABEL_CONFIG = existsSync('./babel.config.js')
  ? require(path.join(process.cwd(), 'babel.config.js'))
  : {
      plugins: [
        [
          'snowpack/assets/babel-plugin.js',
          {
            // Append .js to all src file imports
            optionalExtensions: true,
          },
        ],
      ],
    }

async function compile(srcPath) {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  let logSvelteWarnings = () => {}

  try {
    const source = await fs.readFile(srcPath, 'utf8')
    const isSvelte = srcPath.endsWith('.svelte')

    let newSource = source
    let buildSource = source
    // Only compile svelte files
    if (isSvelte) {
      const svelteOptions = {
        // https://svelte.dev/docs#Compile_time
        filename: srcPath,
        dev: !IS_PRODUCTION_MODE,
        hydratable: process.argv.includes('--hydratable'),
        immutable: process.argv.includes('--immutable'),
      }
      // first pass for html
      const ssrApp = svelte.compile(source, {
        ...svelteOptions,
        generate: 'ssr',
        hydratable: true,
        format: 'cjs',
      })
      // second pass for js
      const clientApp = svelte.compile(source, {
        ...svelteOptions,
        // hydrate: true, // output hydrating js
      })

      // const result = svelte.compile(source, svelteOptions);

      logSvelteWarnings = () => {
        clientApp.warnings.forEach(warning => {
          console.log('')
          console.warn(
            '\x1b[33m%s\x1b[0m',
            `SVELTE WARNING (${warning.filename}) -> ${warning.message}`
          )
          console.warn(warning.frame)
        })
      }

      newSource = clientApp.js.code
      buildSource = ssrApp.js.code
    }

    // console.log(Comp.render);

    // const { head, html, css } = Comp.render({
    //     // answer: 42,
    // });

    const destPath = srcPath
      .replace(/^src\//, 'dist/')
      .replace(/.svelte$/, '.js')
    const destBuild = destPath.replace(/^dist\//, 'build/')

    // Create all ancestor directories for this file
    await fs.mkdir(path.dirname(destPath), { recursive: true })
    await fs.writeFile(destPath, newSource)

    await fs.mkdir(path.dirname(destBuild), { recursive: true })
    await fs.writeFile(destBuild, buildSource)

    // await fs.writeFile(
    //     destHtml,
    //     `
    // <!DOCTYPE html>
    // <html lang="en">
    //     <head>
    //         <meta charset="utf-8" />
    //         <meta name="viewport" content="width=device-width, initial-scale=1" />
    //         ${head}
    //         <style>${css && css.code}</style>
    //     </head>

    //     <body>
    //         <div id="app">${html}</div>

    //         <script type="module">
    //             import Comp from './${fileName}';

    //             new Comp({
    //                 target: document.querySelector('#app'),
    //                 hydrate: true
    //             });
    //         </script>
    //     </body>
    // </html>
    // `
    // );

    console.info(`Svelte compiled ${destPath}`)

    return {
      destPath,
      logSvelteWarnings,
      destBuild,
    }
  } catch (err) {
    console.log('')
    console.error(`Failed to compile with svelte: ${srcPath}`)
    console.error(err)
    console.log('')
    return {
      destPath: null,
      logSvelteWarnings,
    }
  }
}

async function compileHtml(outJsPath) {
  const buildPath = `${outJsPath}`.replace(/^dist\//, 'build/')
  // srcPath is the js file output by compile
  const Comp = require(path.join(process.cwd(), buildPath)).default
  // const App = require('../examples/basic/src/App.svelte').default;

  console.log({ Comp })

  const htmlPath = outJsPath.replace(/.js$/, '.html')
  const srcPathSplit = buildPath.split('/')
  const fileName = srcPathSplit[srcPathSplit.length - 1]
  console.log({ fileName })

  const { head, html, css } = Comp.render({
    answer: 42,
  })

  // const destPath = 'dist/index.html';
  // Create all ancestor directories for this file
  // await fs.mkdir(path.dirname(destPath), { recursive: true });
  //     await fs.writeFile(
  //         destPath,
  //         `
  // <!DOCTYPE html>
  // <html lang="en">
  //     <head>
  //         <meta charset="utf-8" />
  //         <meta name="viewport" content="width=device-width, initial-scale=1" />
  //         ${head}
  //         <style>${css.code}</style>
  //     </head>

  //     <body>
  //         <div id="app">${html}</div>

  //         <script type="module">
  //             import App from './App.js';

  //             new App({
  //                 target: document.querySelector('#app'),
  //                 hydrate: true
  //             });
  //         </script>
  //     </body>
  // </html>
  // `
  //     );
  await fs.writeFile(
    htmlPath,
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
}

async function copyFile(srcPath) {
  const destPath = srcPath.replace(/^src\//, 'dist/')
  // Create all ancestor directories for this file
  await fs.mkdir(path.dirname(destPath), { recursive: true })
  // await fs.copyFile(srcPath, destPath);
  // console.info(`Copied asset ${destPath}`);
}

// Update the import paths to correctly point to web_modules.
async function transform(destPath) {
  try {
    const source = await fs.readFile(destPath, 'utf8')

    const transformed = await babel.transformAsync(source, BABEL_CONFIG)

    await fs.writeFile(destPath, transformed.code)
    console.info(`Babel transformed ${destPath}`)
  } catch (err) {
    console.log('')
    console.error(`Failed to transform with babel: ${destPath}`)
    console.error(err)
    console.log('')
  }
}

// Minify file with terser.
async function minify(destPath) {
  try {
    const source = await fs.readFile(destPath, 'utf8')

    const result = terser.minify(source, {
      module: true,
    })

    await fs.writeFile(destPath, result.code)
    console.info(`Terser minified ${destPath}`)
  } catch (err) {
    console.log('')
    console.error(`Failed to minify with terser: ${destPath}`)
    console.error(err)
    console.log('')
  }
}

// Only needs to run during the initial compile cycle. If a developer adds a new package dependency,
// they should restart svelvet.
const snowpack = async () => {
  const maybeOptimize = IS_PRODUCTION_MODE ? '--optimize' : ''

  console.info(`\nBuilding web_modules with snowpack...`)

  try {
    const snowpackLocation = path.resolve(
      require.resolve('snowpack'),
      '../index.bin.js'
    )

    const { stdout, stderr } = await exec(
      `${snowpackLocation} --include 'dist/**/*' --dest dist/web_modules ${maybeOptimize}`
    )

    // TODO: hide behind --verbose flag
    // Show any output from snowpack...
    stdout && console.info(stdout)
    stderr && console.info(stderr)
  } catch (err) {
    console.log('')
    console.error('Failed to build with snowpack')
    console.error(err.stderr || err)
    // Don't continue trying to build if snowpack fails.
    process.exit(1)
  }
}

async function initialBuild() {
  if (IS_PRODUCTION_MODE) console.info(`Building in production mode...`)

  const concurrencyLimit = pLimit(8)
  const globConfig = { nodir: true }
  const svelteAndJsFiles = glob.sync(
    'src/**/!(*+(spec|test)).+(js|mjs|svelte)',
    globConfig
  )
  const otherAssetFiles = glob.sync(
    'src/**/*.!(spec.[tj]s|test.[tj]s|[tj]s|mjs|svelte)',
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
  const destFiles = await Promise.all(
    svelteAndJsFiles.map(srcPath =>
      concurrencyLimit(async () => {
        const { destPath, logSvelteWarnings } = await compile(srcPath)
        svelteWarnings.push(logSvelteWarnings)
        return destPath
      })
    )
  )

  // Need to run this (only once) before transforming the import paths, or else it will fail.
  await snowpack()

  // Transform all generated js files with babel.
  await Promise.all(
    destFiles.map(destPath =>
      concurrencyLimit(async () => {
        if (!destPath) return
        // compile static html
        await compileHtml(destPath)
        await transform(destPath)
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

function startWatchMode() {
  console.info(`Watching for files...`)

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

    const { destPath, logSvelteWarnings } = await compile(srcPath)
    if (!destPath) return
    await transform(destPath)
    logSvelteWarnings()
  }

  const srcWatcher = chokidar.watch('src', {
    ignored: /(^|[/\\])\../, // Ignore dotfiles
    ignoreInitial: true, // Don't fire "add" events when starting the watcher
  })

  srcWatcher.on('add', handleFile)
  srcWatcher.on('change', handleFile)
}

async function main() {
  await initialBuild()
  if (!IS_PRODUCTION_MODE) startWatchMode()
}

main()
