import React, {Component} from 'react'
import Simulation from '../Simulation/Simulation'
import SimulationControl from '../SimulationControl/SimulationControl'

import './App.less'

export default class App extends Component {
    constructor(...args) {
        super(...args)

        this.onClick = this.onClick.bind(this)
    }

    onClick() {
        const {simulation} = this.props
        if (simulation.isRunning) {
            simulation.stop()
        } else {
            simulation.run()
        }
    }

    render() {
        const {layers, width, height, devicePixelRatio, simulation} = this.props

        return (
            <div className={'App'}>
                <button onClick={this.onClick}>Click</button>

                <div className={'App-Simulation'}>
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