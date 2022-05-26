const postcss = require('rollup-plugin-postcss');
const url = require('postcss-url');
const images = require('@rollup/plugin-image');

module.exports = {
  rollup(config, options) {
    config.plugins = [
      postcss({
        inject: true, //  true
        extract: !!options.writeMeta,
        plugins: [
          url({
            url: 'inline', // enable inline assets using base64 encoding
            maxSize: 10, // maximum file size to inline (in kilobytes)
            fallback: 'copy', // fallback method to use if max size is exceeded
          }),
        ],
      }),
      ...config.plugins,
    ];
    return config;
  },
};
