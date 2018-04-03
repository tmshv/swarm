import Behaviour from './Behaviour'

export default class LimitAccelerationBehaviour extends Behaviour {
    init({limit}) {
        this.limit = limit
    }

    run() {
        this.agent.acceleration.limit(this.limit)
    }
}