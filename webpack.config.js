// const WebpackParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
// let sassExtract = new ExtractTextPlugin('sass.css');
// eslint-disable-next-line import/no-commonjs
const  path = require('path');
console.log(path)
const config = {
    resolve: {
        extensions: ['*', '.js', '.jsx'],
        alias: {
            // mobile
            components: path.join(__dirname, 'src_mb/components'),
            pages: path.join(__dirname, 'src_mb/pages'),
            '@/constants': path.resolve(__dirname, 'src_mb/constants'),
            assets: path.resolve(__dirname, 'src_mb/assets'),

            // pc
            pcComponents: path.join(__dirname, 'src_pc/components'),
            pcPages: path.join(__dirname, 'src_pc/pages'),
            '@/constantspc': path.resolve(__dirname, 'src_pc/constants'),
            pcAssets: path.resolve(__dirname, 'src_pc/assets'),

            // customer
            cComponents: path.join(__dirname, 'src_customer/components'),
            cPages: path.join(__dirname, 'src_customer/pages'),
            '@/constantsc': path.resolve(__dirname, 'src_customer/constants'),
            cAssets: path.resolve(__dirname, 'src_customer/assets'),

            mapp_common:path.join(__dirname, 'public/mapp_common'),
        },
    },
};

module.exports = config;
