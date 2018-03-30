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
        const {width, height} = this.props
        this.context = canvas.context
        this.draw = new Render(this.context, width, height)
    }

    onUpdate() {
        const ctx = this.context
        // ctx.fillRect(0, 0, example.width, example.height);
        const {width, height} = this.props

        // ctx.fillStyle = '#AF5200';
        // ctx.fillStyle = 'rgba(200, 0, 0, 0.01)'
        // ctx.fillStyle = 'rgba(200, 0, 0, 0.15)'
        // ctx.fillStyle = 'rgba(200, 0, 0, 1)'
        ctx.clearRect(0, 0, width, height);

        const s = 3

        this.sim
            .getAgents()
            .forEach(agent => {

                let alpha = agent.ttl / 1000
                // let alpha = 1
                // alpha *= .1
                ctx.fillStyle = `rgba(200, 0, 0, ${alpha})`

                this.draw.rectCenter(agent.location, s, s)
            })
    }

    componentDidMount() {
        const {simulation} = this.props
        this.sim = simulation
        this.sim.events.update.on(this.onUpdate)
    }

    componentWillUnmount() {
        this.sim.events.run.off(this.onUpdate)
        this.sim = null
    }

    render() {
        return (
            <Canvas ref={this.onRef} {...this.props}/>
        )
    }
}