import { NextPage } from 'next'
import { useState, useEffect } from 'react'
import App from 'src/components/App/App'
import { init } from '../app/init'
import { initSimulation } from '../app'
import ToolType from '../swarm/ToolType'

function useSimulation(url: string) {
    const [controller, setController] = useState(null)

    useEffect(() => {
        (async () => {
            const project = await init(url)
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

            setController({
                project,
                ui,
                layers,
                settings,
                swarm,
                simulation,
            })

            // window.s = simulation.run()
            simulation.run()
        })()

        return () => {

        }
    }, [url])

    return controller
}

const Index: NextPage = () => {
    const controller = useSimulation('/PARNAS_SWARM.json')
    if (!controller) {
        return (
            <div>loading</div>
        )
    }

    return (
        <App
            backgroundColor={controller.settings.backgroundColor}
            layers={controller.layers}
            uiCallbacks={controller.ui}
            displayUiSignal={controller.swarm.tools.getToolUpdateSignal(ToolType.TOGGLE_UI)}
            swarm={controller.swarm}
            controlsLayout={controller.project.createControls()}
        />
    )
}

export default Index

