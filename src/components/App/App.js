import React, { Component } from 'react'
import className from 'classnames'
import Simulation from '../Simulation/Simulation'
import SidePanel from '../SidePanel'

import './App.less'

export default class App extends Component {
    constructor(...args) {
        super(...args)

        this.state = {
            showUi: false,
            layerList: this.props.layers
                .map(({ name, controlable }) => ({
                    name,
                    controlable,
                    checked: true,
                }))
        }

        this.onResize = this.onResize.bind(this)
        this.onLayerCheckedChange = this.onLayerCheckedChange.bind(this)
    }

    onToggleUi = () => {
        this.setState({
            showUi: !this.state.showUi,
        })
    }

    isLayerVisible(index) {
        return this.state.layerList[index].checked
    }

    componentDidMount() {
        window.addEventListener('resize', this.onResize)

        this.props.displayUiSignal.on(this.onToggleUi)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onResize)

        this.props.displayUiSignal.off(this.onToggleUi)
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

        const layerList = this.state.layerList.filter(({ controlable }) => controlable)

        return (
            <div className={'App'}>
                <div
                    className={'App-Simulation'}
                    style={{
                        backgroundColor: this.props.backgroundColor,
                    }}
                >
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
                    {!this.state.showUi ? null : (
                        <div className={'App-Body'}>
                            <SidePanel
                                uiCallbacks={uiCallbacks}
                                layers={layerList}
                                onLayerCheckedChange={this.onLayerCheckedChange}
                            />
                        </div>
                    )}
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