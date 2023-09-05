import Behavior from './Behavior'

export default class LimitAccelerationBehavior extends Behavior {
    init({limit}) {
        this.limit = limit
    }

    run() {
        this.agent.acceleration.limit(this.limit)
    }
}