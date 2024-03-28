import Vector from '../lib/vector'
import Obstacle from './Obstacle'

export default class PointObstacle extends Obstacle {
    constructor({ radius }) {
        super({})
        this.location = new Vector(0, 0)
        this.radius = radius
        this._radiusSquared = radius ** 2
    }

    containCoord(coord) {
        // return this.location.distSquared(coord) < this._radiusSquared
        return this.location.dist(coord) < this.radius
    }
}
