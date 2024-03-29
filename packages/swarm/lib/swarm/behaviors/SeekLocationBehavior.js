import MovingBehavior from './MovingBehavior'

export default class SeekLocationBehavior extends MovingBehavior {
    get threshold() {
        return this._threshold
    }

    constructor({threshold, ...options}) {
        super(options)

        this._threshold = threshold
        this._thresholdSquared = threshold ** 2
    }

    init({target}) {
        this.target = target
    }

    run() {
        const reached = this.isReached()
        if (!reached) this.seek(this.target)

        return reached
    }

    isReached() {
        if (!this.target) return true
        return this.agent.location.distSquared(this.target) < this._thresholdSquared
    }
}