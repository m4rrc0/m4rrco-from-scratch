import { promises as fs, existsSync } from 'fs'
import * as chokidar from 'chokidar'
import * as glob from 'glob'
import pLimit from 'p-limit'
import * as path from 'path'
import throttle from 'lodash.throttle'
import liveServer from 'live-server'

import slugify from '../../utils/slugify'
import {
  cleanDist,
  copyFile,
  compile,
  snowpack,
  transform,
  minify,
  // startWatchMode,
  // startDevServer,
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

async function startDevServer() {
  if (process.argv.includes('--no-serve')) return

  var params = {
    // host: '100.115.92.205', // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
    root: 'dist', // Set root directory that's being served. Defaults to cwd.
    file: '404.html', // When set, serve this file (server root relative) for every 404 (useful for single-page applications)
    // port: 8080, // Set the server port. Defaults to 8080.
    reload: true,
    open: false, // When false, it won't load your browser by default.

    // ignore: 'scss,my/templates', // comma-separated string for paths to ignore
    // wait: 1000, // Waits for all changes, before reloading. Defaults to 0 sec.
    // mount: [['/components', './node_modules']], // Mount a directory to a route.
    // logLevel: 2, // 0 = errors only, 1 = some, 2 = lots
    // middleware: [function(req, res, next) { next(); }] // Takes an array of Connect-compatible middleware that are injected into the server middleware stack
  }
  liveServer.start(params)
  // console.info(`Server running on port ${params.port}`)
}

async function compileHtml(pageDef /*, options */) {
  const { path: p, name, component, data } = pageDef
  if (!p || !component) {
    console.error(`unable to create HTML for page ${name}`, pageDef)
    return
  }
  // TODO: Exclude processing if this is not a page

  // const buildPath = `${destPath}`.replace(/^dist\//, 'build/')
  // const pagePath = `${destPath}`.replace(/.js$/, '.html')

  // const srcPathSplit = destPath.split('/')
  // const fileName = srcPathSplit[srcPathSplit.length - 1]

  console.log({ p, name, component, data })

  const buildPath = `build/${component}`.replace(/^dist\//, 'build/')
  let pagePath = /index$/.test(p) ? p : `${p}/index`
  pagePath = `dist${pagePath}.html`.replace(/\/+/, '/') // avoir double slashes in case path is '/' for example
  // const pagePath = p === '/' ? 'dist/index.html' : `dist${p}/index.html`
  const importPath = /.js$/.test(component) ? component : `${component}.js`

  try {
    // buildPath is the js file compile for ssr
    const Comp = require(path.join(process.cwd(), buildPath)).default

    const { head, html, css } = Comp.render({
      ...data,
    })
    console.log({ p, pagePath, importPath })

    await fs.mkdir(path.dirname(pagePath), { recursive: true })
    await fs.writeFile(
      pagePath,
      `
  <!DOCTYPE html>
      <head>
          ${head}
          <style>${css && css.code}</style>
      </head>
      <body>
          <div id="app">${html}</div>
          <script type="module">
              import Comp from '/${importPath}';
              new Comp({
                  target: document.querySelector('#app'),
                  hydrate: true,
                  props: ${data && JSON.stringify(data)}
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
    process.exit(1)
  }
}

export async function initialBuild() {
  if (IS_PRODUCTION_MODE) console.info(`Building in production mode...`)

  const concurrencyLimit = pLimit(8)
  const globConfig = { nodir: true }
  const svelteAndJsFiles = glob.sync(
    'src/**/!(*+(spec|test)).+(js|mjs|svelte|md)',
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
    // await snowpack('build/**/*', { outputDir: '' })
    await snowpack('build/**/*', { outputDir: 'build' })
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

  const programmaticRoutes =
    require(path.join(process.cwd(), '/src/routes.js')).default || []

  const autoRoutes = destFiles
    .filter(r => /^dist\/pages\//.test(r))
    .map(r => {
      const component = r.replace('dist/', '')
      const compSplit = component.split('/')
      let name = compSplit[compSplit.length - 1].replace(/.js$/, '')
      name =
        name === 'index' && compSplit.length > 2
          ? compSplit[compSplit.length - 2]
          : name
      // const p = slugify(component.replace('/pages', '').replace(/.js$/, ''))
      let p = component.replace(/^pages/, '').replace(/.js$/, '')
      // TODO: slugify should keep '/' characters so we don't have to split/join ?
      p = p
        .split('/')
        .map(piece => slugify(piece))
        .join('/')
      return {
        path: p,
        name,
        component,
        data: {},
      }
    })

  // Compile html files from temp js components in build folder.
  const pages = await Promise.all(
    autoRoutes.map(pageDef => {
      concurrencyLimit(async () => {
        const { pagePath } = await compileHtml(pageDef, {})
        return pagePath
      })
    })
  )
  // Compile html files from temp js components in build folder.
  const programmaticPages = await Promise.all(
    programmaticRoutes.map(pageDef => {
      concurrencyLimit(async () => {
        const { pagePath } = await compileHtml(pageDef, {})
        return pagePath
      })
    })
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
