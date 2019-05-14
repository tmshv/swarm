import Behavior from './Behavior'

export default class DynamicBehavior extends Behavior {
    static from(fn) {
        return new DynamicBehavior({
            run: fn,
        })
    }

    init({run}) {
        this.runFn = run
    }

    run(options) {
        return this.runFn({
            ...options,
            agent: this.agent,
        })
    }
}