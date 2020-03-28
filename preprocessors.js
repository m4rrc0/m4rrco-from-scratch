// import * as path from 'path'
import { mdsvex } from 'mdsvex';
// import image from 'svelte-image';
import image from './src/svelte-image';

// const autoPreprocess = require('svelte-preprocess');

module.exports = [
  mdsvex({
    extension: '.md', // the default is '.svexy', if you lack taste, you might want to change it
    // layout: path.join(__dirname, './src/templates/index.svelte'), // this needs to be an absolute path
    // layout: '../../templates/index.js', // this needs to be an absolute path
    // parser: md => md.use(SomePlugin), // you can add markdown-it plugins if the feeling takes you
    // you can add markdown-it options here, html is always true
    // markdownOptions: {
    //   typographer: true,
    //   linkify: true,
    //   highlight: (str, lang) => whatever(str, lang), // this should be a real function if you want to highlight
    // },
  }),
  image({
    outputDir: '/dist',
    placeholder: 'trace',
    // placeholder: 'blur',
    // Potrace options for SVG placeholder
    trace: {
      background: '#fff',
      // color: "#002fa7",
      color: '#000',
      threshold: 120,
    },
  }),
  // autoPreprocess({
  //     typescript: {
  //         compilerOptions: {
  //             target: 'es2019',
  //             baseUrl: './src',
  //         },
  //         transpileOnly: true,
  //     },
  // }),
];
