// @ts-nocheck

import { Signal } from '@tmshv/swarm'

export default class ComposedSignal extends Signal {
    constructor(target, signals) {
        super(target)

        this.signals = signals
        this.signals.forEach(signal => {
            signal.on((...args) => {
                this.trigger(...args)
            })
        })
    }
}
