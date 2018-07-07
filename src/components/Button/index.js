import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import './styles.less'

export default class Button extends PureComponent {
    static propTypes = {
        onClick: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props)

        this.state = {
            mouseDown: false,
        }

        this.onMouseDown = this.onMouseDown.bind(this)
        this.onMouseUp = this.onMouseUp.bind(this)
    }

    onMouseDown() {
        this.setState({
            mouseDown: true,
        })
    }

    onMouseUp() {
        this.setState({
            mouseDown: false,
        })
    }

    componentDidMount() {
        window.addEventListener('mousedown', this.onMouseDown)
        window.addEventListener('mouseup', this.onMouseUp)
    }

    componentWillUnmount() {
        window.removeEventListener('mousedown', this.onMouseDown)
        window.removeEventListener('mouseup', this.onMouseUp)
    }

    render() {
        const f = this.state.mouseDown
            ? 'Button--focus-mouse'
            : 'Button--focus-keyboard'

        return (
            <button className={`Button ${f}`} onClick={this.props.onClick}>{this.props.children}</button>
        )
    }
}
