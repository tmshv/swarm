import Channel from '../lib/Channel'
import AgentEvent from './AgentEvent'
import Vehicle from './Vehicle'

export default class Agent extends Vehicle {
    get isAlive() {
        return this._alive
    }

    constructor({behaviour}) {
        super()
        behaviour.setAgent(this)

        this._alive = true
        this.events = new Channel()
        this.behaviour = behaviour
        this.namedBehaviours = new Map()
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
        this.behaviour.run(options)
    }
}