import './index.less'
import '../styles/reset.less'

import React from 'react'
import { render } from 'react-dom'
import App from '../components/App/App'
import { init } from './init'

import AppController from '../swarm/controllers/AppController'
import ToolType from '../swarm/ToolType'

async function initSimulation(project) {
    const scale = 1
    const scaleX = scale
    const scaleY = -scale
    const simulation = await project.createSimulation()
    const cameraCoord = project.getCameraCenter(simulation)

    const swarm = new AppController(window, document)
    swarm.init({
        simulation,
        scaleX,
        scaleY,
        cameraCoord,
    })

    swarm.selectionController.channels.update.on(item => {
        console.log('Select:', item)
    })

    swarm.tools.getToolUpdateSignal(ToolType.DELETE).on(item => {
        console.log('Delete:', item)
    })

    swarm.tools.getToolUpdateSignal(ToolType.CONSOLE_EXPORT).on(({ attractors, customAttractors, pheromones }) => {
        let output = ''
        function write(str) {
            output += str
            output += '\n'
        }

        if (attractors.length) {
            write('Attractors:')
            write(attractors.join('\n'))
            write('\n')
        }

        if (customAttractors.length) {
            write('Custom Attractors:')
            write(customAttractors.join('\n'))
            write('\n')
        }

        pheromones.forEach(({ name, values }) => {
            if (values.length) {
                write(`Pheromones: ${name}`)
                write(values.join('\n'))
                write('\n')
            }
        })

        const now = new Date()
        const nn = n => `${n}`.padStart(2, '0')
        const filename = `swarm-${now.getFullYear()}${nn(now.getMonth())}${nn(now.getDate())}-${nn(now.getHours())}${nn(now.getMinutes())}.txt`

        download(filename, output)
    })

    swarm.tools.getToolUpdateSignal(ToolType.CONSOLE_DEBUG_EXPORT).on(({ agentsPoolSize, viewportTransform }) => {
        console.log('Pool:', agentsPoolSize)
        console.log('Viewport:', viewportTransform)
    })

    return swarm
}

async function main() {
    const project = await init('http://localhost:5000/PARNAS_SWARM.json')
    const settings = project.getSettings()
    const swarm = await initSimulation(project)
    const simulation = swarm.getSimulation()
    const layers = swarm.createLayout(project.getLayers())
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
            backgroundColor={settings.backgroundColor}
            layers={layers}
            uiCallbacks={ui}
            displayUiSignal={swarm.tools.getToolUpdateSignal(ToolType.TOGGLE_UI)}
            swarm={swarm}
            controlsLayout={project.createControls()}
        />
    )
    render(app, mountElement)
    window.s = simulation.run()
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

main()
