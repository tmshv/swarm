import Behavior from './Behavior'
import AgentBehavior from '../AgentBehavior'

export default class WalkToNearestAttractorBehavior extends Behavior {
    init({ }) {
        this.visitedAttractors = []
    }

    run({ environment }) {
        const walk = this.agent.getBehavior(AgentBehavior.SEEK_LOCATION)
        const reached = walk.run()

        if (reached) {
            const target = this.selectTarget(environment)
            if (!target) return false

            this.visitedAttractors.push(target)
            walk.init({
                target: target.location,
            })
        }

        return true
    }

    selectTarget(env) {
        return env.getNearestAttractor(this.agent.location, this.visitedAttractors)
    }
}
