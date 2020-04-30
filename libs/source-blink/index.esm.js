import { promises as fs, existsSync } from 'fs';
// import * as chokidar from 'chokidar';
import * as glob from 'glob';
import pLimit from 'p-limit';
// import * as path from 'path';
// import throttle from 'lodash.throttle';
// import liveServer from 'live-server';
// import slugify from '../../utils/slugify';
// import FlexSearch from 'flexsearch';
import loki from 'lokijs';
import frontMatter from 'front-matter';

const IS_PRODUCTION_MODE = process.env.NODE_ENV === 'production';

export async function fetchLocalData() {
  if (IS_PRODUCTION_MODE) console.info(`Building in production mode...`);

  const concurrencyLimit = pLimit(8);
  const globConfig = { nodir: true };
  // const svelteAndJsFiles = glob.sync(
  //   'src/**/!(*+(spec|test)).+(js|mjs|svelte|md)',
  //   globConfig
  // );
  // const cssFiles = glob.sync('src/**/!(*+(spec|test)).+(css)', globConfig);
  // const otherAssetFiles = glob.sync(
  //   'src/**/*.!(spec.[tj]s|test.[tj]s|[tj]s|mjs|svelte|md|css)',
  //   globConfig
  // );

  const mdFilesPaths = glob.sync(
    'data/**/!(*+(spec|test)).+(js|mjs|svelte|md)',
    globConfig
  );
  const jsonFilesPaths = glob.sync(
    'data/**/!(*+(spec|test)).+(json)',
    globConfig
  );

  let mdFiles = [];
  let jsonFiles = [];

  try {
    mdFiles = mdFilesPaths.map(async path => {
      const src = await fs.readFile(path, 'utf8');
      const fakePath = path.replace('data', 'src');
      // console.log({ path: fakePath, src });
      return { path: fakePath, src };
    });
    // console.log({ mdFiles });
    jsonFiles = jsonFilesPaths.map(
      async path => await fs.readFile(path, 'utf8')
    );
  } catch (error) {
    console.error('No file found in local source');
    throw new Error(error);
  }

  return Promise.all(mdFiles).then(files => {
    // console.log({ resolve });
    // console.log({ mdFiles, jsonFiles });
    // return resolve;

    // var indexDocs = new FlexSearch('speed');
    const db = new loki('build');
    var docs = db.addCollection('docs', { indices: ['id'] });
    var tags = db.addCollection('tags');

    const objFiles = files.map(({ path: srcPath, src }) => ({
      srcPath,
      raw: src,
      ...frontMatter(src),
    }));
    // console.log(objFiles);

    objFiles.forEach(f => {
      docs.insert(f);
    });

    // console.log(docs.data);
    // console.log({
    //   DOC: docs.where(o => {
    //     console.log(o);
    //     return /testing/.test(o.attributes.id);
    //   }),
    // });

    return docs;
  });
}

fetchLocalData();
