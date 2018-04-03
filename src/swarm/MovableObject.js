import Vector from './Vector'
import Event from '../lib/Event'
import AgentEvent from './AgentEvent'

export default class MovableObject {
    constructor() {
        this.location = new Vector(0, 0)
        this.velocity = new Vector(0, 0)
        this.acceleration = new Vector(0, 0)
        this.damp = 1
    }

    move() {
        this.velocity.add(this.acceleration)
        this.location.add(this.velocity)
        this.acceleration.set(0, 0)

        this.velocity.mult(this.damp)
    }

    force(vector) {
        this.acceleration.add(vector)

        return this
    }

    predictLocation(distance = null) {
        if (this.velocity.lengthQuad === 0) {
            return this.location.clone()
        }

        const predict = this.velocity.clone()
        if (distance) {
            predict
                .normalize()
                .mult(distance)
        }

        return predict
    }

    seek(target, accelerate = 1) {
        const desire = Vector.sub(target, this.location)
        const distanceToTargetSquared = desire.lengthSquared
        const a = distanceToTargetSquared < accelerate
            ? Math.sqrt(distanceToTargetSquared)
            : accelerate
        desire
            .normalize()
            .mult(a)
        if (!desire.isNaN()) {
            return this.force(desire)
        }

        return this
    }
}