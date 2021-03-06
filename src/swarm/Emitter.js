import Vector from './Vector'
import Signal from '../lib/Signal'
import Tag from './Tag'

export default class Emitter {
    get counter() {
        return this._counter
    }

    constructor({x, y, period, amount, factory}) {
        this._counter = 0

        this.location = new Vector(x, y)
        this.period = period
        this.amount = amount
        this.factory = factory

        this.events = {
            run: new Signal(),
            emit: new Signal(),
        }
    }

    create(variables) {
        const agent = this.factory(this.location, variables)
        agent.addTag(Tag.EMITTER, this)

        return agent
    }

    emit(variables) {
        const items = []
        for (let i = 0; i < this.amount; i++) {
            items.push(this.create(variables))
        }
        this.events.emit.trigger(items)
    }

    run(variables) {
        this._counter--
        if (this._counter <= 0) {
            this.emit(variables)
            this._counter = this.period
        }
    }
}