import Vector from './Vector'

export default class Agent {
    constructor() {
        this.location = new Vector(0, 0)
        this.velocity = new Vector(0, 0)
        this.acceleration = new Vector(0, 0)
    }

    run(agentsPool, environmentPool) {
        this.interactEnvironment(environmentPool)
        this.interactAgents(agentsPool)

        this.velocity.add(this.acceleration)
        this.location.add(this.velocity)
        this.acceleration.set(0, 0)
    }

    interactEnvironment(pool) {
    }

    interactAgents(pool) {
        this.velocity.set(
            -5 + Math.random() * 10,
            -5 + Math.random() * 10,
        )
    }
}