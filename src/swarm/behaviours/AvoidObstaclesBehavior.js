import MovingBehavior from './MovingBehavior'
import Vector from '../Vector'

export default class AvoidObstaclesBehavior extends MovingBehavior {
    init({radius, predictionDistance}) {
        this.radius = radius
        this.predictionDistance = predictionDistance
        this.predictionDistanceSquared = predictionDistance ** 2

        this.lines = null
    }

    run({environment}) {
        if (!this.lines) this.updateLines(environment)

        this.reflection = null
        this.edge = null

        const predict = this.predictLocation()
        const predictDirection = this.getPredictionVector()
        const location = this.agent.location

        let edge = this.getNearestEdge(location, predictDirection)
        if (!edge) return

        if (edge.distSquared(predict) >= this.predictionDistanceSquared) {
            return
        }

        let force = this.getForce(edge)
        force.add(this.getNormalForce(edge))

        console.log(force)
        this.force(force)
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

    getNormalForce(edge) {
        const n = this.predictionDistance
        return edge
            .normal
            .clone()
            .setLength(n)
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

    getNearestEdge(coord, direction) {
        let edges = []

        const nextCoord = Vector.add(coord, direction)

        for (let line of this.lines) {
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

    updateLines(environment) {
        this.lines = []

        environment.obstacles.forEach(o => {
            this.lines = [
                ...this.lines,
                ...o.lines,
            ]
        })
    }
}