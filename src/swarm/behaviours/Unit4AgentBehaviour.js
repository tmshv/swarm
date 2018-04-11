import Behaviour from './Behaviour'
import RandomWalkBehaviour from './RandomWalkBehaviour'
import TtlBehavior from './TtlBehavior'
import ComposableBehavior from './ComposableBehavior'
import AvoidObstaclesBehavior from './AvoidObstaclesBehavior'
import LimitAccelerationBehaviour from './LimitAccelerationBehaviour'
import SpreadPheromonesBehaviour from './SpreadPheromonesBehaviour'
import SeekNearestAttractorBehaviour from './SeekNearestAttractorBehaviour'
import InteractPheromonesBehaviour from './InteractPheromonesBehaviour'

export default class Unit4AgentBehaviour extends Behaviour {
    constructor(options) {
        super(options)

        this.finding = ComposableBehavior.compose(
            new RandomWalkBehaviour({
                accelerate: 0.5,
            }),
            // new InteractPheromonesBehaviour({
            //     accelerate: 0.5,
            // }),
        )
        this.smart = ComposableBehavior.compose(
            // new SpreadPheromonesBehaviour({}),
            new SeekNearestAttractorBehaviour({
                accelerate: 0.5,
                thresholdDistSquared: 10,
            }),
        )
    }

    init({radius}) {
        this.radius = radius
        this._radiusSquared = radius ** 2
    }

    setAgent(agent) {
        super.setAgent(agent)
        this.finding.setAgent(agent)
        this.smart.setAgent(agent)
    }

    run(options) {
        const {environment} = options

        const location = this.agent.location
        const attractor = environment.getNearestAttractor(location, [])

        if (location.distSquared(attractor.location) < this._radiusSquared) {
            this.smart.run(options)
        } else {
            this.finding.run(options)
        }
    }
}