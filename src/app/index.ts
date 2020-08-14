import AppController from '../swarm/controllers/AppController'
import ToolType from '../swarm/ToolType'
import Vector from 'src/swarm/Vector'
import { createSimulation } from './init'

export type SimulationOptions = {
    cameraCoord: Vector
}

export async function initSimulation(project, { cameraCoord }: SimulationOptions) {
    const scale = 1
    const scaleX = scale
    const scaleY = -scale
    const simulation = await createSimulation(project)

    const swarm = new AppController(window, document)
    swarm.init({
        simulation,
        scaleX,
        scaleY,
        cameraCoord,
    })
    swarm.viewController.zoom(-1, cameraCoord)
    swarm.viewController.zoom(-1, cameraCoord)
    swarm.viewController.zoom(-1, cameraCoord)
    swarm.viewController.zoom(-1, cameraCoord)
    swarm.viewController.zoom(-1, cameraCoord)
    swarm.viewController.zoom(-1, cameraCoord)
    swarm.viewController.zoom(-1, cameraCoord)
    swarm.viewController.zoom(-1, cameraCoord)
    swarm.viewController.zoom(-1, cameraCoord)
    swarm.viewController.zoom(-1, cameraCoord)
    swarm.viewController.zoom(-1, cameraCoord)
    swarm.viewController.zoom(-1, cameraCoord)
    swarm.viewController.zoom(-1, cameraCoord)
    swarm.viewController.zoom(-1, cameraCoord)
    swarm.viewController.zoom(-1, cameraCoord)
    swarm.viewController.zoom(-1, cameraCoord)
    swarm.viewController.zoom(-1, cameraCoord)
    swarm.viewController.zoom(-1, cameraCoord)

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

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}
