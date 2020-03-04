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
} from './svelvet'

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

async function compileHtml(destPath /*, options */) {
  // TODO: Exclude processing if this is not a page

  const buildPath = `${destPath}`.replace(/^dist\//, 'build/')
  const pagePath = `${destPath}`.replace(/.js$/, '.html')

  const srcPathSplit = destPath.split('/')
  const fileName = srcPathSplit[srcPathSplit.length - 1]

  try {
    // buildPath is the js file compile for ssr
    console.log({ buildPath })
    console.log(path.join(process.cwd(), buildPath))
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

    await fs.mkdir(path.dirname(pagePath), { recursive: true })
    await fs.writeFile(
      pagePath,
      `
  <!DOCTYPE html>
  <html lang="en">
      <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>

      <body>
          <div id="app"></div>

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

    console.info(`Compiled fallback HTML ${pagePath}`)

    return {
      pagePath: null,
    }
  }
}

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

  try {
    // Need to run this (only once) before transforming the import paths, or else it will fail.
    await snowpack('dist/**/*')
    await snowpack('build/**/*', { outputDir: '' })
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

  const routes = ['dist/index.js']

  // Compile html files from temp js components in build folder.
  const pages = await Promise.all(
    routes.map(destPath =>
      concurrencyLimit(async () => {
        const { pagePath } = await compileHtml(destPath, {})
        return pagePath
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
