import Signal from './Signal'

export default class ComposedSignal extends Signal {
    constructor(target, signals) {
        super(target)

        this.signals = signals
        this.signals.on((...args) => {
            this.trigger(...args)
        })
    }
}
