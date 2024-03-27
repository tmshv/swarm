import { useSwarm } from '@tmshv/swarm-react'
import { SwarmViewport } from '@tmshv/swarm-react'

const App = () => {
    const controller = useSwarm("/mega.js", [
        0.5303213506452932,
        0,
        0,
        -0.5303213506452932,
        -1877.674241015046,
        1700.8069588689884,
    ])

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
