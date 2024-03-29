import Vector from '~/src/lib/vector'
import Signal from '~/src/lib/signal'
import Tag from './Tag'
import Agent from './Agent'

type Options = {
    x: number
    y: number
    period: number
    amount: number
    factory: any
}

export default class Emitter {
    get counter() {
        return this._counter
    }

    private _counter: number
    public location: Vector
    public readonly period: number
    public readonly amount: number
    public readonly factory: any
    public readonly events: {
        run: Signal<any>,
        emit: Signal<Agent[]>,
    }

    constructor({ x, y, period, amount, factory }: Options) {
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

    create(variables: object) {
        const agent = this.factory(this.location, variables)
        agent.addTag(Tag.EMITTER, this)

        return agent
    }

    emit(variables: object) {
        const items = []
        for (let i = 0; i < this.amount; i++) {
            items.push(this.create(variables))
        }
        this.events.emit.trigger(items)
    }

    run(variables: object) {
        this._counter--
        if (this._counter <= 0) {
            this.emit(variables)
            this._counter = this.period
        }
    }
}
