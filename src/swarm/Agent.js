import Vector from './Vector'

export default class Agent {
    constructor() {
        this.location = new Vector(0, 0)
        this.velocity = new Vector(0, 0)
        this.acceleration = new Vector(0, 0)

        this.environmentSample = []
    }

    run(agentsPool, environment) {
        this.interactEnvironment(environment)
        this.interactAgents(agentsPool)

        this.velocity.add(this.acceleration)
        this.location.add(this.velocity)
        this.acceleration.set(0, 0)
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

    interactAgents(pool) {
        this.velocity.set(
            -5 + Math.random() * 10,
            -5 + Math.random() * 10,
        )
    }

    rememberEnvironmentSample(env) {

    }
}