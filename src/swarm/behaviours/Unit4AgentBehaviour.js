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
            new SpreadPheromonesBehaviour({}),
            new SeekNearestAttractorBehaviour({
                accelerate: 0.5,
                thresholdDistSquared: 10,
            }),
        )
    }

    init({radius, seekNearest = true}) {
        this.radius = radius
        this._radiusSquared = radius ** 2

        this._seekNearest = seekNearest
    }

    setAgent(agent) {
        super.setAgent(agent)
        this.finding.setAgent(agent)
        this.smart.setAgent(agent)
    }

    run(options) {
        const {environment} = options
        const attractor = this.findAttractor(environment)

        if (this.agent.location.distSquared(attractor.location) < this._radiusSquared) {
            this.smart.run(options)
        } else {
            this.finding.run(options)
        }
    }

    findAttractor(environment) {
        const location = this.agent.location

        if (this._seekNearest) {
            return environment.getNearestAttractor(location, [])
        }

        const i = Math.floor(Math.random() * environment.attractors.length)
        return environment.attractors[i]
    }
}