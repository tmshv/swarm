import React, {Component} from 'react'
import Simulation from '../Simulation/Simulation'
import SimulationControl from '../SimulationControl/SimulationControl'

import './App.less'

export default class App extends Component {
    render() {
        const {layers, width, height, devicePixelRatio, simulation} = this.props

        return (
            <div>
                {layers.map(({controlable, ...x}, i) => (
                    <Layer
                        key={i}
                        controlable={controlable}
                        simulationProps={{
                            width,
                            height,
                            devicePixelRatio,
                            simulation,
                            ...x,
                        }}
                    />
                ))}
            </div>
        )
    }
}

const Layer = ({controlable, simulationProps}) => (
    <div className={'App-Layer'}>
        {controlable ? (
            <SimulationControl
                {...simulationProps}
            />
        ) : (
            <Simulation
                {...simulationProps}
            />
        )}
    </div>
)