import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import './styles.less'

export default class Checkbox extends PureComponent {
    static propTypes = {
        checked: PropTypes.bool.isRequired,
        onChange: PropTypes.func.isRequired,
    }

    render() {
        return (
            <input type={'checkbox'} onChange={this.props.onChange} checked={this.props.checked}/>
        )
    }
}
