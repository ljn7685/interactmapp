const path = require('path');

module.exports = {
    projectName: 'interactmapp',
    date: '2020-07-13',
    designWidth: 750,
    deviceRatio: {
        '640': 2.34/2,
        '750': 1,
        '828': 1.81/2,
        '375': 0.5
    },
    sourceRoot: 'src_pc',
    outputRoot: 'dist_pc/client',
    defineConstants: {},
    h5: {
        publicPath: '/',
        staticDirectory: 'static',
        devServer: {
            port: 9000
        },
        module: {
            postcss: {
                autoprefixer: {
                    enable: true,
                    config: {
                        browsers: [
                            'last 3 versions',
                            'Android >= 4.1',
                            'ios >= 8'
                        ]
                    }
                },
                cssModules: {
                    enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
                    config: {
                        namingPattern: 'module', // 转换模式，取值为 global/module
                        generateScopedName: '[name]__[local]___[hash:base64:5]'
                    }
                }
            }
        }
    },

    copy: {
        patterns: [
            {from: 'public/mapp_common/',to: 'dist_pc/client/mapp_common/'},
            {from: 'public/',to: 'src_pc/public/'},
            // {from: 'assets/',to: 'dist_pc/client/assets/'},
        ],
        options: {}
    },
    alias: {
        // 'tradePublic': path.resolve(__dirname,'../..','src_pc/public/tradePublic'),
        // 'tradePolyfills': path.resolve(__dirname,'../..','src_pc/public/tradePolyfills'),
        'mapp_common': path.resolve(__dirname,'../..','src_pc/public/mapp_common'),
        'pcComponents': path.resolve(__dirname,'../..','src_pc/components'),
        'pcAssets': path.resolve(__dirname,'../..','src_pc/assets'),
        'pcPages': path.resolve(__dirname,'../..','src_pc/pages'),
        '@/constants': path.resolve(__dirname,'../..','src_pc/constants'),
    },
    NODE_ENV: 'development',
}
