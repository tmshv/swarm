import React from 'react'
import {render} from 'react-dom'
import App from '../components/App/App'

import './index.less'

import {createDemoSimulation, getDemoCameraCenter} from './demo'
import AppController from '../swarm/controllers/AppController'

function main() {
    const scale = 10
    const simulation = createDemoSimulation()

    const swarm = new AppController(window, document)
    swarm.init({
        simulation,
        scale,
        cameraCoord: getDemoCameraCenter(),
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
