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
import AvoidPointObstaclesBehavior from '../swarm/behaviours/AvoidPointObstaclesBehavior'
import PointObstacle from '../swarm/PointObstacle'
import PathObstacle from '../swarm/PathObstacle'
import BoidBehavior from '../swarm/behaviours/BoidBehavior'
import AttractorType from '../swarm/AttractorType';

const pheromones = new Pheromones({
    cellSize: 5,
    increaseValue: 1,
    decreaseValue: .0001,
})

export function getSettings() {
    return {
        backgroundColor: 'white',
    }
}

export async function createSimulation() {
    const s = new Simulation()
    s.setAgents(new AgentPool())
    s.setEnvironment(createEnvironment())
    createEmitters(s)

    return s
}

export function getCameraCenter() {
    return new Vector(0, 0)
}

function createAgent(loc, behaviour = null) {
    const initialVelocity = new Vector(0, 0)

    // const noise = Vector.fromAngle(Math.random() * Math.PI * 2)
    // noise.mult(0.1)
    // loc.add(noise)

    if (!behaviour) {
        behaviour = ComposableBehavior.compose(
            new TtlBehavior({
                ttl: 3000,
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
                accelerate: .1,
                thresholdDistQuad: 10,
                attractorsType: [AttractorType.UNKNOWN],
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
            // new AvoidPointObstaclesBehavior({
            //     accelerate: 0.1,
            //     predictionDistance: 50,
            //     radius: 50,
            // }),
            // new AvoidObstaclesBehavior({
            //     accelerate: 1,
            //     predictionDistance: 10,
            //     radius: 50,
            // }),
            new BoidBehavior({

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
        [new Vector(-150, 0), 10000, 1],
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
        [new Vector(200, 40), 100],
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
            new Vector(-100, -100),
            new Vector(100, -100),
            new Vector(100, 100),
            new Vector(-100, 100),
        ]
    ]

    const things = [
        [new Vector(150, 5), 50],
        [new Vector(300, -5), 50],
    ]

    const n = 1
    // const line = new Line(
    //     new Vector(150, 5),
    //     new Vector(300, -5),
    // )

    buildings.forEach(cs => {
        const x = PathObstacle.fromCoords(cs)

        // for (const line of x.lines) {
        //     console.log(line)
        //
        //     const length = line.length
        //     const step = (length / n)
        //
        //     for (let i = 0; i < n; i++) {
        //         const coef = (i * step) / length
        //
        //         const coord = line.interpolateLinear(coef)
        //
        //         const point = new PointObstacle({radius: 100})
        //         point.location.setFrom(coord)
        //         point.addTag(Tag.TYPE, ObstacleType.THING)
        //         env.addObstacle(point)
        //     }
        // }
        //
        // const point = new PointObstacle({radius: 100})
        // point.location.setFrom(x.centroid)
        // point.addTag(Tag.TYPE, ObstacleType.THING)
        // env.addObstacle(point)

        x.addTag(Tag.TYPE, ObstacleType.BUILDING)
        env.addObstacle(x)
    })

    // things.forEach(([coord, radius]) => {
    //     const x = new PointObstacle({radius})
    //     x.location.setFrom(coord)
    //     x.addTag(Tag.TYPE, ObstacleType.THING)
    //     env.addObstacle(x)
    // })
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
