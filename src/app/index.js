import React from 'react'
import {render} from 'react-dom'
import App from '../components/App/App'

import './index.less'

import {createDemoSimulation, getDemoCameraCenter} from './demo'
import AppController from '../swarm/controllers/AppController'
import {createSimulation, getCameraCenter} from './unit4'

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
        cameraCoord: getCameraCenter(),
    })

    swarm.selectUpdateSignal.on(item => {
        console.log('Select:', item)
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
