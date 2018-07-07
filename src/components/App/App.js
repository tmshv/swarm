import React, { Component } from 'react'
import className from 'classnames'
import Simulation from '../Simulation/Simulation'
import SidePanel from '../SidePanel'

import './App.less'

export default class App extends Component {
    constructor(...args) {
        super(...args)
        
        this.state = {
            layerList: [
                {
                    name: 'BUILDINGS',
                    checked: true,
                },
                {
                    name: 'OBSTACLES',
                    checked: true,
                },
                {
                    name: 'PHEROMONES',
                    checked: true,
                },
                {
                    name: 'EMITTERS',
                    checked: true,
                },
                {
                    name: 'ATTRACTORS',
                    checked: true,
                },
                {
                    name: 'AGENTS',
                    checked: true,
                },
            ]
        }

        this.onResize = this.onResize.bind(this)
        this.onLayerCheckedChange = this.onLayerCheckedChange.bind(this)
    }

    isLayerVisible(index){
        if(index === 6) return true

        return this.state.layerList[index].checked
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

    onLayerCheckedChange(index, newValue) {
        this.setState({
            layerList: this.state.layerList.map((x, i) => index !== i ? x : ({
                ...x,
                checked: newValue,
            }))
        })
    }

    render() {
        const { layers, uiCallbacks } = this.props

        // onChange: (i, checked) => {
        //     console.log(i, checked)
        // },

        const devicePixelRatio = window.devicePixelRatio
        const width = window.innerWidth
        const height = window.innerHeight

        return (
            <div className={'App'}>
                <div className={'App-Simulation'}>
                    {layers.map((x, i) => (
                        <Layer
                            key={i}
                            visible={this.isLayerVisible(i)}
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
                        <SidePanel
                            uiCallbacks={uiCallbacks}
                            layers={this.state.layerList}
                            onLayerCheckedChange={this.onLayerCheckedChange}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

const Layer = ({ layerProps: simulationProps, visible }) => (
    <div className={className('App-Layer', {
        'App-Layer--visible': visible,
    })}>
        <Simulation
            {...simulationProps}
        />
    </div>
)