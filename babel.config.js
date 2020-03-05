module.exports = {
  plugins: [
    [
      'snowpack/assets/babel-plugin.js',
      {
        // Append .js to all src file imports
        optionalExtensions: true,
        importMap: '../dist/web_modules/import-map.json',
      },
    ],
  ],
}
