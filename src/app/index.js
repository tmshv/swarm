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
import ScreenController from '../swarm/controllers/ScreenController'

const width = 1400
const height = 800
const screenControl = new ScreenController()

const pheromones = new Pheromones({
    cellSize: 2,
    increaseValue: 1,
    decreaseValue: .05,
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
        radius: 50,
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

    window.s = simulation

    simulation.run()

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
            onMouseDown: createEventToVector(coord => {
                screenControl.mouse.setFrom(coord)
                screenControl.offset.setFrom(screenControl.center)
                screenControl.dragOn()
            }),
            onMouseUp: createEventToVector(coord => {
                screenControl.dragOff()
            }),
            onMouseMove: createEventToVector(coord => {
                const vectorFromClickToMouse = Vector.sub(coord, screenControl.mouse)

                if (screenControl.isDragging) {
                    screenControl.center.setFrom(screenControl.offset)
                    screenControl.center.add(vectorFromClickToMouse)
                    screenControl.update()
                }
            }),
        },
    ]

    const props = {
        layers,
        simulation,
        width,
        height,
        devicePixelRatio: window.devicePixelRatio
    }

    render(<App {...props}/>, mountElement)
}

function createAgent(loc) {
    const a = new Agent({
        behaviour: ComposableBehavior.compose(
            new TtlBehavior({
                ttl: 800,
            }),
            // new WalkToNearestAttractorBehaviour({}),
            new SpreadPheromonesBehaviour({
                pheromones,
            }),
            new SeekNearestAttractorBehaviour({
                accelerate: 0.05,
                thresholdDistQuad: 10,
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
            new InteractPheromonesBehaviour({
                accelerate: .05,
            }),
            new AvoidObstaclesBehavior({
                accelerate: 1,
                predictionDistance: 15,
                radius: 100,
            }),
            new LimitAccelerationBehaviour({
                limit: 0.125,
            })
        )
    })
    a.damp = 0.85
    a.location.set(loc.x, loc.y)
    a.addBehaviour(AgentBehaviour.SEEK_LOCATION, new SeekLocationBehaviour({
        threshold: 5,
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
    s.addEmitter(createEmitter(new Vector(228.276186, 523.511176)))

    s.setViewFactory(createView)

    return s
}

function createView({layers, ...params}) {
    const views = layers
        .map(layer => viewLayers.hasOwnProperty(layer)
            ? viewLayers[layer]
            : (params) => new View(params)
        )
        .map(x => x(params))

    return views.length === 1
        ? views[0]
        : View.join(views)
}

function createEmitter(coord) {
    return new Emitter({
        x: coord.x,
        y: coord.y,
        period: 500,
        amount: 1,
        factory: createAgent,
    })
}

function createEnvironment() {
    const env = new Environment({
        pheromones,
    })

    const attractors = [
        new Vector(546.003183, 431.540435),
        new Vector(823.665344, 71.17033),
        new Vector(267.052991, 434.639438),
        new Vector(460.718058, 712.557743),
        new Vector(170.721102, 81.973802),
    ]

    attractors.forEach(coord => {
        env.addAttractor(createAttractor({
            x: coord.x,
            y: coord.y,
            power: 100,
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

    return env
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
