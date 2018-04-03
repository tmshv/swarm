import Behaviour from './Behaviour'
import Vector from '../Vector'

export default class RandomWalkBehaviour extends Behaviour {
    run() {
        const angle = Math.random() * Math.PI * 2
        const force = Vector.fromAngle(angle)

        this.forceAccelerated(force)
    }
}