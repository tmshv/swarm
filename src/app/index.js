import React from 'react'
import {render} from 'react-dom'
import Simulation from '../swarm/Simulation'
import AgentPool from '../swarm/AgentPool'
import Agent from '../swarm/Agent'
import App from '../components/App/App'
import Environment from '../swarm/Environment'

import './index.less'
import Attractor from '../swarm/Attractor'
import Id from '../swarm/Id'
import Emitter from '../swarm/Emitter'
import InteractAgentsBehaviour from '../swarm/behaviours/InteractAgentsBehaviour'
import InteractEnvironmentBehaviour from '../swarm/behaviours/InteractEnvironmentBehaviour'
import Vector from '../swarm/Vector'
import RandomWalkBehaviour from '../swarm/behaviours/RandomWalkBehaviour'
import AgentsView from '../swarm/views/AgentsView'
import View from '../swarm/views/View'
import AttractorsView from '../swarm/views/AttractorsView'
import EmittersView from '../swarm/views/EmittersView'
import SeekNearestAttractorBehaviour from '../swarm/behaviours/SeekNearestAttractorBehaviour'
import AttractorsPathView from '../swarm/views/AttractorsPathView'
import SelectedView from '../swarm/views/SelectedView'
import SpreadPheromonesBehaviour from '../swarm/behaviours/SpreadPheromonesBehaviour'
import Pheromones from '../swarm/Pheromones'
import PheromonesView from '../swarm/views/PheromonesView'
import Obstacle from '../swarm/Obstacle'
import ObstacleView from '../swarm/views/ObstacleView'
import AvoidObstaclesBehavior from '../swarm/behaviours/AvoidObstaclesBehavior'
import InteractPheromonesBehaviour from '../swarm/behaviours/InteractPheromonesBehaviour'
import TtlBehavior from '../swarm/behaviours/TtlBehavior'
import ComposableBehavior from '../swarm/behaviours/ComposableBehavior'
import LimitAccelerationBehaviour from '../swarm/behaviours/LimitAccelerationBehaviour'
import SeekLocationBehaviour from '../swarm/behaviours/SeekLocationBehaviour'
import AgentBehaviour from '../swarm/AgentBehaviour'
import WalkToNearestAttractorBehaviour from '../swarm/behaviours/WalkToNearestAttractorBehaviour'
import SeparateAgentsBehaviour from '../swarm/behaviours/SeparateAgentsBehaviour'
import ConditionalBehavior from '../swarm/behaviours/ConditionalBehavior'
import IfTargetReachedBehavior from '../swarm/behaviours/IfTargetReachedBehavior'
import AlignAgentsBehaviour from '../swarm/behaviours/AlignAgentsBehaviour'
import CohesionAgentsBehaviour from '../swarm/behaviours/CohesionAgentsBehaviour'
import ScreenController from '../swarm/controllers/ScreenController'

const screenControl = new ScreenController()

const pheromones = new Pheromones({
    cellSize: 2,
    increaseValue: 1,
    decreaseValue: .05,
})
const mouseAttractor = createAttractor({
    x: 0,
    y: 0,
    power: 100,
})

let agent = null

const viewLayers = {
    agents: (params) => new AgentsView({
        clear: true,
        ...params,
    }),
    environmentAttractors: (params) => new AttractorsView({
        clear: true,
        ...params,
    }),
    pathAttractors: (params) => new AttractorsPathView({
        clear: false,
        ...params,
    }),
    obstacles: (params) => new ObstacleView({
        clear: true,
        ...params,
    }),
    emitters: (params) => new EmittersView({
        clear: true,
        ...params,
    }),
    selected: (params) => new SelectedView({
        ...params,
        radius: 10,
    }),
    pheromones: (params) => new PheromonesView({
        clear: true,
        maxValue: 100,
        ...params,
    }),
}

function main() {
    const simulation = createSimulation()
    const mountElement = document.querySelector('#app')

    screenControl.init(simulation)

    window.s = simulation

    const mouseCallbacks = screenControl.getMouseCallbacks()

    const layers = [
        {
            layers: ['emitters'],
            runOnce: false,
            controlable: false,
        },
        {
            layers: ['obstacles'],
            runOnce: false,
            controlable: false,
        },
        {
            layers: ['environmentAttractors'],
            runOnce: false,
            controlable: false,
        },
        // {
        //     layers: ['pheromones'],
        //     runOnce: false,
        //     controlable: false,
        // },
        {
            layers: ['agents'],
            runOnce: false,
            controlable: false,
        },
        {
            layers: ['selected'],
            runOnce: false,
            controlable: true,
            ...mouseCallbacks,
        },
    ]

    const props = {
        layers,
        simulation,
    }

    render(<App {...props}/>, mountElement)
    simulation.run()
}

