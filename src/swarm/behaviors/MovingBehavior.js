import Behavior from './Behavior'

export default class MovingBehavior extends Behavior {
    constructor(options) {
        super(options)
        this.accelerate = options.accelerate
    }

    seek(target) {
        this.agent.seek(target, this.accelerate)
    }

    flee(target) {
        this.agent.flee(target, this.accelerate)
    }

    force(force) {
        force.setLength(this.accelerate)

        this.agent.force(force)
        return force
    }
}