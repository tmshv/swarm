import React from 'react'
import { render } from 'react-dom'
import App from '../components/App/App'

import './index.less'
import '../styles/reset.less'

import {createDemoSimulation, getDemoCameraCenter} from './demo'
import AppController from '../swarm/controllers/AppController'
import { createSimulation, getCameraCenter } from './unit4'
import ToolType from '../swarm/ToolType'

async function main() {
    const scale = 1
    const scaleX = scale
    const scaleY = -scale
    const simulation = await createSimulation()

    const swarm = new AppController(window, document)
    swarm.init({
        simulation,
        scaleX,
        scaleY,
        cameraCoord: getCameraCenter(simulation),
    })

    swarm.selectionController.channels.update.on(item => {
        console.log('Select:', item)
    })

    swarm.tools.getToolUpdateSignal(ToolType.DELETE).on(item => {
        console.log('Delete:', item)
    })

    swarm.tools.getToolUpdateSignal(ToolType.CONSOLE_EXPORT).on(({attractors, customAttractors, pheromones}) => {
        console.log('Attractors:')
        console.log(attractors.join('\n'))

        console.log('Custom Attractors:')
        console.log(customAttractors.join('\n'))

        console.log('Pheromones:')
        console.log(pheromones.join('\n'))
    })

    swarm.tools.getToolUpdateSignal(ToolType.CONSOLE_DEBUG_EXPORT).on(({agentsPoolSize, viewportTransform}) => {
        console.log('Pool:', agentsPoolSize)
        console.log('Viewport:', viewportTransform)
    })

    const layersDefenition = getLayers()
    const layers = swarm.createLayout(layersDefenition)
    const ui = {
        onClick: () => {
            if (simulation.isRunning) {
                simulation.stop()
            } else {
                simulation.run()
            }
        }
    }

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

function getLayers() {
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
            options: {}
        },

        {
            name: 'Pheromones: bus stop',
            view: 'pheromones',
            options: {
                pheromonesName: 'bus-stop',
                maxValue: 10,
            }
        },

        {
            name: 'Pheromones: metro',
            view: 'pheromones',
            options: {
                pheromonesName: 'metro',
                maxValue: 10,
            }
        },
    ]
}

main()
