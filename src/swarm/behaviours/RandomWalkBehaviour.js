import Behaviour from './Behaviour'
import Vector from '../Vector'

export default class RandomWalkBehaviour extends Behaviour {
    constructor({accelerate}) {
        super()

        this.accelerate = accelerate
    }

    run() {
        const v = this.accelerate
        const target = Vector.add(this.agent.location, new Vector(
            -v / 2 + Math.random() * v,
            -v / 2 + Math.random() * v,
        ))

        this.agent.seek(target, this.accelerate)
    }
}