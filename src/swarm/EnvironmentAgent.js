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
        return true
    }

    interactEnvironment(env) {
        if (this.needToUpdateEnvironment(env)) {
            this.rememberEnvironmentSample(env)
        }

        this.environmentSample.forEach(attractor => {
            this.seek(attractor.location)
        })
    }

    rememberEnvironmentSample(env) {
        this.environmentSample = env.getSample(this.location.x, this.location.y, [])
    }
}