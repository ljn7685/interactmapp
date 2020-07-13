const path = require('path');

module.exports = {
    projectName: 'tradembmapp',
    date: '2019-10-15',
    designWidth: 750,
    deviceRatio: {
        '640': 2.34/2,
        '750': 1,
        '828': 1.81/2,
        '375': 0.5
    },
    sourceRoot: 'src_customer',
    outputRoot: 'dist_customer/client',
    defineConstants: {},
    weapp: {
        module: {
            postcss: {
                autoprefixer: {
                    enable: true,
                    remove: false,
                    config: {
                        remove: false,
                        browsers: [
                            'Chrome 52',
                        ]
                    }
                },
                pxtransform: {
                    enable: true,
                    config: {}
                },
                url: {
                    enable: true,
                    config: {
                        limit: 10240 // 设定转换尺寸上限
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
            /**
             * 下面这个alia的实现方式比较反人类 ,打包的时候先把文件拷贝到dist目录下 然后把alias设置为dist目录下的引用
             * dist目录下先会出现一份源码,然后里面每个源码都会被编译,这样搞了一圈,拜taro(的一个bug)所赐,引用关系居然是正确的.真是歪打正着啊.
             */
            {from: 'public/mapp_common/',to: 'dist_customer/client/mapp_common/'},
            {from: 'public/',to: 'src_customer/public/'},
            // {from: 'assets/',to: 'dist_customer/client/assets/'},
        ],
        options: {}
    },
    alias: {
        'mapp_common': path.resolve(__dirname,'../..','src_customer/public/mapp_common'),
        'components': path.resolve(__dirname,'../..','src_customer/components'),
        'pages': path.resolve(__dirname,'../..','src_customer/pages'),
        'assets': path.resolve(__dirname,'../..','src_customer/assets'),
        'pcComponents': path.resolve(__dirname,'../..','src_customer/components'),
        '@/constants': path.resolve(__dirname,'../..','src_customer/constants'),
    },
    NODE_ENV: 'development',
}
