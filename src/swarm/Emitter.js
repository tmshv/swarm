import Vector from './Vector'
import Signal from '../lib/Signal'

export default class Emitter {
    constructor({x, y, period, amount, factory}) {
        this.location = new Vector(x, y)
        this.period = period
        this.amount = amount
        this.factory = factory

        this.isRunning = false
        this.intervalId = null

        this.events = {
            run: new Signal(),
            stop: new Signal(),
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
        if (this.isRunning) return

        this.intervalId = setInterval(this.emit, this.period)
    }

    stop() {
        clearInterval(this.intervalId)
    }
}