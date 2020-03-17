import { promises as fs, existsSync } from 'fs';
import * as chokidar from 'chokidar';
import * as glob from 'glob';
import pLimit from 'p-limit';
import * as path from 'path';
import throttle from 'lodash.throttle';
import liveServer from 'live-server';
// IDEA: we can use npm package "minify" to also process CSS
import { minify as htmlMinifier } from 'html-minifier';
import sass from 'node-sass';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import postcssPresetEnv from 'postcss-preset-env';
import cssnano from 'cssnano';

import slugify from '../../utils/slugify';
import {
  cleanDist,
  copyFile,
  compile,
  snowpack,
  transform,
  minify,
  // startWatchMode,
  // startDevServer,
} from './svelvet';

const IS_PRODUCTION_MODE = process.env.NODE_ENV === 'production';

export function startWatchMode() {
  console.info(`\nWatching for files...`);

  const handleFile = async srcPath => {
    // Copy updated non-js/svelte files
    if (
      !srcPath.endsWith('.svelte') &&
      !srcPath.endsWith('.md') &&
      !srcPath.endsWith('.js') &&
      !srcPath.endsWith('.mjs')
    ) {
      copyFile(srcPath);
      return;
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
    );
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
    );

    if (!destPath) return;
    await transform(destPath, true);
    logSvelteWarnings();
    logSvelteWarnings2();

    if (isPage(destPath)) {
      const pageDef = makePageDef(destPath);
      const { pagePath } = await compileHtml(pageDef, {});
    }
  };

  const srcWatcher = chokidar.watch('src', {
    ignored: /(^|[/\\])\../, // Ignore dotfiles
    ignoreInitial: true, // Don't fire "add" events when starting the watcher
  });

  srcWatcher.on('add', handleFile);
  // Throttle duplicate change events to prevent unnecessary recompiles
  srcWatcher.on('change', throttle(handleFile, 500, { trailing: false }));
}

async function startDevServer() {
  if (process.argv.includes('--no-serve')) return;

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
  };
  liveServer.start(params);
  // console.info(`Server running on port ${params.port}`)
}

async function compileHtml(pageDef /*, options */) {
  const {
    path: p,
    name,
    component,
    props: propsInit,
    options: { noJS } = {},
  } = pageDef;
  const props = { url: p, propsInit };
  if (!p || !component) {
    console.error(`unable to create HTML for page ${name}`, pageDef);
    return;
  }
  // TODO: don't load JS if it is an individual page (not SPA) and there are no side effects in this page
  // IDEA: check the content of the JS output of Comp.render to see if there are dom events or onMount svelte method or things like that

  // buildPath is the js file that has been compiled for ssr
  // const buildPath = `build/${component}`.replace(/^dist\//, "build/");
  const buildPath = `build/${component}`;
  let pagePath = /index$/.test(p) ? p : `${p}/index`; // all pages are 'index.html' inside the appropriate folder
  pagePath = `dist${pagePath}.html`.replace(/\/\/+/, '/'); // avoid double slashes in case path is '/' for example
  const importPath = /.js$/.test(component) ? component : `${component}.js`;

  try {
    const Comp = require(path.join(process.cwd(), buildPath)).default;

    const { head, html, css } = Comp.render({
      ...props,
    });

    if (/no-js/.test(html)) {
      console.log(html);
    }

    let outputHtml = `
<!DOCTYPE html>
  <html lang="en">
  <head>
    ${head}
    <link rel="stylesheet" type="text/css" href="/global.css">
    <style>${css && css.code}</style>
  </head>
  <body>
    <div id="app">${html}</div>
    ${
      !noJS
        ? `<script type="module" async>
      import Comp from '/${importPath}';
      new Comp({
          target: document.querySelector('#app'),
          hydrate: true,
          props: ${props && JSON.stringify(props)}
      });
    </script>`
        : ''
    }
  </body>
</html>
    `;

    // Minify HTML files with html-minifier if in production.
    if (IS_PRODUCTION_MODE && !process.argv.includes('--no-minify')) {
      outputHtml = await minifyHtml({ html: outputHtml });
    }

    await fs.mkdir(path.dirname(pagePath), { recursive: true });
    await fs.writeFile(pagePath, outputHtml);

    console.info(`Compiled HTML ${pagePath}`);

    return { pagePath };
  } catch (err) {
    console.log('');
    console.error(`Failed to compile page: ${pagePath}`);
    console.error(err);
    console.log('');
    process.exit(1);
    return { pagePath };
  }
}

