const path = require('path')
const {compose, entry, output, plugin} = require('./webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const targetDir = path.resolve(__dirname, '..', 'target', 'app')

module.exports = compose([
    entry({
        app: './src/app/index.js',
    }),

    output({
        path: path.resolve(targetDir, 'static'),
        filename: '[name].js',
        publicPath: '/static/'
    }),

    plugin(new HtmlWebpackPlugin({
        template: './src/app/index.html',
        filename: path.resolve(targetDir, 'index.html'),
    })),
])({});