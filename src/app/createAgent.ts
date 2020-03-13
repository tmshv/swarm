import Agent from '../swarm/Agent'
import Vector from '../swarm/Vector'
import SeekNearestAttractorBehavior from '../swarm/behaviors/SeekNearestAttractorBehavior'
import AvoidObstaclesBehavior from '../swarm/behaviors/AvoidObstaclesBehavior'
import TtlBehavior from '../swarm/behaviors/TtlBehavior'
import ComposableBehavior from '../swarm/behaviors/ComposableBehavior'
import LimitAccelerationBehavior from '../swarm/behaviors/LimitAccelerationBehavior'
import SeekLocationBehavior from '../swarm/behaviors/SeekLocationBehavior'
import AgentBehavior from '../swarm/AgentBehavior'
import AttractorType from '../swarm/AttractorType'
import SeparateAgentsBehavior from '../swarm/behaviors/SeparateAgentsBehavior'
import SpreadPheromonesBehavior from '../swarm/behaviors/SpreadPheromonesBehavior'
import { SwarmUserData } from './init'

export function createAgent(loc: Vector, vars: SwarmUserData) {
    const initialVelocity = new Vector(0, 0)

    let behavior = null

    if (!behavior) {
        behavior = ComposableBehavior.compose(
            new TtlBehavior({
                ttl: vars.agentTtl,
            }),

            // BOID

            // new AlignAgentsBehavior({
            //     accelerate: .21,
            //     radius: 250,
            // }),

            new SeparateAgentsBehavior({
                accelerate: 0.2,
                radius: 250,
            }),

            // new CohesionAgentsBehavior({
            //     accelerate: .5,
            //     radius: 250,
            // }),

            // OTHER

            // new ConditionalBehavior({
            //     predicate: new IfTargetReachedBehavior({
            //         minDistance: 5,
            //     }),
            //     trueBranch: AgentBehavior.SEEK_LOCATION,
            //     falseBranch: new RandomWalkBehavior({
            //         accelerate: 0.25,
            //     }),
            // }),

            // new WalkToNearestAttractorBehavior({}),

            new SeekNearestAttractorBehavior({
                accelerate: 1,
                thresholdDistQuad: 10000 ** 2,
                attractorTypes: [AttractorType.UNKNOWN],
            }),

            // new InteractAgentsBehavior({
            //     accelerate: 0.4,
            //     radius: 25,
            //     initialInterest: 200,
            // }),

            // new RandomWalkBehavior({
            //     accelerate: 0.01,
            // }),

            // new InteractEnvironmentBehavior({
            //     accelerate: 0.1
            // }),

            // new InteractPheromonesBehavior({
            //     accelerate: .05,
            // }),

            new SpreadPheromonesBehavior({
                // pheromones,
                pheromonesName: 'kek',
            }),

            // AVOID OBSTACLE

            // new AvoidPointObstaclesBehavior({
            //     accelerate: 0.1,
            //     predictionDistance: 50,
            //     radius: 50,
            // }),

            new AvoidObstaclesBehavior({
                accelerate: 1,
                predictionDistance: 10,
                radius: 50,
            }),

            // OTHER

            new LimitAccelerationBehavior({
                limit: 1,
            })
        )
    }

    const noise = Vector.fromAngle(Math.random() * Math.PI * 2)
    noise.mult(0.1)

    const a = new Agent({
        behavior,
    })
    a.damp = 0.75
    a.location.setFrom(Vector.add(loc, noise))
    a.velocity.setFrom(initialVelocity)
    a.addBehavior(AgentBehavior.SEEK_LOCATION, new SeekLocationBehavior({
        accelerate: 0.1,
        threshold: 2,
    }))

    return a
}
