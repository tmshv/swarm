import Behavior from './Behavior'
import RandomWalkBehavior from './RandomWalkBehavior'
import ComposableBehavior from './ComposableBehavior'
import SpreadPheromonesBehavior from './SpreadPheromonesBehavior'
import SeekNearestAttractorBehavior from './SeekNearestAttractorBehavior'
import InteractPheromonesBehavior from './InteractPheromonesBehavior'

export default class Unit4AgentBehavior extends Behavior {
    init({ pheromonesName, attractorTypes, dieAttractorTypes, ...options }) {
        this.finding = ComposableBehavior.compose(
            new RandomWalkBehavior({
                accelerate: 0.5,
            }),
        )
        this.smart = ComposableBehavior.compose(
            new SpreadPheromonesBehavior({
                pheromonesName,
            }),
            new SeekNearestAttractorBehavior({
                ...options,
                attractorTypes,
                dieAttractorTypes,
                accelerate: 0.5,
                thresholdDistSquared: 10,
            }),
            new InteractPheromonesBehavior({
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