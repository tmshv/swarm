import Vector from './Vector'
import Tag from './Tag'

export default class Attractor {
    get location() {
        return this._location
    }

    get power() {
        return this._power
    }

    constructor({id, x, y, power}) {
        this._location = new Vector(x, y)
        this._power = power
        this.id = id

        this.agents = []
        this._emitters = []
    }

    addAgent(agent) {
        this.agents.push(agent)
        this._emitters.push(agent.getTag(Tag.EMITTER))

        return this
    }

    getAssociatedEmitters() {
        return this._emitters
    }
}