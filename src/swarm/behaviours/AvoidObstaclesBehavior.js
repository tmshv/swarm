import Behaviour from './Behaviour'
import Line from '../Line'

export default class AvoidObstaclesBehavior extends Behaviour {
    constructor({radius, predictionDistance, ...options}) {
        super(options)
        this.radius = radius
        this.predictionDistance = predictionDistance
        this.distanceSquared = predictionDistance ** 2

        this.cc = Math.random() < 0.5
    }

    run({environment}) {
        this.reflection = null
        this.edge = null

        const predict = this.predictLocation()
        const predictDirection = this.getPredictionVector()
        // const location = predict
        const location = this.agent.location
        const obstacle = environment.findObstacle(location, this.radius)
        if (!obstacle) return

        let edge = obstacle.getNearestEdge(location, predictDirection)
        if (!edge) return

        if (edge.distSquared(predict) >= this.distanceSquared) {
            return
        }

        this.edge = edge

        // const move = new Line(location, predict)

        // if (!edge.isIntersect(move)) {
        //     return
        // }

        const reflection = edge.getDirection()

        // if (reflection.dot(predictDirection) < 0) {
            if (this.cc) {
            reflection.reverse()
        }

        this.reflection = this.forceAccelerated(reflection)
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