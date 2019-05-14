import MovingBehavior from './MovingBehavior'

export default class FindAttractorBehavior extends MovingBehavior {
    init({thresholdDistQuad}) {
        this.thresholdDistQuad = thresholdDistQuad
        this.targetAttractor = null

        this.visitedAttractors = []
    }

    run({environment}) {
        // if see attractor
        // move to attractor
        // otherwise use alternative
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