import Vector from './Vector'
import Signal from '../lib/Signal'

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

        this.emit = this.emit.bind(this)
    }

    create() {
        return this.factory(this.location)
    }

    emit() {
        const items = []
        for (let i = 0; i < this.amount; i++) {
            items.push(this.create())
        }
        this.events.emit.trigger(items)
    }

    run() {
        this._counter--
        if (this._counter <= 0) {
            this.emit()
            this._counter = this.period
        }
    }
}