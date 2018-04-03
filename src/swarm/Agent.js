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

        this.move()
    }
}