import MovingBehavior from './MovingBehavior'
import Vector from '../Vector'
import PointObstacle from '../PointObstacle'

export default class AvoidPointObstaclesBehavior extends MovingBehavior {
    init({ radius, predictionDistance }) {
        this.radius = radius
        this.predictionDistance = predictionDistance

        this.cache = null
    }

    run({ environment }) {
        if (!this.cache) this.updateCache(environment)

        const predict = this.predictLocation()
        this.obstacle = this.getNearest(predict)
        if (!this.obstacle) return

        let force = this.getForce(predict)
        this.agent.force(force)
    }

    getNearest(coord) {
        if (!this.cache.length) return null

        const sorted = this.cache.sort((a, b) => {
            const aDist = coord.distSquared(a.location)
            const bDist = coord.distSquared(b.location)
            return aDist - bDist
        })

        const found = sorted[0]
        return found
        // return found.containCoord(coord)
        //     ? found
        //     : null
    }

    getForce(coord) {
        return Vector
            .sub(coord, this.obstacle.location)
            .normalize()
            .setLength(0.5)
    }

    getPredictionVector() {
        return this.agent.velocity
            .clone()
            .setLength(this.predictionDistance)
    }

    predictLocation() {
        return this
            .getPredictionVector()
            .add(this.agent.location)
    }

    updateCache(environment) {
        this.cache = []

        for (const o of environment.obstacles) {
            if (o instanceof PointObstacle) {
                this.cache.push(o)
            }
        }
    }
}
