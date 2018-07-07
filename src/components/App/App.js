import React, {Component} from 'react'
import Simulation from '../Simulation/Simulation'
import SidePanel from '../SidePanel'

import './App.less'

export default class App extends Component {
    constructor(...args) {
        super(...args)

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

    render() {
        const {layers, uiCallbacks} = this.props

        const devicePixelRatio = window.devicePixelRatio
        const width = window.innerWidth
        const height = window.innerHeight

        return (
            <div className={'App'}>
                <div className={'App-Simulation'}>
                    {layers.map(({controlable, ...x}, i) => (
                        <Layer
                            key={i}
                            layerProps={{
                                width,
                                height,
                                devicePixelRatio,
                                ...x,
                            }}
                        />
                    ))}
                </div>
                <div className={'App-BodyWrapper'}>
                    <div className={'App-Body'}>
                        <SidePanel uiCallbacks={uiCallbacks}/>
                    </div>
                </div>
            </div>
        )
    }
}

const Layer = ({layerProps: simulationProps}) => (
    <div className={'App-Layer'}>
        <Simulation
            {...simulationProps}
        />
    </div>
)