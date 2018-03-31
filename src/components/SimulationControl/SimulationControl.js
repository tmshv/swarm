import React, {Component} from 'react'
import Render from '../../lib/Render'
import InteractEnvironmentBehaviour from '../../swarm/behaviours/InteractEnvironmentBehaviour'
import InteractAgentsBehaviour from '../../swarm/behaviours/InteractAgentsBehaviour'
import Canvas from '../Canvas/Canvas'

export default class SimulationControl extends Component {
    constructor(...args) {
        super(...args)

        this.onRef = this.onRef.bind(this)
        this.onClick = this.onClick.bind(this)
        this.onUpdate = this.onUpdate.bind(this)
    }

    onRef(canvas) {
        const {width, height} = this.props
        this.context = canvas.context
        this.draw = new Render(this.context, width, height)
    }

    onClick(event) {
        const x = event.clientX
        const y = event.clientY

        this.agent = this.sim.getNearestAgent(x, y)
    }

    onUpdate() {
        this.draw.clear()
        const ctx = this.context

        if (this.agent && this.agent.isAlive) {
            const agent = this.agent
            ctx.fillStyle = 'rgba(255, 0, 255, 1)'

            const s = 16
            this.draw.targetArea(agent.location, s, s, 3)

            this.agent.behaviours.forEach(x => this.drawBehaviour(ctx, x))
        }
    }

    drawBehaviour(ctx, behaviour) {
        ctx.strokeStyle = 'rgba(255, 0, 255, 1)'

        if (behaviour instanceof InteractEnvironmentBehaviour) {
            const a = behaviour.targetAttractor
            const interest = behaviour.interest.get(a)

            if (interest > 0) {
                this.draw.circleCenter(a.location, interest)
            }
        } else if (behaviour instanceof InteractAgentsBehaviour) {
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)'

            this.draw.circleCenter(this.agent.location, behaviour.radius)

            ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)'
            behaviour.agentsInView.forEach(agent => {
                const r = behaviour.interest.get(agent) / behaviour.initialInterest
                const s = r * 5
                this.draw.cross(agent.location, s)
            })
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
        return (
            <Canvas
                ref={this.onRef}
                onClick={this.onClick}
                {...this.props}
            />
        )
    }
}