import React, {Component} from 'react'
import Render from '../../lib/Render'
import Canvas from '../Canvas/Canvas'

export default class Simulation extends Component {
    constructor(...args) {
        super(...args)

        this.onRef = this.onRef.bind(this)
        this.onUpdate = this.onUpdate.bind(this)
    }

    onRef(canvas) {
        this.context = canvas.context
    }

    onUpdate() {
        this.view.run({})
    }

    componentDidMount() {
        const {width, height, simulation, layers, runOnce = false} = this.props
        this.sim = simulation
        if (runOnce) {
            this.sim.events.update.once(this.onUpdate)
        } else {
            this.sim.events.update.on(this.onUpdate)
        }

        this.view = this.sim.createView({
            draw: new Render(this.context, width, height),
            layers,
        })
    }

    componentWillUnmount() {
        this.sim.events.run.off(this.onUpdate)
        this.sim = null
        this.view = null
    }

    render() {
        const {width, height, devicePixelRatio} = this.props

        return (
            <Canvas
                ref={this.onRef}
                width={width}
                height={height}
                devicePixelRatio={devicePixelRatio}
            />
        )
    }
}