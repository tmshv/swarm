// @ts-nocheck

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from '../Button'
import LayerList from '../LayerList'

// import s from './styles.module.css'
// TODO fix this style
const s = {}

export default class SidePanel extends Component {
    static propTypes = {
        uiCallbacks: PropTypes.object.isRequired,
        layers: PropTypes.array,
        onLayerCheckedChange: PropTypes.func,
    }

    render() {
        const props = this.props as any
        return (
            <div className={s.sidePanel}>
                <Row>
                    <Button onClick={props.uiCallbacks.onClick}>RUN/STOP</Button>
                </Row>

                <Row>
                    <LayerList
                        items={props.layers}
                        onChange={props.onLayerCheckedChange}
                    />
                </Row>

                <Row>
                    <h3>Help</h3>

                    <ul>
                        <li>space NAVIGATE</li>
                        <li>backspace DELETE</li>
                        <li>v SELECT_AGENT</li>
                        <li>o SELECT_OBSTACLE</li>
                        <li>e SELECT_EMITTER</li>
                        <li>a SELECT_ATTRACTOR</li>
                        <li>r SIMULATION_CONTROL_SWITCH</li>
                        <li>s SIMULATION_CONTROL_STEP</li>
                        <li>m MOVE</li>
                        <li>h RESET_VIEW</li>
                        <li>ctrl+l CONSOLE_DEBUG_EXPORT</li>
                        <li>ctrl+p ToolType.CONSOLE_EXPORT</li>
                        <li>ctrl+a ADD_ATTRACTOR</li>
                        <li>ctrl+b TOGGLE_UI</li>
                    </ul>
                </Row>
            </div>
        )
    }
}

function Row({ children }) {
    const style = {
        marginBottom: '10px',
    }

    return (
        <div style={style}>{children}</div>
    )
}
