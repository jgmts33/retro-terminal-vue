const { defineConfig } = require('@vue/cli-service')

const pkg = require('./package.json')

const date = new Date()

module.exports = defineConfig({
    transpileDependencies: true,

    pages: {
        index: {
            entry: 'src/main.js',
            title: `${process.env.VUE_APP_FIRST_NAME} Sapan`,
            measurementId: process.env.MEASUREMENT_ID,
        },
    },

    chainWebpack: (config) => {
        config.plugin('eslint').tap((args) => {
            args[0].fix = true
            return args
        })

        config.module.rule('js')
            .test(/\.js$/)
            .use('webpack-import-glob-loader')
            .loader('webpack-import-glob-loader')

        config.plugin('define').tap((args) => {
            args[0]['process.env'] = {
                ...args[0]['process.env'],
                VUE_APP_VERSION: `"${pkg.version}"`,
                VUE_APP_BUILD_TIMESTAMP: `"${date.toLocaleString('default', { month: 'short' })} ${date.getDate()} ${date.getFullYear()}, ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}"`,
            }
            return args
        })
    },
})
