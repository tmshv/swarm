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
            ctx.fillStyle = 'rgba(255, 0, 255, 1)'

            const s = 4
            this.draw.rectCenter(agent.location.x, agent.location.y, s, s)

            ctx.strokeStyle = 'rgba(255, 0, 255, 1)'
            const a = this.agent.targetAttractor
            this.draw.circleCenter(a.location.x, a.location.y, this.agent.interest.get(a))
        }

        this.drawEnv(ctx)
        this.drawEmitters(ctx)
    }

    drawEnv(ctx) {
        this.sim.env.attractors.forEach(a => {
            ctx.strokeStyle = 'rgba(200, 0, 200, 0.25)'

            this.draw.circleCenter(a.location.x, a.location.y, a.power)
        })
    }

    drawEmitters(ctx) {
        this.sim.emitters.forEach(e => {
            ctx.strokeStyle = 'rgba(0, 200, 0, 1)'
            ctx.fillStyle = 'rgba(0, 200, 0, 1)'

            this.draw.circleCenter(e.location.x, e.location.y, 3)
            // ctx.fill()
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