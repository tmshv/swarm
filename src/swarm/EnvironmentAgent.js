import Agent from './Agent'

export default class EnvironmentAgent extends Agent {
    constructor(...args) {
        super(...args)

        this.environmentSample = []
    }

    run({agentsPool, environment}) {
        super.run({agentsPool})
        this.interactEnvironment(environment)
    }

    needToUpdateEnvironment(env) {
        return false
    }

    interactEnvironment(env) {
        if (this.needToUpdateEnvironment(env)) {
            this.rememberEnvironmentSample(env)
        }

        this.environmentSample.forEach(({location, value}) => {

        })
    }

    rememberEnvironmentSample(env) {

    }
}