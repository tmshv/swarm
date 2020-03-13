import { NextPage } from 'next'
import App from 'src/components/App/App'
import { useSwarm } from 'src/hooks/useSwarm'
import ToolType from '../swarm/ToolType'

const Index: NextPage = () => {
    const controller = useSwarm('/PARNAS_SWARM.json')
    if (!controller) {
        return (
            <div>loading</div>
        )
    }

    return (
        <App
            backgroundColor={controller.options.backgroundColor}
            layers={controller.layers}
            uiCallbacks={controller.ui}
            displayUiSignal={controller.swarm.tools.getToolUpdateSignal(ToolType.TOGGLE_UI)}
            swarm={controller.swarm}
            controlsLayout={controller.createControls()}
        />
    )
}

export default Index

