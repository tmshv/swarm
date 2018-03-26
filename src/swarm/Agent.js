import Vector from './Vector'
import Signal from '../lib/Signal'

export default class Agent {
    get isAlive() {
        return this.ttl > 0
    }

    constructor() {
        this.location = new Vector(0, 0)
        this.velocity = new Vector(0, 0)
        this.acceleration = new Vector(0, 0)

        this.damp = 1 - 0.02 // remember a very small amount of the last direction
        this.accelerate = .025
        this.accelerateLimit = 0.5

        this.events = {
            die: new Signal(),
        }

        this.ttl = 1000
        this.behaviours = []
    }

    addBehaviour(behaviour) {
        behaviour.setAgent(this)
        this.behaviours.push(behaviour)
    }

    run(options) {
        this.behaviours.forEach(b => {
            b.run(options)
        })

        this.acceleration.limit(this.accelerateLimit)

        this.velocity.add(this.acceleration)
        this.location.add(this.velocity)
        this.acceleration.set(0, 0)

        this.velocity.mult(this.damp)

        this.ttl--
        if (this.ttl === 0) {
            this.events.die.trigger(this)
        }
    }

    force(vector) {
        this.acceleration.add(vector)

        return this
    }

    seek(target, accelerate = this.accelerate) {
        const desire = Vector
            .sub(target, this.location)
            .normalize()
            .mult(accelerate)
        if (!desire.isNaN()) {
            this.acceleration.add(desire)
        }
    }
}