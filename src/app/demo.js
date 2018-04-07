import Simulation from '../swarm/Simulation'
import AgentPool from '../swarm/AgentPool'
import Agent from '../swarm/Agent'
import Environment from '../swarm/Environment'

import Attractor from '../swarm/Attractor'
import Id from '../swarm/Id'
import Emitter from '../swarm/Emitter'
import Vector from '../swarm/Vector'
import SeekNearestAttractorBehaviour from '../swarm/behaviours/SeekNearestAttractorBehaviour'
import Pheromones from '../swarm/Pheromones'
import Obstacle from '../swarm/Obstacle'
import AvoidObstaclesBehavior from '../swarm/behaviours/AvoidObstaclesBehavior'
import TtlBehavior from '../swarm/behaviours/TtlBehavior'
import ComposableBehavior from '../swarm/behaviours/ComposableBehavior'
import LimitAccelerationBehaviour from '../swarm/behaviours/LimitAccelerationBehaviour'
import SeekLocationBehaviour from '../swarm/behaviours/SeekLocationBehaviour'
import AgentBehaviour from '../swarm/AgentBehaviour'
import Line from '../swarm/Line'

const pheromones = new Pheromones({
    cellSize: 5,
    increaseValue: 1,
    decreaseValue: .0001,
})

export function createDemoSimulation() {
    const s = new Simulation()
    s.setAgents(new AgentPool())
    s.setEnvironment(createEnvironment())
    createEmitters(s)

    return s
}

export function getDemoCameraCenter() {
    const l = new Line(
        new Vector(465, 656),
        new Vector(929, 649),
    )
    return l.getCentroid()
    // return new Vector(50, 50)
}

function createAgent(loc, behaviour = null) {
    const initialVelocity = new Vector(0, 0)

    // const noise = Vector.fromAngle(Math.random() * Math.PI * 2)
    // noise.mult(0.1)
    // loc.add(noise)

    if (!behaviour) {
        behaviour = ComposableBehavior.compose(
            new TtlBehavior({
                ttl: 500,
            }),

            // new ConditionalBehavior({
            //     predicate: new IfTargetReachedBehavior({
            //         minDistance: 5,
            //     }),
            //     trueBranch: AgentBehaviour.SEEK_LOCATION,
            //     falseBranch: new RandomWalkBehaviour({
            //         accelerate: 0.25,
            //     }),
            // }),

            // new AlignAgentsBehaviour({
            //     accelerate: .21,
            //     radius: 25,
            // }),
            //
            // new SeparateAgentsBehaviour({
            //     accelerate: 1,
            //     radius: 25,
            // }),
            //
            // new CohesionAgentsBehaviour({
            //     accelerate: .05,
            //     radius: 25,
            // }),

            // new WalkToNearestAttractorBehaviour({}),
            new SeekNearestAttractorBehaviour({
                accelerate: 0.1,
                thresholdDistQuad: 50,
            }),
            // new InteractAgentsBehaviour({
            //     accelerate: 0.4,
            //     radius: 25,
            //     initialInterest: 200,
            // }),
            // new RandomWalkBehaviour({
            //     accelerate: 0.25,
            // }),
            // new InteractEnvironmentBehaviour({
            //     accelerate: 0.1
            // }),
            // new InteractPheromonesBehaviour({
            //     accelerate: .05,
            // }),
            // new SpreadPheromonesBehaviour({
            //     pheromones,
            // }),
            new AvoidObstaclesBehavior({
                accelerate: .5,
                predictionDistance: 15,
                radius: 1000,
            }),
            new LimitAccelerationBehaviour({
                limit: 3,
            })
        )
    }

    const a = new Agent({
        behaviour,
    })
    a.damp = 0.5
    a.location.setFrom(loc)
    a.velocity.setFrom(initialVelocity)
    a.addBehaviour(AgentBehaviour.SEEK_LOCATION, new SeekLocationBehaviour({
        accelerate: 0.1,
        threshold: 2,
    }))

    return a
}

function createEmitters(s) {
    const emitters = [
        [new Vector(750, 550), 100, 1],
        [new Vector(829, 649), 100, 1],
    ]

    emitters.forEach(e => {
        s.addEmitter(createEmitter(...e))
    })
}

function createEnvironment() {
    const env = new Environment({
        pheromones,
    })

    // env.addAttractor(mouseAttractor)
    const attractors = [
        [new Vector(665, 556), 100],
    ]

    attractors.forEach(([coord, power]) => {
        env.addAttractor(createAttractor({
            x: coord.x,
            y: coord.y,
            power,
        }))
    })

    env.addObstacle(Obstacle.fromCoords([
        new Vector(465, 656),
        new Vector(929, 649),
    ]))

    env.addObstacle(Obstacle.fromCoords([
        new Vector(165, 856),
        new Vector(929, 856),
    ]))

    return env
}

function createEmitter(coord, period, amount) {
    return new Emitter({
        x: coord.x,
        y: coord.y,
        period,
        amount,
        factory: createAgent,
    })
}

function createAttractor({x, y, power}) {
    const id = Id.get('attractor')
    return new Attractor({id, x, y, power})
}
