function babelLoader() {
    return 'babel-loader'
}

function styleLoader() {
    return 'style-loader'
}

function cssLoader() {
    return 'css-loader'
}

function postcssLoader() {
    return 'postcss-loader'
}

function lessLoader(options) {
    return {
        loader: 'less-loader',
        options,
    }
}

function urlLoader(options) {
    return !options ? 'url-loader' : {
        loader: 'url-loader',
        options,
    }
}

exports.babelLoader = babelLoader
exports.styleLoader = styleLoader
exports.cssLoader = cssLoader
exports.postcssLoader = postcssLoader
exports.lessLoader = lessLoader
exports.urlLoader = urlLoader
