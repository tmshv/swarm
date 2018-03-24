import React, {Component} from 'react'

export default class SimulationControl extends Component {
    constructor(...args) {
        super(...args)

        this.onRef = this.onRef.bind(this)
        this.onClick = this.onClick.bind(this)
        this.onUpdate = this.onUpdate.bind(this)
    }

    onRef(canvas) {
        this.context = canvas.getContext('2d')
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
            const s2 = s / 2

            ctx.fillRect(agent.location.x - s2, agent.location.y - s2, s, s)
        }
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