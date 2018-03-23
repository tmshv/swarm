import React, {Component} from 'react'
import Simulation from '../Simulation/Simulation'

export default class App extends Component {
    render() {
        const {width, height, simulation} = this.props

        return (
            <div>
                <Simulation
                    width={width}
                    height={height}
                    simulation={simulation}
                />
            </div>
        )
    }
}