import Simulation from '../swarm/Simulation'
import { max } from 'lodash'
import AgentPool from '../swarm/AgentPool'
import Agent from '../swarm/Agent'
import Environment from '../swarm/Environment'

import Vector from '../swarm/Vector'
import Pheromones from '../swarm/Pheromones'
import PathObstacle from '../swarm/PathObstacle'
import AvoidObstaclesBehavior from '../swarm/behaviours/AvoidObstaclesBehavior'
import TtlBehavior from '../swarm/behaviours/TtlBehavior'
import ComposableBehavior from '../swarm/behaviours/ComposableBehavior'
import LimitAccelerationBehaviour from '../swarm/behaviours/LimitAccelerationBehaviour'
import SeekLocationBehaviour from '../swarm/behaviours/SeekLocationBehaviour'
import AgentBehaviour from '../swarm/AgentBehaviour'
import Emitter from '../swarm/Emitter'
import Tag from '../swarm/Tag'
import ObstacleType from '../swarm/ObstacleType'
import Polygon from '../swarm/Polygon'
import RandomWalkBehaviour from '../swarm/behaviours/RandomWalkBehaviour'
import SpreadPheromonesBehaviour from '../swarm/behaviours/SpreadPheromonesBehaviour'
import InteractPheromonesBehaviour from '../swarm/behaviours/InteractPheromonesBehaviour'

