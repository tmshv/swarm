import Signal from './Signal'

export default class Event {
    constructor() {
        this.signals = new Map()
    }

    get(name) {
        if (!this.signals.has(name)) {
            this.signals.set(name, new Signal())
        }

        return this.signals.get(name)
    }
}
