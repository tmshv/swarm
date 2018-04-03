import Event from '../lib/Event'
import AgentEvent from './AgentEvent'
import MovableObject from './MovableObject'

export default class Agent extends MovableObject {
    get isAlive() {
        return this._alive
    }

    constructor() {
        super()

        this._alive = true
        this.events = new Event()
        this.behaviour = null
    }

    die() {
        this._alive = false
        this.events.get(AgentEvent.DIE).trigger(this)
    }

    setBehaviour(behaviour) {
        behaviour.setAgent(this)
        this.behaviour = behaviour
    }

    run(options) {
        this.behaviour.run(options)
        this.move()
    }
}