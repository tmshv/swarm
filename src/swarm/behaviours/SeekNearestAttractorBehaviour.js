import Behaviour from './Behaviour'

export default class SeekNearestAttractorBehaviour extends Behaviour {
    init({thresholdDistSquared}) {
        this.thresholdDistSquared = thresholdDistSquared
        this.targetAttractor = null

        this.visitedAttractors = []
    }

    run({environment}) {
        if (this.needToUpdateTarget()) {
            this.selectTargetAttractor(environment)
        }

        if (this.targetAttractor) this.seekAccelerated(this.targetAttractor.location)
    }

    needToUpdateTarget() {
        const attractor = this.targetAttractor
        if (!attractor) return true

        const agent = this.agent
        if (agent.location.distSquared(attractor.location) < this.thresholdDistSquared) {
            attractor.addAgent(agent)
            agent.die()
            this.visitedAttractors.push(this.targetAttractor)
            return true
        }

        return false
    }

    selectTargetAttractor(env) {
        this.targetAttractor = env.getNearestAttractor(this.agent.location, this.visitedAttractors)
    }
}