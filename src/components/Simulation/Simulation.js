import React, {Component} from 'react'
import Render from '../../lib/Render'

export default class Simulation extends Component {
    constructor(...args) {
        super(...args)

        this.onRef = this.onRef.bind(this)
        this.onUpdate = this.onUpdate.bind(this)
    }

    onRef(canvas) {
        const {width, height} = this.props
        this.context = canvas.getContext('2d')
        this.draw = new Render(this.context, width, height)
    }

    onUpdate() {
        const ctx = this.context
        // ctx.fillRect(0, 0, example.width, example.height);
        const {width, height} = this.props

        // ctx.fillStyle = '#AF5200';
        ctx.fillStyle = 'rgba(200, 0, 0, 0.01)'
        // ctx.fillStyle = 'rgba(200, 0, 0, 0.15)'
        // ctx.fillStyle = 'rgba(200, 0, 0, 1)'
        // ctx.clearRect(0, 0, width, height);

        const s = 2

        this.sim
            .getAgents()
            .forEach(agent => {
                this.draw.rectCenter(agent.location.x, agent.location.y, s, s)
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
        const {width, height} = this.props

        return (
            <canvas ref={this.onRef} width={width} height={height}/>
        )
    }
}