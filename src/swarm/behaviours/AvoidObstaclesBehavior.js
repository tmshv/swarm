import Behaviour from './Behaviour'

export default class AvoidObstaclesBehavior extends Behaviour {
    constructor({radius, predictionDistance, ...options}) {
        super(options)
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

        let edge = obstacle.getNearestEdge(location, predictDirection)
        if (!edge) return

        if (edge.distSquared(predict) >= this.predictionDistanceSquared) {
            return
        }

        let force = this.getForce(edge)
        force = this.forceAccelerated(force)

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
}