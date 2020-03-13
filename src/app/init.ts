import Simulation from '../swarm/Simulation'
import AgentPool from '../swarm/AgentPool'
import Environment from '../swarm/Environment'
import Attractor from '../swarm/Attractor'
import Id from '../swarm/Id'
import Emitter from '../swarm/Emitter'
import Vector from '../swarm/Vector'
import Pheromones from '../swarm/Pheromones'
import Tag from '../swarm/Tag'
import ObstacleType from '../swarm/ObstacleType'
import PathObstacle from '../swarm/PathObstacle'
import AttractorType from '../swarm/AttractorType'
import { createAgent } from './createAgent'

export type SwarmUserData = {
    [name: string]: any
}

export type SwarmObjectGeometry = {
    type: string
    coordinates: any
}

export type SwarmDataObject = {
    type: string
    geometry: SwarmObjectGeometry
    properties: SwarmUserData
}

export type SwarmData = {
    vesion: string
    options: SwarmUserData
    objects: SwarmDataObject[]
}

export async function fetchProject(url: string) {
    const res = await fetch(url)
    const data: SwarmData = await res.json()

    return data
}

const pheromones = new Pheromones({
    cellSize: 5,
    // increaseValue: 1,
    // decreaseValue: .0001,
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

export function getSettings(data: SwarmData) {
    return {
        backgroundColor: '#333f4d',
        ...data.options,
    }
}

export async function createSimulation(data: SwarmData) {
    const s = new Simulation()
    s.setAgents(new AgentPool(100))
    s.setEnvironment(createEnvironment(data))
    createEmitters(s, data)

    return s
}

export function getCameraCenter(data: SwarmData): Vector {
    const target = data.objects.find(x => x.type === 'emitter')
    if (!target) {
        return new Vector(0, 0)
    }

    return createGeometry(target.geometry)
}

function createGeometry(geom) {
    const mult = 10
    switch (geom.type) {
        case 'point': {
            const v = new Vector(geom.coordinates[0], geom.coordinates[1])
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

function createEmitters(s: Simulation, data: SwarmData) {
    data.objects
        .filter(x => x.type === 'emitter')
        .forEach(obj => {
            const coord = createGeometry(obj.geometry)
            const amount = obj.properties.amount
            const period = obj.properties.period || 10
            const e = createEmitter(coord, period, amount)
            s.addEmitter(e)
        })
}

function createEnvironment(data: SwarmData) {
    const env = new Environment()
    env.addPheromones('kek', pheromones)

    initAttractors(env, data)
    initObstacles(env, data)

    return env
}

function initAttractors(env: Environment, data: SwarmData) {
    data.objects
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
}

function initObstacles(env: Environment, data: SwarmData) {
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

    data.objects
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
