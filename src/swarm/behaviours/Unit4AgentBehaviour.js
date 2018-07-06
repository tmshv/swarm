import Behaviour from './Behaviour'
import RandomWalkBehaviour from './RandomWalkBehaviour'
import TtlBehavior from './TtlBehavior'
import ComposableBehavior from './ComposableBehavior'
import AvoidObstaclesBehavior from './AvoidObstaclesBehavior'
import LimitAccelerationBehaviour from './LimitAccelerationBehaviour'
import SpreadPheromonesBehaviour from './SpreadPheromonesBehaviour'
import SeekNearestAttractorBehaviour from './SeekNearestAttractorBehaviour'
import InteractPheromonesBehaviour from './InteractPheromonesBehaviour'
import AttractorType from '../AttractorType'

export default class Unit4AgentBehaviour extends Behaviour {
    constructor(options) {
        super(options)

        const dieAttractorTypes = this.getDieAttractorTypes()

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
                ...options,
                attractorTypes: this.getAttractorTypes(),
                dieAttractorTypes,
                accelerate: 0.5,
                thresholdDistSquared: 10,
            }),
        )
    }

    getAttractorTypes() {
        return this._seekMetro
            ? [AttractorType.METRO_STATION, AttractorType.UNKNOWN]
            : [AttractorType.BUS_STOP, AttractorType.UNKNOWN]
    }

    getDieAttractorTypes() {
        return this._seekMetro
            ? [AttractorType.METRO_STATION]
            : [AttractorType.BUS_STOP]
    }

    init({ seekMetro = false }) {
        this._seekMetro = seekMetro
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