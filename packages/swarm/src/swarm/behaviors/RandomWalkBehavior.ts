import Behavior from './Behavior'
import Vector from '~/src/lib/vector'
import { getRandomAngle } from '../random'

export default class RandomWalkBehavior extends Behavior {
    run() {
        const angle = getRandomAngle()
        const force = Vector.fromAngle(angle).mult(this.accelerate)

        this.agent.force(force)
    }
}
