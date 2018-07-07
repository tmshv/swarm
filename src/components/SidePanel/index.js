import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from '../Button'
import LayerList from '../LayerList'

import './styles.less'

export default class SidePanel extends Component {
    static propTypes = {
        uiCallbacks: PropTypes.object.isRequired,
        layers: PropTypes.array,
        onLayerCheckedChange: PropTypes.func,
    }

    render() {
        return (
            <div className={'SidePanel'}>
                <Row>
                    <Button onClick={this.props.uiCallbacks.onClick}>RUN/STOP</Button>
                </Row>

                <Row>
                    <LayerList
                        items={this.props.layers}
                        onChange={this.props.onLayerCheckedChange}
                    />
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
