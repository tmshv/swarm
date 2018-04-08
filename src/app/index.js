import React from 'react'
import {render} from 'react-dom'
import App from '../components/App/App'

import './index.less'

import ScreenController from '../swarm/controllers/ScreenController'
import ViewController from '../swarm/controllers/ViewController'
import {createDemoSimulation, getDemoCameraCenter} from './demo'
import Camera from '../swarm/render/Camera'
import ObstacleView from '../swarm/views/ObstacleView'
import AgentsView from '../swarm/views/AgentsView'
import EmittersView from '../swarm/views/EmittersView'
import NavigateTool from '../swarm/tools/NavigateTool'
import PheromonesView from '../swarm/views/PheromonesView'
import AttractorsView from '../swarm/views/AttractorsView'
import {createUnit4Simulation, getUnit4CameraCenter} from './unit4'
import Vector from '../swarm/Vector'
// import SelectedView from '../swarm/views/SelectedView'
// import EmittersView from '../swarm/views/EmittersView'
// import AgentsView from '../swarm/views/AgentsView'
// import AttractorsView from '../swarm/views/AttractorsView'
// import AttractorsPathView from '../swarm/views/AttractorsPathView'
// import PheromonesView from '../swarm/views/PheromonesView'

function main() {
    // const simulation = createUnit4Simulation({
    //     createView,
    // })
    // screenController.setCenter(new Vector(-520.526075, -11307.682458))

    // onClick(event) {
    //     const x = event.clientX
    //     const y = event.clientY
    //
    //     this.view.select({
    //         point: {x, y}
    //     })
    // }

    const Layer = {
        AGENTS: 'agents',
        EMITTERS: 'emitters',
        OBSTACLES: 'obstacles',
        ATTRACTORS: 'attractors',
        PHEROMONES: 'pheromones',
    }

    const layerRegistry = {
        [Layer.AGENTS]: (params) => new AgentsView({
            clear: true,
            ...params,
        }),
        [Layer.ATTRACTORS]: (params) => new AttractorsView({
            clear: true,
            ...params,
        }),
        // pathAttractors: (params) => new AttractorsPathView({
        //     clear: false,
        //     ...params,
        // }),
        [Layer.OBSTACLES]: (params) => new ObstacleView({
            clear: true,
            ...params,
        }),
        [Layer.EMITTERS]: (params) => new EmittersView({
            clear: true,
            ...params,
        }),
        // selected: (params) => new SelectedView({
        //     ...params,
        //     radius: 10,
        // }),
        [Layer.PHEROMONES]: (params) => new PheromonesView({
            clear: true,
            maxValue: 10,
            ...params,
        }),
    }

    const scale = 1

    const simulation = createUnit4Simulation()
    const viewController = new ViewController(simulation)

    const camera = new Camera(window)
    // camera.setCenter(getDemoCameraCenter())
    camera.location.setFrom(getUnit4CameraCenter())

    const screenController = new ScreenController(window, viewController)
    const mouseCallbacks = screenController.getMouseCallbacks()

    const mouseWorldCoordChannels = viewController.createScreenToWorldChannel(screenController.channels)
    const tool = new NavigateTool({
        camera,
        channel: screenController.channels
    })
    tool.mouseDirectionMultiplyX = 1 / scale
    tool.mouseDirectionMultiplyY = 1 / scale
    tool.run()

    // const worldCoord = viewController.screenToWorld(coord)

    const layers = viewController
        .registerViewFactory(Layer.AGENTS, layerRegistry[Layer.AGENTS])
        .registerViewFactory(Layer.EMITTERS, layerRegistry[Layer.EMITTERS])
        .registerViewFactory(Layer.OBSTACLES, layerRegistry[Layer.OBSTACLES])
        .registerViewFactory(Layer.ATTRACTORS, layerRegistry[Layer.ATTRACTORS])
        .registerViewFactory(Layer.PHEROMONES, layerRegistry[Layer.PHEROMONES])
        .addLayout(Layer.OBSTACLES)
        .addLayout(Layer.EMITTERS)
        .addLayout(Layer.ATTRACTORS)
        .addLayout(Layer.AGENTS)
        .addLayout(Layer.PHEROMONES)
        .scaleViews(scale, scale)
        .translateFromCamera(camera)
        // .rotateViews(Math.PI)
        .getLayers({
            ...mouseCallbacks,
        })

    // const layers = [
    //     // {
    //     //     layers: ['emitters'],
    //     //     runOnce: false,
    //     //     controlable: false,
    //     // },
    //     // {
    //     //     layers: [Layer.OBSTACLES],
    //     //     controlable: false,
    //     // },
    //     // {
    //     //     layers: ['environmentAttractors'],
    //     //     runOnce: false,
    //     //     controlable: false,
    //     // },
    //     // {
    //     //     layers: ['pheromones'],
    //     //     runOnce: false,
    //     //     controlable: false,
    //     // },
    //     // {
    //     //     layers: ['agents'],
    //     //     runOnce: false,
    //     //     controlable: false,
    //     // },
    //     // {
    //     //     layers: ['selected'],
    //     //     runOnce: false,
    //     //     controlable: true,
    //     //     ...mouseCallbacks,
    //     // },
    // ]

    // viewController.render()

    const ui = {
        onClick: () => {
            if (simulation.isRunning) {
                simulation.stop()
            } else {
                simulation.run()
            }
        }
    }

    let A
    tool.channels.update.on(() => {
        console.log('Camera', camera.location)

        cancelAnimationFrame(A)
        A = requestAnimationFrame(updateCamera)
    })

    function updateCamera() {
        viewController.translateFromCamera(camera)
        viewController.render()
    }

    screenController.channels.click.on(coord => {
        console.log('Screen Click', coord)
    })

    mouseWorldCoordChannels.click.on(coord => {
        console.log('World Click', coord)
    })

    mouseWorldCoordChannels
    // screenController.channels
        .mouseMove.on(coord => {
        // console.log(`${coord.x} ${coord.y}`)
    })

    const mountElement = document.querySelector('#app')
    const app = (
        <App
            layers={layers}
            uiCallbacks={ui}
        />
    )
    render(app, mountElement)
    window.s = simulation.run()
}

main()
