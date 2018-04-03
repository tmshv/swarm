import Behaviour from './Behaviour'

export default class SeekLocationBehaviour extends Behaviour {
    constructor({threshold, ...options}) {
        super(options)

        this.threshold = threshold ** 2
    }

    init({target}) {
        this.target = target
    }

    run() {
        const reached = this.isReached()
        if (!reached) this.seekAccelerated(this.target)

        return reached
    }

    isReached() {
        if (!this.target) return true
        return this.agent.location.distSquared(this.target) < this.threshold
    }
}