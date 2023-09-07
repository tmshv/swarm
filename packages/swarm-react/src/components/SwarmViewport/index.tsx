import s from './viewport.module.css'
// TODO fix this import
// const s: any = {}

import React from 'react'

import cx from 'clsx'
import { Simulation } from '../Simulation'
import { useEffect, useState } from 'react'
import { usePrevent } from '@/hooks/usePrevent'

function useWindowDimensions() {
    const devicePixelRatio = window.devicePixelRatio
    const width = window.innerWidth
    const height = window.innerHeight

    return {
        width,
        height,
        devicePixelRatio,
    }
}

function useUpdateOnResize() {
    const [update, setUpdate] = useState(0)

    useEffect(() => {
        const onResize = () => {
            setUpdate(Math.random())
        }

        window.addEventListener('resize', onResize)

        return () => {
            window.removeEventListener('resize', onResize)
        }
    }, [])

    return update
}

type SwarmViewportProps = {
    backgroundColor: string
    layers: any[]
    swarm: any
}

export const SwarmViewport: React.FC<SwarmViewportProps> = props => {
    // usePrevent(window, 'mousewheel')
    // constructor(props) {
    //     super(props)

    //     this.state = {
    //         layerList: this.props.layers
    //             .map(({ name, controlable }) => ({
    //                 name,
    //                 controlable,
    //                 checked: true,
    //             })),
    //         variables,
    //     }

    //     this.onResize = this.onResize.bind(this)
    //     this.onLayerCheckedChange = this.onLayerCheckedChange.bind(this)
    // }

    // onChangeVariables = variables => {
    //     this.props.swarm.setVariables(variables)

    //     this.setState({ variables })
    // }

    // isLayerVisible(index) {
    //     return this.state.layerList[index].checked
    // }

    // componentDidMount() {
    //     this.props.swarm.setVariables(this.state.variables)
    // }


    // onLayerCheckedChange(index, newValue) {
    //     this.setState({
    //         layerList: this.state.layerList.map((x, i) => index !== i ? x : ({
    //             ...x,
    //             checked: newValue,
    //         }))
    //     })
    // }

    const { width, height, devicePixelRatio } = useWindowDimensions()
    const resized = useUpdateOnResize()

    useEffect(() => {
        //     const variables = props.controlsLayout.reduce((acc, x) => {
        //         return {
        //             ...acc,
        //             [x.field]: x.defaultValue,
        //         }
        //     }, {})

        // props.swarm.setVariables(this.state.variables)
    }, [])

    return (
        <div
            className={s.appSimulation}
            style={{
                backgroundColor: props.backgroundColor,
            }}
        >
            {props.layers.map((x, i) => (
                <Layer
                    key={i}
                    visible={true}
                    // visible={this.isLayerVisible(i)}
                    layerProps={{
                        width,
                        height,
                        devicePixelRatio,
                        ...x,
                    }}
                />
            ))}
        </div>
    )
}

type LayerProps = {
    visible: boolean
    layerProps: any
}

const Layer: React.FC<LayerProps> = ({ layerProps: simulationProps, visible }) => (
    <div className={cx(s.appLayer, {
        [s.appLayerVisible]: visible,
    })}>
        <Simulation
            {...simulationProps}
        />
    </div>
)
