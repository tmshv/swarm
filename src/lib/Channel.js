import Signal from './Signal'

export default class Event {
    constructor(target) {
        this.target = target
        this.signals = new Map()
    }

    get(name) {
        if (!this.signals.has(name)) {
            this.signals.set(name, new Signal(this.target))
        }

        return this.signals.get(name)
    }
}
