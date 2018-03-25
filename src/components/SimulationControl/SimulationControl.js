import React, {Component} from 'react'
import Render from '../../lib/Render'

export default class SimulationControl extends Component {
    constructor(...args) {
        super(...args)

        this.onRef = this.onRef.bind(this)
        this.onClick = this.onClick.bind(this)
        this.onUpdate = this.onUpdate.bind(this)
    }

    onRef(canvas) {
        const {width, height} = this.props
        this.context = canvas.getContext('2d')
        this.draw = new Render(this.context, width, height)
        // this.context.scale(1, 1)
    }

    onClick(event) {
        const x = event.clientX
        const y = event.clientY

        this.agent = this.sim.getNearestAgent(x, y)
    }

    onUpdate() {
        const {width, height} = this.props
        const ctx = this.context
        ctx.clearRect(0, 0, width, height);

        if (this.agent) {
            const agent = this.agent
            ctx.fillStyle = 'rgba(200, 0, 200, 1)'

            const s = 4
            this.draw.rectCenter(agent.location.x, agent.location.y, s, s)
        }

        this.drawEnv(ctx)
    }

    drawEnv(ctx) {
        this.sim.env.attractors.forEach(a => {
            ctx.strokeStyle = 'rgba(200, 0, 200, 1)'

            ctx.beginPath()
            ctx.arc(a.location.x, a.location.y, a.power, 0, 2 * Math.PI)
            ctx.stroke()
        })
    }

    componentDidMount() {
        const {simulation} = this.props
        this.sim = simulation
        // this.sim.events.run.on(this.onUpdate)
        this.sim.events.update.on(this.onUpdate)
    }

    componentWillUnmount() {
        this.sim.events.run.off(this.onUpdate)
        this.sim = null
    }

    render() {
        const {width, height} = this.props

        return (
            <canvas
                ref={this.onRef}
                width={width}
                height={height}
                onClick={this.onClick}
            />
        )
    }
}