const {compose, merge} = require('./configs/webpack')

const webpackBaseConfig = require('./configs/webpack.base')

const stages = {
    production: require('./configs/webpack.prod'),
    development: require('./configs/webpack.dev'),
}

const targets = {
    app: require('./configs/webpack.app'),
}

module.exports = ({
                      NODE_ENV: stageName = 'production',
                      TARGET: targetName = 'template',
                  } = {}) => {
    const stage = stages[stageName]
    const target = targets[targetName]

    return compose([
        merge(webpackBaseConfig),
        merge(stage),
        merge(target),
    ])({})
}