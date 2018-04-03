import Behaviour from './Behaviour'
import AgentBehaviour from '../AgentBehaviour'

export default class WalkToNearestAttractorBehaviour extends Behaviour {
    init({}) {
        this.visitedAttractors = []
    }

    run({environment}) {
        const walk = this.agent.getBehaviour(AgentBehaviour.SEEK_LOCATION)
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