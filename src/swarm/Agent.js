import Event from '../lib/Event'
import AgentEvent from './AgentEvent'
import MovableObject from './MovableObject'

export default class Agent extends MovableObject {
    get isAlive() {
        return this._alive
    }

    constructor({behaviour}) {
        super()
        behaviour.setAgent(this)

        this._alive = true
        this.events = new Event()
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
        this.move()
    }
}