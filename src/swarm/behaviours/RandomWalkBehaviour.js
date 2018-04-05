import MovingBehavior from './MovingBehavior'
import Vector from '../Vector'

export default class RandomWalkBehaviour extends MovingBehavior {
    run() {
        const angle = Math.random() * Math.PI * 2
        this.force(Vector.fromAngle(angle))
    }
}