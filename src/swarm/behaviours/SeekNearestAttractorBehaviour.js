import Behaviour from './Behaviour'
import AttractorType from '../AttractorType'
import Tag from '../Tag'

export default class SeekNearestAttractorBehaviour extends Behaviour {
    init({ radius, thresholdDistSquared, attractorTypes, dieAttractorTypes }) {
        this.radius = radius
        this.radiusSquared = radius ** 2
        this.thresholdDistSquared = thresholdDistSquared
        this.attractorTypes = attractorTypes
        this.dieAttractorTypes = dieAttractorTypes
        this.targetAttractor = null

        this.visitedAttractors = []
    }

    run({ environment }) {
        this.selectTargetAttractor(environment)

        const attractor = this.targetAttractor
        const agent = this.agent

        if (!attractor) {
            return false
        }

        if (this.isReached()) {
            this.visitedAttractors.push(attractor)
            attractor.addAgent(agent)

            if (this.isFinish()) {
                // console.log('die finished', agent)
                agent.die()
            }
        }

        this.seekAccelerated(this.targetAttractor.location)

        return true
    }

    isFinish() {
        return this.dieAttractorTypes.includes(this._targetAttractorType)
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
        const a = env.getNearestAttractorWithOneOfType(this.agent.location, this.attractorTypes, this.visitedAttractors)

        if (this.agent.location.distSquared(a.location) < this.radiusSquared) {
            this.targetAttractor = a
            this._targetAttractorType = a.getTag(Tag.TYPE)
            return
        }

        // this.targetAttractor = null
    }
}