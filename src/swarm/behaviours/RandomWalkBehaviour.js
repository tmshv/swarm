import Behaviour from './Behaviour'

export default class RandomWalkBehaviour extends Behaviour {
    constructor(step) {
        super()

        this.step = step
    }

    run() {
        const v = this.step
        this.agent.velocity.set(
            -v / 2 + Math.random() * v,
            -v / 2 + Math.random() * v,
        )
    }
}