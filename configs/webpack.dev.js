const path = require('path')
const {devServer, compose, merge} = require('./webpack')

const targetDir = path.resolve(__dirname, '..', 'target', 'app')

module.exports = compose([
    merge({
        devtool: 'cheap-module-source-map',
    }),
    devServer({
        contentBase: targetDir,
        compress: false,
        port: 3000,
        lazy: false,
        historyApiFallback: true,
    }),
])({})