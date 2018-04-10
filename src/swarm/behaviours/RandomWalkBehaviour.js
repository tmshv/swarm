import MovingBehavior from './MovingBehavior'
import Vector from '../Vector'

export default class RandomWalkBehaviour extends MovingBehavior {
    run() {
        const angle = Math.random() * Math.PI * 2
        const force = Vector.fromAngle(angle)
        if (this.agent.accelerated) {
            this.agent.acceleration.direct(force)
        } else {
            this.force(force)
        }
    }
}