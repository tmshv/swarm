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

    seek(target, accelerate = 1) {
        const desire = Vector.sub(target, this.location)
        const distanceToTargetSquared = desire.lengthSquared

        if (distanceToTargetSquared < accelerate ** 2) desire.setLength(accelerate)

        return this.force(desire)
    }
}