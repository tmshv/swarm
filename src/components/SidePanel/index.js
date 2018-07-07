import React, {Component} from 'react'
import PropTypes from 'prop-types'

import './styles.less'

export default class SidePanel extends Component {
    static propTypes = {
        uiCallbacks: PropTypes.object.isRequired,
    }

    constructor(...args) {
        super(...args)
    }

    render() {
        return (
            <div className={'SidePanel'}>
                <button onClick={this.props.uiCallbacks.onClick}>Click</button>
            </div>
        )
    }
}
