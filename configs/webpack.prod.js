const {merge, compose, plugin} = require('./webpack')

const webpack = require('webpack')

module.exports = compose([
    merge({
        devtool: 'cheap-module-source-map',
    }),
    plugin(new webpack.DefinePlugin({
        'process.env': {
            'NODE_ENV': `"production"`
        }
    })),
])({})
