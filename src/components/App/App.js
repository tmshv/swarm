import React, {Component} from 'react'
import Simulation from '../Simulation/Simulation'
import SimulationControl from '../SimulationControl/SimulationControl'

import './App.less'

export default class App extends Component {
    render() {
        const {width, height, simulation} = this.props

        return (
            <div>
                <div className={'App-Layer'}>
                    <Simulation
                        width={width}
                        height={height}
                        simulation={simulation}
                    />
                </div>
                <div className={'App-Layer'}>
                    <SimulationControl
                        width={width}
                        height={height}
                        simulation={simulation}
                    />
                </div>
            </div>
        )
    }
}