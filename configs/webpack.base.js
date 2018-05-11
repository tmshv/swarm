const {compose, plugin, copy, loader} = require('./webpack')
const {babelLoader, postcssLoader, cssLoader, lessLoader, styleLoader, urlLoader} = require('./webpackLoaders')

const webpack = require('webpack')
const target = process.env.TARGET || 'browser'

module.exports = compose([
    loader(/\.jsx?/, [babelLoader()]),

    // loader(/\.css$/, [
    //     styleLoader(),
    //     cssLoader(),
    //     // postcssLoader(),
    // ]),

    loader(/(\.less)/, [
        styleLoader(),
        cssLoader(),
        lessLoader({
            root: true
        }),
    ]),

    loader(/\.(ttf|woff(2)?)(\?[a-z0-9=&.]+)?$/, [urlLoader()]),
    loader(/\.svg/, [urlLoader({mimetype: 'image/svg+xml'})]),

    copy('assets', 'assets'),

    plugin(new webpack.NormalModuleReplacementPlugin(/\{target\}/, function (result) {
        result.request = result.request.replace(/\{target\}/, target);
    })),
])({})