const buildings = [
    // [
    //     new Vector(132.5, 70.0),
    //     new Vector(132.5, 67.5),
    //     new Vector(135.0, 67.5),
    //     new Vector(135.0, 70.0),
    // ],

    // [
    //     new Vector(125.0, 70.0),
    //     new Vector(125.0, 67.5),
    //     new Vector(127.5, 67.5),
    //     new Vector(127.5, 70.0),
    // ],

    // [
    //     new Vector(132.5, 60.0),
    //     new Vector(135.0, 60.0),
    //     new Vector(135.0, 62.5),
    //     new Vector(132.5, 62.5),
    // ],

    // [
    //     new Vector(125.0, 60.0),
    //     new Vector(127.5, 60.0),
    //     new Vector(127.5, 62.5),
    //     new Vector(125.0, 62.5),
    // ],

    [
        new Vector(95.0, 10.0),
        new Vector(90.0, 10.0),
        new Vector(90.0, 0.0),
        new Vector(115.0, 0.0),
        new Vector(115.0, 20.0),
        new Vector(110.0, 20.0),
        new Vector(110.0, 15.0),
        new Vector(109.0, 15.0),
        new Vector(109.0, 10.0),
        new Vector(110.0, 10.0),
        new Vector(110.0, 5.0),
        new Vector(105.0, 5.0),
        new Vector(105.0, 6.0),
        new Vector(100.0, 6.0),
        new Vector(100.0, 5.0),
        new Vector(95.0, 5.0),
    ],

    [
        new Vector(20.0, 5.0),
        new Vector(15.0, 5.0),
        new Vector(15.0, 6.0),
        new Vector(10.0, 6.0),
        new Vector(10.0, 5.0),
        new Vector(5.0, 5.0),
        new Vector(5.0, 10.0),
        new Vector(6.0, 10.0),
        new Vector(6.0, 15.0),
        new Vector(5.0, 15.0),
        new Vector(5.0, 20.0),
        new Vector(0.0, 20.0),
        new Vector(0.0, 0.0),
        new Vector(25.0, 0.0),
        new Vector(25.0, 10.0),
        new Vector(20.0, 10.0),
    ],

    [
        new Vector(90.0, 25.0),
        new Vector(115.0, 25.0),
        new Vector(115.0, 50.0),
        new Vector(90.0, 50.0),
        new Vector(90.0, 45.0),
        new Vector(100.0, 45.0),
        new Vector(100.0, 44.0),
        new Vector(105.0, 44.0),
        new Vector(105.0, 45.0),
        new Vector(110.0, 45.0),
        new Vector(110.0, 40.0),
        new Vector(109.0, 40.0),
        new Vector(109.0, 35.0),
        new Vector(110.0, 35.0),
        new Vector(110.0, 30.0),
        new Vector(105.0, 30.0),
        new Vector(105.0, 31.0),
        new Vector(100.0, 31.0),
        new Vector(100.0, 30.0),
        new Vector(95.0, 30.0),
        new Vector(95.0, 35.0),
        new Vector(96.0, 35.0),
        new Vector(96.0, 40.0),
        new Vector(90.0, 40.0),
    ],

    [
        new Vector(70.0, 45.0),
        new Vector(75.0, 45.0),
        new Vector(75.0, 40.0),
        new Vector(74.0, 40.0),
        new Vector(74.0, 35.0),
        new Vector(75.0, 35.0),
        new Vector(75.0, 27.5),
        new Vector(74.0, 27.5),
        new Vector(74.0, 22.5),
        new Vector(75.0, 22.5),
        new Vector(75.0, 15.0),
        new Vector(74.0, 15.0),
        new Vector(74.0, 10.0),
        new Vector(75.0, 10.0),
        new Vector(75.0, 0.0),
        new Vector(80.0, 0.0),
        new Vector(80.0, 50.0),
        new Vector(70.0, 50.0),
    ],

    [
        new Vector(35.0, 50.0),
        new Vector(35.0, 45.0),
        new Vector(45.0, 45.0),
        new Vector(45.0, 44.0),
        new Vector(50.0, 44.0),
        new Vector(50.0, 45.0),
        new Vector(55.0, 45.0),
        new Vector(55.0, 40.0),
        new Vector(54.0, 40.0),
        new Vector(54.0, 35.0),
        new Vector(55.0, 35.0),
        new Vector(55.0, 27.5),
        new Vector(54.0, 27.5),
        new Vector(54.0, 22.5),
        new Vector(55.0, 22.5),
        new Vector(55.0, 15.0),
        new Vector(54.0, 15.0),
        new Vector(54.0, 10.0),
        new Vector(60.0, 10.0),
        new Vector(60.0, 50.0),
    ],

    [
        new Vector(35.0, 0.0),
        new Vector(60.0, 0.0),
        new Vector(60.0, 5.0),
        new Vector(50.0, 5.0),
        new Vector(50.0, 6.0),
        new Vector(45.0, 6.0),
        new Vector(45.0, 5.0),
        new Vector(40.0, 5.0),
        new Vector(40.0, 10.0),
        new Vector(41.0, 10.0),
        new Vector(41.0, 15.0),
        new Vector(40.0, 15.0),
        new Vector(40.0, 22.5),
        new Vector(41.0, 22.5),
        new Vector(41.0, 27.5),
        new Vector(40.0, 27.5),
        new Vector(40.0, 35.0),
        new Vector(41.0, 35.0),
        new Vector(41.0, 40.0),
        new Vector(35.0, 40.0),
    ],

    [
        new Vector(0.0, 45.0),
        new Vector(10.0, 45.0),
        new Vector(10.0, 44.0),
        new Vector(15.0, 44.0),
        new Vector(15.0, 45.0),
        new Vector(20.0, 45.0),
        new Vector(20.0, 40.0),
        new Vector(19.0, 40.0),
        new Vector(19.0, 35.0),
        new Vector(20.0, 35.0),
        new Vector(20.0, 30.0),
        new Vector(15.0, 30.0),
        new Vector(15.0, 31.0),
        new Vector(10.0, 31.0),
        new Vector(10.0, 30.0),
        new Vector(0.0, 30.0),
        new Vector(0.0, 25.0),
        new Vector(25.0, 25.0),
        new Vector(25.0, 50.0),
        new Vector(0.0, 50.0),
    ],
]

export function getLayers() {
    return [
        {
            name: 'Obstacles',
            view: 'obstacles',
            options: {}
        },

        {
            name: 'Emitters',
            view: 'emitters',
            options: {}
        },

        {
            name: 'Agents',
            view: 'agents',
            options: {
                size: () => 4,
                fill: agent => {
                    const deviant = agent.getTag('deviant')
                    return deviant
                        ? `rgba(140, 160, 255, 1)`
                        : `rgba(220, 220, 255, 1)`
                },
            },
        },

        {
            name: 'Pheromones1',
            view: 'pheromones',
            options: {
                pheromonesName: 'bus-stop',
                pheromoneVelocityMultiplier: 1,
                maxValue: 10,
                fill: alpha => `rgba(150, 170, 255, ${alpha * 2})`,
            }
        },

        {
            name: 'Pheromones2',
            view: 'pheromones',
            options: {
                pheromonesName: 'metro',
                pheromoneVelocityMultiplier: 1,
                maxValue: 10,
                fill: alpha => `rgba(220, 220, 255, ${alpha * 3})`,
            }
        },
    ]
}

