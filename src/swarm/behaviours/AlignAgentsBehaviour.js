import MovingBehavior from './MovingBehavior'
import Vector from '../Vector'

export default class AlignAgentsBehaviour extends MovingBehavior {
    init({radius}) {
        this.radius = radius

        this.average = new Vector(0, 0)
    }

    run({agentsPool}) {
        const agents = agentsPool.getInRadius(this.agent.location, this.radius)

        this.average.set(0, 0)
        for (let a of agents) {
            this.average.add(a.velocity)
        }
        this.average.divide(agents.length)

        this.force(this.average)
    }
}