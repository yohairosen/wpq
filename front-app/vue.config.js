module.exports = {
  runtimeCompiler: true,
  filenameHashing: false,
  transpileDependencies:[/node_modules[/\\\\]vuetify[/\\\\]/],

  chainWebpack: config => {
    if(config.plugins.has('extract-css')) {
      const extractCSSPlugin = config.plugin('extract-css')
      extractCSSPlugin && extractCSSPlugin.tap(() => [{
        filename: '[name].css',
        chunkFilename: '[name].css',
      }])
    }

    if (config.module.rule('scss').oneOf('vue-modules').uses.store.has('extract-css-loader')) {
      config.module.rule('scss').oneOf('vue-modules').uses.store.get('extract-css-loader').store.get('options').publicPath = './';
      config.module.rule('scss').oneOf('vue').uses.store.get('extract-css-loader').store.get('options').publicPath = './';
      config.module.rule('scss').oneOf('normal-modules').uses.store.get('extract-css-loader').store.get('options').publicPath = './';
      config.module.rule('scss').oneOf('normal').uses.store.get('extract-css-loader').store.get('options').publicPath = './';
    }
  },

  configureWebpack: {
    output: {
      filename: '[name].js',
      chunkFilename: '[name].js',
    }
  },

  baseUrl: '/wp-content/plugins/finance-questionnaire/front-app/dist',

}