function createAgent(loc, behaviour = null) {
    const initialVelocity = new Vector(0, 0)

    const noise = Vector.fromAngle(Math.random() * Math.PI * 2)
    noise.mult(0.1)
    loc.add(noise)

    if (!behaviour) {
        behaviour = ComposableBehavior.compose(
            new TtlBehavior({
                ttl: 1000,
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

            new AlignAgentsBehaviour({
                accelerate: .21,
                radius: 25,
            }),

            new SeparateAgentsBehaviour({
                accelerate: 1,
                radius: 25,
            }),

            new CohesionAgentsBehaviour({
                accelerate: .05,
                radius: 25,
            }),

            // new WalkToNearestAttractorBehaviour({}),
            // new SpreadPheromonesBehaviour({
            //     pheromones,
            // }),
            // new SeekNearestAttractorBehaviour({
            //     accelerate: 0.1,
            //     thresholdDistQuad: 50,
            // }),
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
            new AvoidObstaclesBehavior({
                accelerate: 1,
                predictionDistance: 15,
                radius: 100,
            }),
            new LimitAccelerationBehaviour({
                limit: 0.05125,
            })
        )
    }

    const a = new Agent({
        behaviour,
    })
    a.damp = 0.95
    a.location.setFrom(loc)
    a.velocity.setFrom(initialVelocity)
    a.addBehaviour(AgentBehaviour.SEEK_LOCATION, new SeekLocationBehaviour({
        accelerate: 0.1,
        threshold: 2,
    }))

    if (!agent) {
        agent = a
    }

    return a
}

function createSimulation() {
    const s = new Simulation()
    s.setAgents(new AgentPool())
    s.setEnvironment(createEnvironment())
    s.addEmitter(createEmitter(new Vector(530, 500), 100, 5))
    s.setViewFactory(createView)

    s.agents.addAgent(createAgent(new Vector(300, 400), ComposableBehavior.compose(
        new SeparateAgentsBehaviour({
            accelerate: 1,
            radius: 100,
        }),
        new SeekNearestAttractorBehaviour({
            accelerate: 0.05,
            thresholdDistQuad: 5,
        }),
        new LimitAccelerationBehaviour({
            limit: 0.125,
        })),
    ))

    return s
}

function createEnvironment() {
    const env = new Environment({
        pheromones,
    })

    // env.addAttractor(mouseAttractor)
    const attractors = [
        // new Vector(546.003183, 431.540435),
        // new Vector(823.665344, 71.17033),
        // new Vector(267.052991, 434.639438),
        [new Vector(460.718058, 712.557743), 90],
        // [new Vector(170.721102, 81.973802), 50],
        [new Vector(300, 300), 100],
    ]

    attractors.forEach(([coord, power]) => {
        env.addAttractor(createAttractor({
            x: coord.x,
            y: coord.y,
            power,
        }))
    })

    env.addObstacle(Obstacle.fromCoords([
        new Vector(485.219569, 513.346362),
        new Vector(474.745578, 529.503514),
        new Vector(456.50331, 517.67781),
        new Vector(465.174043, 504.302385),
        new Vector(471.551284, 508.436486),
        new Vector(507.485386, 453.004708),
        new Vector(501.142278, 448.892774),
        new Vector(509.812845, 435.517477),
        new Vector(528.021012, 447.320963),
    ]))

    env.addObstacle(Obstacle.fromCoords([
        new Vector(300, 650),
        new Vector(800, 600),
    ]))

    return env
}

function createView({layers, ...params}) {
    const views = layers
        .map(layer => viewLayers.hasOwnProperty(layer)
            ? viewLayers[layer]
            : (params) => new View(params)
        )
        .map(x => x(params))

    const view = views.length === 1
        ? views[0]
        : View.join(views)
    screenControl.addView(view)
    return view
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

function randomCoord([maxX, maxY]) {
    const x = Math.random() * maxX
    const y = Math.random() * maxY

    return {x, y}
}

main()
