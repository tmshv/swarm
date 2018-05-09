import React from 'react'
import {render} from 'react-dom'
import App from '../components/App/App'

import './index.less'

import {createDemoSimulation, getDemoCameraCenter} from './demo'
import AppController from '../swarm/controllers/AppController'
import {createSimulation, getCameraCenter} from './unit4'
import ToolType from '../swarm/ToolType'

function main() {
    const scale = 1
    const scaleX = scale
    const scaleY = -scale
    const simulation = createSimulation()

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

    swarm.tools.getToolUpdateSignal(ToolType.CONSOLE_EXPORT).on(({attractors, pheromones}) => {
        console.log('Attractors:')
        console.log(attractors.join('\n'))

        console.log('Pheromones:')
        console.log(pheromones.join('\n'))
    })

    swarm.tools.getToolUpdateSignal(ToolType.CONSOLE_DEBUG_EXPORT).on(({agentsPoolSize, viewportTransform}) => {
        console.log('Pool:', agentsPoolSize)
        console.log('Viewport:', viewportTransform)
    })

    const layers = swarm.createLayout()
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

main()
