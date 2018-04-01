import Behaviour from './Behaviour'

export default class SeekNearestAttractorBehaviour extends Behaviour {
    constructor({thresholdDistQuad, ...options}) {
        super(options)

        this.thresholdDistQuad = thresholdDistQuad
        this.targetAttractor = null

        this.visitedAttractors = []
    }

    run({environment}) {
        if (this.needToUpdateTarget()) {
            this.selectTargetAttractor(environment)
        }

        this.seekAccelerated(this.targetAttractor.location)
    }

    needToUpdateTarget() {
        const attractor = this.targetAttractor
        if (!attractor) return true

        if (this.agent.location.distQuad(this.targetAttractor.location) < this.thresholdDistQuad) {
            this.visitedAttractors.push(this.targetAttractor)
            return true
        }

        return false
    }

    selectTargetAttractor(env) {
        this.targetAttractor = env.getNearestAttractor(this.agent.location, this.visitedAttractors)
    }
}