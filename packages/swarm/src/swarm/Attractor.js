import Vector from '../lib/vector'
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
        this._emittersCount = new Map()

        this.tags = new Map()
    }

    addTag(name, tag) {
        this.tags.set(name, tag)
        return this
    }

    getTag(name) {
        return this.tags.get(name)
    }

    addAgent(agent) {
        this.agents.push(agent)
        const emitter = agent.getTag(Tag.EMITTER)
        this._emitters.push(emitter)

        let value = this._emittersCount.has(emitter)
            ? this._emittersCount.get(emitter)
            : 0
        value += 1

        this._emittersCount.set(emitter, value)

        return this
    }

    getAssociatedEmitters() {
        return this._emitters
    }

    getAssociatedEmitterCount(emitter) {
        return this._emittersCount.get(emitter)
    }

    getAgentsCount() {
        return this.agents.length
    }
}