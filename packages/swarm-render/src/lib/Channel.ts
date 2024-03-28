// @ts-nocheck

import { Signal } from '@tmshv/swarm'

export default class Channel {
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
