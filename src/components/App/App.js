import React, {Component} from 'react'
import Simulation from '../Simulation/Simulation'
import SimulationControl from '../SimulationControl/SimulationControl'

import './App.less'

export default class App extends Component {
    render() {
        const {width, height, devicePixelRatio, simulation} = this.props
        const simulationProps = {
            width,
            height,
            devicePixelRatio,
            simulation,
        }

        return (
            <div>
                <div className={'App-Layer'}>
                    <Simulation
                        {...simulationProps}
                        once={true}
                        layers={['environmentAttractors', 'emitters']}
                    />
                </div>
                <div className={'App-Layer'}>
                    <Simulation
                        {...simulationProps}
                        layers={['agents']}
                    />
                </div>
                <div className={'App-Layer'}>
                    <SimulationControl
                        {...simulationProps}
                        layers={['selectedAgent']}
                    />
                </div>
            </div>
        )
    }
}