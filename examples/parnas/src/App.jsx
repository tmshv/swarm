import { useSwarm } from '@tmshv/swarm-react'
import { SwarmViewport } from '@tmshv/swarm-react'
import { createControls, getLayers } from './init'

const App = () => {
    const controller = useSwarm("/parnas.js", null, getLayers, createControls)
    if (!controller) {
        return (
            <div>loading</div>
        )
    }

    return (
        <SwarmViewport
            backgroundColor={'rgb(100 100 110)'}
            // backgroundColor={'rgb(31 36 45)'}
            // backgroundColor={'white'}
            layers={controller.layers}
            swarm={controller.swarm}
        />
    )
}

export default App
