import React, { Component } from 'react'
import className from 'classnames'
import { Simulation } from '../Simulation'
import SidePanel from '../SidePanel'
import Dat from '../Dat'

import s from './styles.module.css'

export default class App extends Component {
    constructor(props) {
        super(props)

        const variables = props.controlsLayout.reduce((acc, x) => {
            return {
                ...acc,
                [x.field]: x.defaultValue,
            }
        }, {})

        this.state = {
            layerList: this.props.layers
                .map(({ name, controlable }) => ({
                    name,
                    controlable,
                    checked: true,
                })),
            variables,
        }

        this.onResize = this.onResize.bind(this)
        this.onLayerCheckedChange = this.onLayerCheckedChange.bind(this)
    }

    onChangeVariables = variables => {
        this.props.swarm.setVariables(variables)

        this.setState({ variables })
    }

    isLayerVisible(index) {
        return this.state.layerList[index].checked
    }

    componentDidMount() {
        window.addEventListener('resize', this.onResize)

        this.props.swarm.setVariables(this.state.variables)
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
        const { layers, uiCallbacks, view } = this.props

        // onChange: (i, checked) => {
        //     console.log(i, checked)
        // },

        const devicePixelRatio = window.devicePixelRatio
        const width = window.innerWidth
        const height = window.innerHeight

        const layerList = this.state.layerList.filter(({ controlable }) => controlable)

        return (
            <>
                <div
                    className={s.appSimulation}
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
                <div className={s.appBodyWrapper}>
                    {!this.props.showUi ? null : (
                        <div className={s.appBody}>
                            <SidePanel
                                uiCallbacks={uiCallbacks}
                                layers={layerList}
                                onLayerCheckedChange={this.onLayerCheckedChange}
                            />
                        </div>
                    )}
                </div>

                <Dat
                    layout={this.props.controlsLayout}
                    data={this.state.variables}
                    onChange={this.onChangeVariables}
                />
            </>
        )
    }
}

const Layer = ({ layerProps: simulationProps, visible }) => (
    <div className={className(s.appLayer, {
        [s.appLayerVisible]: visible,
    })}>
        <Simulation
            {...simulationProps}
        />
    </div>
)