const programmaticRoutes =
  require(path.join(process.cwd(), '/src/routes.js')).default || [];

const isPage = destPath => {
  // destPath is like "dist/_pages/tests/spa/index.js"
  const isAutoRoute = /^dist\/_pages\//.test(destPath);

  const component = destPath.replace('dist/', '');
  const isProgrammaticRoute =
    programmaticRoutes.filter(({ component: prComp }) => prComp === component)
      .length > 0;

  return isAutoRoute || isProgrammaticRoute;
};

const makePageDef = destPath => {
  const component = destPath.replace('dist/', '');
  const compSplit = component.split('/');
  let name = compSplit[compSplit.length - 1].replace(/.js$/, '');
  name =
    name === 'index' && compSplit.length > 2
      ? compSplit[compSplit.length - 2]
      : name;
  // const p = slugify(component.replace('/pages', '').replace(/.js$/, ''))
  let p = component.replace(/^_pages/, '').replace(/.js$/, '');
  // TODO: slugify should keep '/' characters so we don't have to split/join ?
  p = p
    .split('/')
    .map(piece => slugify(piece))
    .join('/');
  return {
    path: p,
    name,
    component,
    props: {},
  };
};

async function minifyHtml({ html, pagePath }) {
  try {
    let outputHtml = html || '';

    if (!html) {
      outputHtml = await fs.readFile(pagePath, 'utf8');
    }

    const result = htmlMinifier(outputHtml, {
      caseSensitive: true,
      collapseBooleanAttributes: true,
      collapseWhitespace: true,
      conservativeCollapse: true,
      keepClosingSlash: true,
      minifyCSS: true,
      removeComments: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      useShortDoctype: true,
    });

    if (html) {
      return result;
    }

    await fs.writeFile(pagePath, result);
    console.info(`HTML-minifier minified ${pagePath}`);
  } catch (err) {
    console.log('');
    console.error(`Failed to minify with HTML-minifier: ${pagePath}`);
    console.error(err);
    console.log('');
    return html;
  }
}

async function compileSass({ entryPath: file, includePaths }) {
  const outputPath = file.replace(/\.scss$/, '.css').replace(/^src/, 'dist');
  let output = '';
  try {
    sass.render(
      {
        file,
        // includePaths: ['lib/', 'mod/'],
        includePaths,
        outputStyle: 'compressed',
      },
      async function(error, result) {
        // node-style callback from v3.0.0 onwards
        if (error) {
          // console.log(error.status); // used to be "code" in v2x and below
          // console.log(error.column);
          // console.log(error.message);
          // console.log(error.line);
          console.log(JSON.stringify(error));
          throw new Error(error);
        } else {
          // console.log(result.css.toString());
          // console.log(result.stats);
          // console.log(result.map.toString());
          // or better
          // console.log(JSON.stringify(result.map)); // note, JSON.stringify accepts Buffer too

          output = result.css.toString();

          // await fs.writeFile(outputPath, output);
          postcss([postcssPresetEnv, autoprefixer, cssnano])
            .process(output, { from: file, to: outputPath })
            .then(postcssed => {
              fs.writeFile(outputPath, postcssed.css);
              if (postcssed.map) {
                fs.writeFile(`${outputPath}.map`, postcssed.map);
              }
              console.log(
                `SASS files compiled in ${outputPath} in ${result.stats.duration}ms`
              );
            })
            .catch(err => {
              console.log(`SASS files could not compile in ${outputPath}`);
              console.error(err);
            });
        }
      }
    );
  } catch (err) {
    console.log('');
    console.error(`Failed to compile sass: ${file}`);
    console.error(err);
    console.log('');
  }
}

