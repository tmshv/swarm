import { useState, useEffect } from 'react'
import { fetchProject, getLayers, createControls, getCameraCenter } from '../app/init'
import { initSimulation } from '../app'

export type SwarmController = {
    options: any
    project: any
    ui: any
    layers: any
    swarm: any
    simulation: any
    createControls: any
}

export function useSwarm(url: string) {
    const [controller, setController] = useState<SwarmController>(null)

    useEffect(() => {
        (async () => {
            const project = await fetchProject(url)
            const cameraCoord = getCameraCenter(project)
            const swarm = await initSimulation(project, { cameraCoord })
            const simulation = swarm.getSimulation()
            const layers = swarm.createLayout(getLayers())
            const ui = {
                onClick: () => {
                    if (simulation.isRunning) {
                        simulation.stop()
                    } else {
                        simulation.run()
                    }
                }
            }
            simulation.run()

            setController({
                options: project.options,
                project,
                ui,
                layers,
                swarm,
                simulation,
                createControls,
            })
        })()

        return () => {

        }
    }, [url])

    return controller
}
