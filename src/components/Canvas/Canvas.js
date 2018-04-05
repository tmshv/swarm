import React, {Component} from 'react'

export default class Canvas extends Component {
    constructor(...args) {
        super(...args)

        this.onRef = this.onRef.bind(this)
    }

    onRef(canvas) {
        const {devicePixelRatio} = this.props

        this.context = canvas.getContext('2d')
        this.context.scale(devicePixelRatio, devicePixelRatio)
    }

    componentWillUnmount() {
        this.context = null
    }

    render() {
        const {width, height, devicePixelRatio, ...props} = this.props

        const w = width * devicePixelRatio
        const h = height * devicePixelRatio

        return (
            <canvas
                ref={this.onRef}
                width={w}
                height={h}
                {...props}
            />
        )
    }
}