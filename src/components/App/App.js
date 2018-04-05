import React, {Component} from 'react'
import Simulation from '../Simulation/Simulation'
import SimulationControl from '../SimulationControl/SimulationControl'

import './App.less'

export default class App extends Component {
    constructor(...args) {
        super(...args)

        this.onClick = this.onClick.bind(this)
        this.onResize = this.onResize.bind(this)
    }

    componentDidMount() {
        window.addEventListener('resize', this.onResize)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onResize)
    }

    onResize() {
        this.forceUpdate()
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
        const {layers, simulation} = this.props

        const devicePixelRatio = window.devicePixelRatio
        const width = window.innerWidth
        const height = window.innerHeight

        return (
            <div className={'App'}>
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
                <div className={'App-Body'}>
                    <button onClick={this.onClick}>Click</button>
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