import Vector from './Vector'

export default class Agent {
    constructor() {
        this.location = new Vector(0, 0)
        this.velocity = new Vector(0, 0)
        this.acceleration = new Vector(0, 0)

        this.damp = 1 - 0.02 // remember a very small amount of the last direction
        this.accel = .025
    }

    run({agentsPool}) {
        this.interactAgents(agentsPool)

        this.velocity.add(this.acceleration)
        this.location.add(this.velocity)
        this.acceleration.set(0, 0)

        this.velocity.mult(this.damp)
    }

    interactAgents(pool) {
        // this.randomWalk(3)
    }

    randomWalk(v) {
        this.velocity.set(
            -v / 2 + Math.random() * v,
            -v / 2 + Math.random() * v,
        )
    }

    seek(target) {
        const desire = Vector
            .sub(target, this.location)
            .normalize()
            .mult(this.accel)

        this.velocity.add(desire)
    }
}