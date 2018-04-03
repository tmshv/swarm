import Vector from './Vector'
import Event from '../lib/Event'
import AgentEvent from './AgentEvent'

export default class Agent {
    get isAlive() {
        return this._alive
    }

    constructor() {
        this._alive = true

        this.location = new Vector(0, 0)
        this.velocity = new Vector(0, 0)
        this.acceleration = new Vector(0, 0)

        this.damp = 1 - 0.02 // remember a very small amount of the last direction
        this.accelerate = .025

        this.events = new Event()
        this.behaviours = []
    }

    die() {
        this._alive = false
        this.events.get(AgentEvent.DIE).trigger(this)
    }

    addBehaviour(behaviour) {
        behaviour.setAgent(this)
        this.behaviours.push(behaviour)
    }

    run(options) {
        this.behaviours.forEach(b => {
            b.run(options)
        })

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

    seek(target, accelerate = this.accelerate) {
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