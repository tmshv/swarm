import MovingBehavior from './MovingBehavior'
import Vector from '../Vector'

export default class AvoidObstaclesBehavior extends MovingBehavior {
    init({radius, predictionDistance}) {
        this.radius = radius
        this.predictionDistance = predictionDistance
        this.predictionDistanceSquared = predictionDistance ** 2
    }

    run({environment}) {
        this.reflection = null
        this.edge = null

        const predict = this.predictLocation()
        const predictDirection = this.getPredictionVector()
        const location = this.agent.location
        const obstacle = environment.findObstacle(location, this.radius)
        if (!obstacle) return

        let edge = this.getNearestEdge(obstacle, location, predictDirection)
        if (!edge) return

        if (edge.distSquared(predict) >= this.predictionDistanceSquared) {
            return
        }

        let force = this.getForce(edge)
        this.agent.acceleration.direct(force)

        this.edge = edge
        this.reflection = force
    }

    getForce(edge) {
        const force = edge.getDirection()
        const predictDirection = this.getPredictionVector()

        if (force.dot(predictDirection) < 0) {
            force.reverse()
        }

        return force
    }

    getPredictionVector() {
        return this.agent.velocity
            .clone()
            .normalize()
            .mult(this.predictionDistance)
    }

    predictLocation() {
        return this
            .getPredictionVector()
            .add(this.agent.location)
    }

    getNearestEdge(obstacle, coord, direction) {
        let edges = []

        const nextCoord = Vector.add(coord, direction)

        for (let line of obstacle.lines) {
            if (line.normal.dot(direction) < 0) { // edge in opposite direction
                const coordProjected = line.project(coord)
                if (line.isBetween(coordProjected)) {
                    // const nextCoordProjected = line.project(nextCoord)

                    // if (nextCoordProjected)

                    edges.push([line, line.distSquared(nextCoord)])
                }
            }
        }

        edges = edges.sort((a, b) => {
            return a[1] - b[1]
        })

        return edges.length
            ? edges[0][0]
            : null
    }
}