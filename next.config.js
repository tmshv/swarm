module.exports = {
    env: {
    },
    webpack(config) {
        config.resolve.modules.push(__dirname)
        return config;
    },
}
