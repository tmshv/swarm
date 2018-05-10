import Behaviour from './Behaviour'
import AttractorType from '../AttractorType'
import Tag from '../Tag'

export default class SeekNearestAttractorBehaviour extends Behaviour {
    init({thresholdDistSquared}) {
        this.thresholdDistSquared = thresholdDistSquared
        this.targetAttractor = null

        this.visitedAttractors = []
    }

    run({environment}) {
        this.selectTargetAttractor(environment)

        const attractor = this.targetAttractor
        const agent = this.agent

        if (attractor) {
            if (this.isReached()) {
                this.visitedAttractors.push(attractor)
                attractor.addAgent(agent)

                const type = attractor.getTag(Tag.TYPE)
                if (type === AttractorType.BUS_STOP) {
                    agent.die()
                }
            }

            this.seekAccelerated(this.targetAttractor.location)
        }
    }

    isReached() {
        return this.agent.location.distSquared(this.targetAttractor.location) < this.thresholdDistSquared
    }

    // needToUpdateTarget() {
    //     return true
    //     // const attractor = this.targetAttractor
    //     // if (!attractor) return true
    //     //
    //     // const agent = this.agent
    //     // if (agent.location.distSquared(attractor.location) < this.thresholdDistSquared) {
    //     //     attractor.addAgent(agent)
    //     //     agent.die()
    //     //     this.visitedAttractors.push(this.targetAttractor)
    //     //     return true
    //     // }
    //     //
    //     // return false
    // }

    selectTargetAttractor(env) {
        this.targetAttractor = env.getNearestAttractor(this.agent.location, this.visitedAttractors)
    }
}