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
import Tag from '../swarm/Tag'
import ObstacleType from '../swarm/ObstacleType'

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
    return new Vector(-20.082967, -11148.670933)
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
                accelerate: 1,
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
                accelerate: .01,
                predictionDistance: 7,
                radius: 1000,
            }),
            new LimitAccelerationBehaviour({
                limit: .1,
            })
        )
    }

    const a = new Agent({
        behaviour,
    })
    a.damp = 0.75
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
        [new Vector(-50.082967, -11148.670933), 80, 1],
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
        [new Vector(200.082967, -11148.670933), 100],
    ]

    attractors.forEach(([coord, power]) => {
        env.addAttractor(createAttractor({
            x: coord.x,
            y: coord.y,
            power,
        }))
    })

    initObstacles(env)

    return env
}

function initObstacles(env) {
    const buildings = [
        [
            new Vector(-20.082967, -11148.670933),
            new Vector(70.327424, -11090.062192),
            new Vector(123.635208, -11172.295276),
            new Vector(33.224817, -11230.904018),
        ]
    ]

    buildings.forEach(cs => {
        const x = Obstacle.fromCoords(cs)
        x.addTag(Tag.TYPE, ObstacleType.BUILDING)
        env.addObstacle(x)
    })
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
