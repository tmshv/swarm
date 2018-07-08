import Behaviour from './Behaviour'
import RandomWalkBehaviour from './RandomWalkBehaviour'
import ComposableBehavior from './ComposableBehavior'
import SpreadPheromonesBehaviour from './SpreadPheromonesBehaviour'
import SeekNearestAttractorBehaviour from './SeekNearestAttractorBehaviour'
import InteractPheromonesBehaviour from './InteractPheromonesBehaviour'

export default class Unit4AgentBehaviour extends Behaviour {
    init({ pheromonesName, attractorTypes, dieAttractorTypes, ...options }) {
        this.finding = ComposableBehavior.compose(
            new RandomWalkBehaviour({
                accelerate: 0.5,
            }),
        )
        this.smart = ComposableBehavior.compose(
            new SpreadPheromonesBehaviour({
                pheromonesName,
            }),
            new SeekNearestAttractorBehaviour({
                ...options,
                attractorTypes,
                dieAttractorTypes,
                accelerate: 0.5,
                thresholdDistSquared: 10,
            }),
            new InteractPheromonesBehaviour({
                accelerate: 0.5,
                pheromonesName,
            }),
        )
    }

    setAgent(agent) {
        super.setAgent(agent)
        this.finding.setAgent(agent)
        this.smart.setAgent(agent)
    }

    run(options) {
        const smartStatus = this.smart.run(options)

        if (smartStatus) {
            return true
        }

        return this.finding.run(options)
    }
}