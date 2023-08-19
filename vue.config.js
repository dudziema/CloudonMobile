const {defineConfig} = require('@vue/cli-service')

module.exports = {
  css: {
    loaderOptions: {
      sass: {
        additionalData: '@import "@/assets/stylesheets/main.scss";'
      }
    }
  },

  transpileDependencies: true,

  chainWebpack: config => {
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule.delete('type')
    svgRule.delete('generator')
    svgRule
      .use('babel-loader')
      .loader('babel-loader')
      .end()
      .use('svg-vue3-loader')
      .loader('svg-vue3-loader')
  },

  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableLegacy: false,
      runtimeOnly: false,
      compositionOnly: false,
      fullInstall: true
    }
  }
}
