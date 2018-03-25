import Agent from './Agent'

export default class EnvironmentAgent extends Agent {
    constructor(...args) {
        super(...args)

        this.environmentSample = []
        this.interest = new Map()
        this.targetAttractor = null
    }

    run({agentsPool, environment}) {
        super.run({agentsPool})
        this.interactEnvironment(environment)
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

    interactEnvironment(env) {
        if (this.needToUpdateEnvironment(env)) {
            this.rememberEnvironmentSample(env)
        }

        if (this.needToUpdateTarget()) {
            this.selectTargetAttractor()
        }

        this.seek(this.targetAttractor.location)
    }

    rememberEnvironmentSample(env) {
        this.environmentSample = env.getSample(this.location.x, this.location.y, [])
        this.environmentSample.forEach(attractor => {
            const initialInterest = 1
            this.interest.set(attractor, initialInterest)
        })
    }

    selectTargetAttractor() {
        const a = this.environmentSample[Math.floor((Math.random() * this.environmentSample.length))]
        this.interest.set(a, a.power)
        this.targetAttractor = a
    }
}