import Channel from '../lib/Channel'
import AgentEvent from './AgentEvent'
import Vehicle from './Vehicle'
import Vector from './Vector'

export default class Agent extends Vehicle {
    get isAlive() {
        return this._alive
    }

    get isLocked() {
        return this._locked
    }

    constructor({behaviour}) {
        super()
        behaviour.setAgent(this)

        this._locked = false
        this._alive = true
        this.events = new Channel()
        this.behaviour = behaviour
        this.namedBehaviours = new Map()

        this._stepForces = []
        this._stepAcceleration = new Vector(0, 0)

        this.tags = new Map()
    }

    force(vector) {
        this._stepForces.push(vector)
        return super.force(vector)
    }

    lock() {
        this._locked = true
    }

    unlock() {
        this._locked = false
    }

    move() {
        if (this._locked) return
        super.move()
    }

    addTag(tag, value) {
        this.tags.set(tag, value)

        return this
    }

    getTag(tag) {
        return this.tags.get(tag)
    }

    die() {
        this._alive = false
        this.events.get(AgentEvent.DIE).trigger(this)
    }

    addBehaviour(name, behaviour) {
        behaviour.setAgent(this)
        this.namedBehaviours.set(name, behaviour)
    }

    getBehaviour(name) {
        return this.namedBehaviours.get(name)
    }

    run(options) {
        this._stepForces.length = 0
        this._stepAcceleration.setFrom(this.acceleration)

        this.behaviour.run(options)
    }
}