const webpackMerge = require('webpack-merge')
const CopyWebpackPlugin = require('copy-webpack-plugin')

function entry(entry) {
    return merge({entry})
}

function output(output) {
    return merge({output})
}

function resolve(resolve) {
    return merge({resolve})
}

function rule(rule) {
    return merge({
        module: {
            rules: [rule],
        }
    })
}

function loader(test, loaders) {
    return rule({
        test,
        use: loaders,
    })
}

function plugin(plugin) {
    return merge({plugins: [plugin]})
}

function devServer(devServer) {
    return merge({devServer})
}

function merge(part) {
    return config => webpackMerge(config, part)
}

function compose(functions) {
    return config => functions.reduce((config, fn) => fn(config), config)
}

exports.entry = entry
exports.output = output
exports.resolve = resolve
exports.rule = rule
exports.loader = loader
exports.plugin = plugin
exports.devServer = devServer
exports.merge = merge
exports.compose = compose