async function initialBuild() {
  if (IS_PRODUCTION_MODE) console.info(`Building in production mode...`);

  const concurrencyLimit = pLimit(8);
  const globConfig = { nodir: true };
  const svelteAndJsFiles = glob.sync(
    'src/**/!(*+(spec|test)).+(js|mjs|svelte|md)',
    globConfig
  );
  const sassFiles = glob.sync('src/**/!(*+(spec|test)).+(scss)', globConfig);
  const otherAssetFiles = glob.sync(
    'src/**/*.!(spec.[tj]s|test.[tj]s|[tj]s|mjs|svelte|md|scss)',
    globConfig
  );

  // Just copy all other asset types, no point in reading them.
  await Promise.all(
    otherAssetFiles.map(srcPath =>
      concurrencyLimit(async () => copyFile(srcPath))
    )
  );

  // Compile sass and css files
  // await Promise.all(
  //   sassFiles.map(sassEntryPath =>
  //     concurrencyLimit(async () => compileSass(sassEntryPath))
  //   )
  // );
  // console.log(__dirname);
  // console.log(process.cwd());
  await compileSass({
    // entryPath: `${process.cwd()}/src/global.scss`,
    entryPath: `src/global.scss`,
    // includePaths: [`${process.cwd()}/src/styles`],
  });

  const svelteWarnings = [];

  // Compile all source files with svelte.
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
        );

        svelteWarnings.push(logSvelteWarnings);
        return destPath;
      })
    )
  );

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
        );

        svelteWarnings.push(logSvelteWarnings);
        return destPath;
      })
    )
  );

  try {
    // Need to run this (only once) before transforming the import paths, or else it will fail.
    await snowpack('dist/**/*');
    // await snowpack('build/**/*', { outputDir: '' })
  } catch (err) {
    console.error('\n\nFailed to build with snowpack');
    err && console.error(err.stderr || err);
    // Don't continue building...
    process.exit(1);
  }

  // Transform all generated js files with babel.
  await Promise.all(
    destFiles.map(destPath =>
      concurrencyLimit(async () => {
        if (!destPath) return;
        await transform(destPath, false);
      })
    )
  );

  // Transform all build js files with babel.
  // await Promise.all(
  //   buildFiles.map(destPath =>
  //     concurrencyLimit(async () => {
  //       if (!destPath) return
  //       await transform(destPath, false)
  //     })
  //   )
  // )

  const autoRoutes = destFiles
    .filter(r => /^dist\/_pages\//.test(r))
    .map(r => {
      const component = r.replace('dist/', '');
      const compSplit = component.split('/');
      let name = compSplit[compSplit.length - 1].replace(/.js$/, '');
      name =
        name === 'index' && compSplit.length > 2
          ? compSplit[compSplit.length - 2]
          : name;
      // const p = slugify(component.replace('/pages', '').replace(/.js$/, ''))
      let p = component.replace(/^_pages/, '').replace(/.js$/, '');
      // TODO: slugify should keep '/' characters so we don't have to split/join ?
      p = p
        .split('/')
        .map(piece => slugify(piece))
        .join('/');
      return {
        path: p,
        name,
        component,
        data: {},
      };
    });

  // Compile html files from temp js components in build folder.
  const pages = await Promise.all(
    autoRoutes.map(pageDef =>
      concurrencyLimit(async () => {
        const { pagePath } = await compileHtml(pageDef, {});
        return pagePath;
      })
    )
  );
  // Compile html files from temp js components in build folder.
  const programmaticPages = await Promise.all(
    programmaticRoutes.map(pageDef =>
      concurrencyLimit(async () => {
        const { pagePath } = await compileHtml(pageDef, {});
        return pagePath;
      })
    )
  );

  // Minify js files with terser if in production.
  if (IS_PRODUCTION_MODE && !process.argv.includes('--no-minify')) {
    await Promise.all(
      destFiles.map(destPath =>
        concurrencyLimit(async () => {
          if (!destPath) return;
          await minify(destPath);
        })
      )
    );
  }
  // Minify HTML files with terser if in production.
  // if (IS_PRODUCTION_MODE && !process.argv.includes('--no-minify')) {
  //   await Promise.all(
  //     [...pages, ...programmaticPages].map(pagePath =>
  //       concurrencyLimit(async () => {
  //         if (!pagePath) return
  //         await minifyHtml(pagePath)
  //       })
  //     )
  //   )
  // }

  // Log all svelte warnings
  svelteWarnings.forEach(f => f());
}

async function main() {
  await cleanDist();
  await initialBuild();
  if (IS_PRODUCTION_MODE) return;
  startWatchMode();
  startDevServer();
}

main();
