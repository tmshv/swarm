import Simulation from '../swarm/Simulation'
import AgentPool from '../swarm/AgentPool'
import Agent from '../swarm/Agent'
import Environment from '../swarm/Environment'

import Attractor from '../swarm/Attractor'
import Id from '../swarm/Id'
import Emitter from '../swarm/Emitter'
import Vector from '../swarm/Vector'
import SeekNearestAttractorBehavior from '../swarm/behaviors/SeekNearestAttractorBehavior'
import Pheromones from '../swarm/Pheromones'
import Obstacle from '../swarm/Obstacle'
import AvoidObstaclesBehavior from '../swarm/behaviors/AvoidObstaclesBehavior'
import TtlBehavior from '../swarm/behaviors/TtlBehavior'
import ComposableBehavior from '../swarm/behaviors/ComposableBehavior'
import LimitAccelerationBehavior from '../swarm/behaviors/LimitAccelerationBehavior'
import SeekLocationBehavior from '../swarm/behaviors/SeekLocationBehavior'
import AgentBehavior from '../swarm/AgentBehavior'
import Line from '../swarm/Line'
import Tag from '../swarm/Tag'
import ObstacleType from '../swarm/ObstacleType'
import AvoidPointObstaclesBehavior from '../swarm/behaviors/AvoidPointObstaclesBehavior'
import PointObstacle from '../swarm/PointObstacle'
import PathObstacle from '../swarm/PathObstacle'
import BoidBehavior from '../swarm/behaviors/BoidBehavior'
import AttractorType from '../swarm/AttractorType'
import AlignAgentsBehavior from '../swarm/behaviors/AlignAgentsBehavior'
import SeparateAgentsBehavior from '../swarm/behaviors/SeparateAgentsBehavior'
import CohesionAgentsBehavior from '../swarm/behaviors/CohesionAgentsBehavior'
import RandomWalkBehavior from '../swarm/behaviors/RandomWalkBehavior'
import SpreadPheromonesBehavior from '../swarm/behaviors/SpreadPheromonesBehavior'

let DATA = null

export async function init(url) {
    const res = await fetch(url)
    const data = await res.json()

    DATA = data

    return {
        createSimulation,
        getCameraCenter,
        getSettings,
        getLayers,
        createControls,
    }
}

const pheromones = new Pheromones({
    cellSize: 5,
    increaseValue: 1,
    decreaseValue: .0001,
})

export function getLayers() {
    return [
        {
            name: 'Buildings',
            view: 'buildings',
            options: {}
        },

        {
            name: 'Obstacles',
            view: 'obstacles',
            options: {}
        },

        {
            name: 'Ph',
            view: 'pheromones',
            options: {
                pheromonesName: 'kek',
                pheromoneVelocityMultiplier: 0.1,
                fill: (alpha) => {
                    // console.log(alpha)
                    return `rgba(255, 255, 255, ${alpha})`
                }
            }
        },

        {
            name: 'Emitters',
            view: 'emitters',
            options: {}
        },

        {
            name: 'Attractors',
            view: 'attractors',
            options: {}
        },

        {
            name: 'Agents',
            view: 'agents',
            options: {
                size: (agent, options) => options.agentSize,
                fill: (agent, options) => {
                    // return `rgba(255, 255, 255, ${options.agentAlpha})`

                    return options.agentColor
                },
            },
        },
    ]
}

export function createControls() {
    return [
        // {
        //     type: 'string',
        //     field: '',
        //     label: '',
        // },
        {
            type: 'number',
            field: 'agentTtl',
            label: 'Agent ttl',
            min: 1,
            max: 1500,
            step: 1,
            defaultValue: 500,
        },
        {
            type: 'number',
            field: 'agentSize',
            label: 'Agent size',
            min: 1,
            max: 10,
            step: 0.5,
            defaultValue: 2,
        },
        {
            type: 'color',
            field: 'agentColor',
            label: 'Agent color',
            defaultValue: '#ffffff',
        },
        //                     {/* <DatString path='package' label='Package' />
        //         <DatNumber path='power' label='Power' min={9000} max={9999} step={1} />
        //         <DatBoolean path='isAwesome' label='Awesome?' />
        //         <DatColor path='feelsLike' label='Feels Like' /> */}

    ]
}

export function getSettings() {
    return {
        backgroundColor: '#333f4d',
    }
}

export async function createSimulation() {
    const s = new Simulation()
    s.setAgents(new AgentPool(100))
    s.setEnvironment(createEnvironment())
    createEmitters(s)

    return s
}

export function getCameraCenter() {
    const target = DATA.objects.find(x => x.type === 'emitter')
    if (!target) {
        return new Vector(0, 0)
    }

    return createGeometry(target.geometry)
}

function createAgent(loc, vars) {
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

function createGeometry(geom) {
    const mult = 10
    switch (geom.type) {
        case 'point': {
            const v = new Vector(...geom.coordinates)
            v.mult(mult)
            return v
        }
        case 'polyline':
            return geom.coordinates.map(([x, y]) => {
                const v = new Vector(x, y)
                v.mult(mult)
                return v
            })

        default:
            return null
    }
}

function createEmitters(s) {
    DATA.objects
        .filter(x => x.type === 'emitter')
        .forEach(obj => {
            const coord = createGeometry(obj.geometry)
            const amount = obj.properties.amount
            const period = obj.properties.period || 10
            const e = createEmitter(coord, period, amount)
            s.addEmitter(e)
        })
}

function createEnvironment() {
    const env = new Environment({
    })
    env.addPheromones('kek', pheromones)

    initAttractors(env)
    initObstacles(env)

    return env
}

function initAttractors(env) {
    DATA.objects
        .filter(x => x.type === 'attractor')
        .forEach(obj => {
            const coord = createGeometry(obj.geometry)
            const power = 1
            const a = createAttractor({
                x: coord.x,
                y: coord.y,
                power,
            })
            a.addTag(AttractorType.UNKNOWN)
            env.addAttractor(a)
        })

    // env.addAttractor(mouseAttractor)
    // const attractors = [
    //     [new Vector(200, 40), 100],
    //     [new Vector(50, 150), 100],
    //     [new Vector(50, -150), 100],
    // ]
}

function initObstacles(env) {
    // DATA.objects
    //     .filter(x => x.type === 'obstacle' && x.geometry.type === 'point')
    //     .forEach(obj => {
    //         const radius = 10
    //         const coord = createGeometry(obj.geometry)
    //         const x = new PointObstacle({ radius })
    //         x.location.setFrom(coord)
    //         x.addTag(Tag.TYPE, ObstacleType.THING)
    //         env.addObstacle(x)
    //     })

    DATA.objects
        .filter(x => x.type === 'obstacle' && x.geometry.type === 'polyline')
        .forEach(obj => {
            const cs = createGeometry(obj.geometry)
            let fix = obj.properties.type === 'volume'

            if (obj.properties.type === 'void') {
                fix = false
                cs.reverse()
            }

            const x = PathObstacle.fromCoords(cs, fix)

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

function createAttractor({ x, y, power }) {
    const id = Id.get('attractor')
    return new Attractor({ id, x, y, power })
}
