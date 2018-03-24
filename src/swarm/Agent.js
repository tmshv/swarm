import Vector from './Vector'

export default class Agent {
    constructor() {
        this.location = new Vector(0, 0)
        this.velocity = new Vector(0, 0)
        this.acceleration = new Vector(0, 0)
    }

    run({agentsPool}) {
        this.interactAgents(agentsPool)

        this.velocity.add(this.acceleration)
        this.location.add(this.velocity)
        this.acceleration.set(0, 0)
    }

    interactAgents(pool) {
        const v = 3
        this.velocity.set(
            -v / 2 + Math.random() * v,
            -v / 2 + Math.random() * v,
        )
    }
}