export function getSettings() {
    return {
        backgroundColor: 'white',
    }
}

export async function createSimulation() {
    const s = new Simulation()
    s.setAgents(new AgentPool(150))
    s.setEnvironment(createEnvironment())
    initBuildings(s)
    initEmitters(s)

    return s
}

export function getCameraCenter(simulation) {
    return new Vector(115.0, 25.0)
}

export function getInitialTransform() {
    return [9.905971092325839, 0, 0, -9.905971092325839, 846.3785216584229, 1131.914385768887]
    // return [4.538039493908199, 0, 0, -4.538039493908199, 411.2693595995035, 504.79926548093414]
}

function createAgent(loc) {
    const ttl = 130
    const seekMetro = Math.random() < 0.5
    const pheromonesName = seekMetro
        ? 'metro'
        : 'bus-stop'

    const a = new Agent({
        behaviour: ComposableBehavior.compose(
            new TtlBehavior({
                ttl,
            }),
            new RandomWalkBehaviour({
                accelerate: 0.5,
            }),
            new SpreadPheromonesBehaviour({
                pheromonesName,
            }),
            new InteractPheromonesBehaviour({
                accelerate: 0.5,
                pheromonesName,
            }),
            new AvoidObstaclesBehavior({
                accelerate: 0.05,
                predictionDistance: 2,
                radius: 5,
            }),
            new LimitAccelerationBehaviour({
                limit: .15,
            })
        )
    })
    a.damp = 0.85
    a.location.set(loc.x, loc.y)

    a.addBehaviour(AgentBehaviour.SEEK_LOCATION, new SeekLocationBehaviour({
        threshold: 5,
    }))
    a.addTag('deviant', seekMetro)

    return a
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

function createEnvironment() {
    const env = new Environment()
    env.addPheromones('bus-stop', new Pheromones({
        cellSize: 1,
        damp: 0.97,
    }))
    env.addPheromones('metro', new Pheromones({
        cellSize: 1,
        damp: 0.97,
    }))

    initObstacles(env)

    return env
}

function initEmitters(simulation) {
    const emitters = [
        // [new Vector(132.242398, 61.486859), 0.8],
        // [new Vector(126.698982, 62.719501), 0.8],
        // [new Vector(133.022334, 67.203567), 0.8],
        // [new Vector(127.779672, 68.786964), 0.8],
        [new Vector(41.2, 37.5), 0.8],
        [new Vector(41.2, 12.5), 0.8],
        [new Vector(6.2, 12.5), 1.3],
        [new Vector(41.2, 25.0), 0.8],
        [new Vector(96.2, 37.5), 0.8],
        [new Vector(47.5, 6.2), 0.8],
        [new Vector(12.5, 6.2), 1.3],
        [new Vector(102.5, 31.2), 0.8],
        [new Vector(102.5, 6.2), 1.3],
        [new Vector(73.8, 25.0), 1.1],
        [new Vector(108.8, 37.5), 0.8],
        [new Vector(73.8, 37.5), 1.1],
        [new Vector(53.8, 37.5), 0.8],
        [new Vector(18.8, 37.5), 1.0],
        [new Vector(53.8, 12.5), 0.8],
        [new Vector(73.8, 12.5), 1.1],
        [new Vector(108.8, 12.5), 1.3],
        [new Vector(53.8, 25.0), 0.8],
        [new Vector(47.5, 43.8), 0.8],
        [new Vector(12.5, 43.8), 1.0],
        [new Vector(102.5, 43.8), 0.8],
        [new Vector(12.5, 31.0), 1.0],
    ]

    const maxPeriod = max(
        emitters.map(x => x[1])
    )

    emitters.forEach(([coord, period]) => {
        const p = (maxPeriod / period) * 50
        simulation.addEmitter(createEmitter(coord, p, 1))
    })
}

function initObstacles(env) {
    let obstacles = []

    buildings.forEach(cs => {
        const obstacle = PathObstacle.fromCoords(cs, false)
        obstacle.addTag(Tag.TYPE, ObstacleType.BUILDING)

        obstacles = [
            ...obstacles,
            obstacle,
        ]
    })

    obstacles.forEach(obstacle => {
        env.addObstacle(obstacle)
    })
}

function initBuildings(simulation) {
    const layer = simulation.layer('houses')

    for (const coords of buildings) {
        const p = new Polygon({ coords })
        layer.push(p)
    }
}
