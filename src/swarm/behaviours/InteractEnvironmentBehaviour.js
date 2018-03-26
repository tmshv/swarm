import Behaviour from './Behaviour'
import {Chance} from 'chance'

const chance = new Chance()

export default class InteractEnvironmentBehaviour extends Behaviour {
    constructor(options) {
        super(options)

        this.environmentSample = []
        this.interest = new Map()
        this.targetAttractor = null
    }

    run({environment}) {
        if (this.needToUpdateEnvironment(environment)) {
            this.rememberEnvironmentSample(environment)
        }

        if (this.needToUpdateTarget()) {
            this.selectTargetAttractor()
        }

        this.seekAccelerated(this.targetAttractor.location)
    }

    needToUpdateEnvironment(env) {
        return this.environmentSample.length === 0
    }

    needToUpdateTarget() {
        const attractor = this.targetAttractor
        if (!attractor) return true

        let interest = this.interest.get(attractor)
        if (interest < 0) return true

        interest -= 0.25
        this.interest.set(attractor, interest)

        return false
    }


    rememberEnvironmentSample(env) {
        const loc = this.agent.location
        this.environmentSample = env.getSample(loc.x, loc.y, [])
        this.environmentSample.forEach(attractor => {
            const initialInterest = 1
            this.interest.set(attractor, initialInterest)
        })
    }

    selectTargetAttractor() {
        const ws = this.environmentSample.map(a => a.power)
        const a = chance.weighted(this.environmentSample, ws)
        this.interest.set(a, a.power)
        this.targetAttractor = a
    }
}