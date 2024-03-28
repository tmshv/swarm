import MovingBehavior from './MovingBehavior'
import Line from '../Line'
import Vector from '../../lib/vector'

export default class AvoidObstaclesBehavior extends MovingBehavior {
    init({ radius, predictionDistance }) {
        this.radius = radius
        this.predictionDistance = predictionDistance
        this.predictionDistanceSquared = predictionDistance ** 2

        this.lines = null
    }

    run({ environment }) {
        if (!this.lines) this.updateLines(environment)

        this.impactForce = null
        this.intersection = null
        this.edge = null

        const location = this.agent.location
        // const obstacle = environment.findObstacle(location, this.radius)
        // this.obstacle = obstacle
        // if (!obstacle) return

        const predict = this.predictLocation()
        const predictDirection = this.getPredictionVector()

        // let edge = this.getNearestEdge(obstacle, location, predictDirection)
        let edge = this.getNearestEdge(location, predictDirection)
        if (!edge) return

        // const moveLine = new Line(location, predict)
        // this.intersection = edge.getLineIntersection(moveLine)
        this.intersection = edge.project(location)

        let force = this.getForce(edge)
        // let normalForce = this.getNormalForce(edge)
        // force.add(normalForce)

        // this.agent.acceleration.direct(force)
        this.agent.force(force)
        // this.seekAccelerated(force)

        this.edge = edge
        this.impactForce = force
    }

    getNormalForce(edge) {
        const predict = this.predictLocation()
        // const n = edge.distSquared(predict) - this.predictionDistance
        const n = this.predictionDistance
        return edge
            .normal
            .clone()
            .setLength(n)
    }

    getForce(edge) {
        // const futureLocation = this.predictLocation()
        // const distSquared = edge.distSquared(futureLocation)
        const distSquared = edge.distSquared(this.agent.location)

        // const n = Math.sqrt(
        //     this.predictionDistanceSquared - distSquared
        // )

        const n = distSquared + 1
        const normal = edge.normal.clone()

        const force = normal.divide(n)
        force.mult(5)
        // return normal

        // const force = this
        //     .getPredictionVector()
        //     .add(normal)
        //
        // console.log(force, n)
        //
        // // const force = edge.getDirection()
        // // const predictDirection = this.getPredictionVector()
        // //
        // // if (force.dot(predictDirection) < 0) {
        // //     force.reverse()
        // // }

        return force
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

    getNearestEdge(coord, direction) {
        let edges = []

        const nextCoord = Vector.add(coord, direction)

        const moveLine = new Line(coord, nextCoord)

        // const lines = obstacle.lines
        const lines = this.lines
        for (let line of lines) {
            if (line.distSquared(nextCoord) < this.predictionDistanceSquared) {
                if (line.normal.dot(direction) < 0) { // edge in opposite direction
                    // edges.push([line, line.distSquared(coord)])

                    const project = line.project(coord)
                    if (project) {
                        if (line.isBetween(project)) {
                            edges.push([line, coord.distSquared(project)])
                        }
                    }
                }
                continue

                const intersection = line.getLineIntersection(moveLine)
                if (intersection) {
                    const intersectionDirection = Vector.sub(intersection, coord)
                    if (direction.dot(intersectionDirection) < 0) { // intersection in opposite direction

                    } else {
                        if (line.isBetween(intersection)) {
                            edges.push([line, coord.distSquared(intersection)])
                        }
                    }
                }

                // const coordProjected = line.project(coord)
                // if (line.isBetween(coordProjected)) {
                //     // const nextCoordProjected = line.project(nextCoord)
                //
                //     // if (nextCoordProjected)
                //
                //     edges.push([line, line.distSquared(nextCoord)])
                // }
                // }
            }
        }

        edges = edges.sort((a, b) => {
            return a[1] - b[1]
        })

        // const ps = this.lines
        //     .map(line => {
        //         const projection = line.project(coord)
        //
        //         const between = line.isBetween(projection)
        //         const distSquared = Vector
        //             .sub(coord, projection)
        //             .lengthSquared
        //         return [line, distSquared, between]
        //     })
        //     .filter(x => x[2])
        //     .sort((a, b) => {
        //         return a[1] - b[1]
        //     })
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
