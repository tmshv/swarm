import React, {PureComponent} from 'react'
import { Canvas } from '../Canvas'

export default class Simulation extends PureComponent {
    constructor(...args) {
        super(...args)

        this.onRef = this.onRef.bind(this)
    }

    onRef(ref) {
        this.canvas = ref
    }

    initView({width, height, view}) {
        this.view = view.init({
            width,
            height,
            canvas: this.canvas,
        })
    }

    componentDidMount() {
        this.initView(this.props)
    }

    componentWillReceiveProps(newProps) {
        this.initView(newProps)
    }

    componentWillUnmount() {
        this.view.destroy()

        this.canvas = null
        this.view = null
    }

    render() {
        const {width, height, devicePixelRatio} = this.props
        const {onClick, onMouseMove, onMouseDown, onMouseUp, onMouseWheel} = this.props

        return (
            <Canvas
                ref={this.onRef}
                width={width}
                height={height}
                devicePixelRatio={devicePixelRatio}

                onClick={onClick}
                onMouseMove={onMouseMove}
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                onWheel={onMouseWheel}
            />
        )
    }
}