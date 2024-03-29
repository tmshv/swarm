import Behavior from './Behavior'
import Vector from '~/lib/vector'

export default class IfTargetReachedBehavior extends Behavior {
    init({ minDistance }) {
        this.minDistance = minDistance
        this._minDistanceSquared = minDistance ** 2
    }

    run({ target }) {
        return this.location(target).distSquared(this.agent.location) < this._minDistanceSquared
    }

    location(target) {
        return target instanceof Vector
            ? target
            : target.location
    }
}
