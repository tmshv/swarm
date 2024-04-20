import React, { Component } from 'react'

export default class SwarmControl extends Component {
    render() {
        const { uiCallbacks } = this.props

        return (
            <div>
                <button onClick={uiCallbacks.onClick}>Click</button>
            </div>
        )
    }
}
