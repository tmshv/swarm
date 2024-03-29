import MovingBehavior from './MovingBehavior'

export default class SeparateAgentsBehavior extends MovingBehavior {
    init({radius}) {
        this.radius = radius
    }

    run({agentsPool}) {
        const agents = agentsPool.getInRadius(this.agent.location, this.radius)

        for (let a of agents) {
            if (a !== this.agent) {
                this.flee(a.location)
            }
        }
    }
}