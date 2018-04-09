import SeekNearestAttractorBehaviour from '../behaviours/SeekNearestAttractorBehaviour'
import InteractEnvironmentBehaviour from '../behaviours/InteractEnvironmentBehaviour'
import InteractAgentsBehaviour from '../behaviours/InteractAgentsBehaviour'
import AvoidObstaclesBehavior from '../behaviours/AvoidObstaclesBehavior'
import InteractPheromonesBehaviour from '../behaviours/InteractPheromonesBehaviour'
import ComposableBehavior from '../behaviours/ComposableBehavior'
import SeparateAgentsBehaviour from '../behaviours/SeparateAgentsBehaviour'
import View from './View'

export default class SelectedAgentView extends View {
    constructor({item, ...args}) {
        super({
            ...args,
            clear: true,
        })

        this.item = item
    }

    shouldRender(){
        return this.item.isAlive
    }

    render() {
        this.renderBehaviour(this.item, this.item.behaviour)
        this.renderAgent(this.item)
    }

    renderAgent(agent) {
        const s = 16
        this.draw.context.lineWidth = 1
        this.draw.context.strokeStyle = 'rgba(0, 0, 0, 1)'
        this.draw.targetArea(agent.location, s, s, 3)
    }

    renderBehaviour(agent, behaviour) {
        const ctx = this.draw.context
        ctx.lineWidth = 1
        ctx.strokeStyle = 'rgba(255, 0, 255, 1)'

        if (behaviour instanceof ComposableBehavior) {
            behaviour.behaviours.forEach(b => {
                this.renderBehaviour(agent, b)
            })
        } else if (behaviour instanceof InteractEnvironmentBehaviour) {
            const a = behaviour.targetAttractor
            const interest = behaviour.interest.get(a)

            if (interest > 0) {
                this.draw.circleCenter(a.location, interest)
            }
        } else {
            if (behaviour instanceof InteractAgentsBehaviour) {
                ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)'

                this.draw.circleCenter(agent.location, behaviour.radius)

                ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)'
                behaviour.agentsInView.forEach(agent => {
                    const r = behaviour.interest.get(agent) / behaviour.initialInterest
                    const s = r * 5
                    this.draw.cross(agent.location, s)
                })
            } else if (behaviour instanceof SeekNearestAttractorBehaviour) {
                const a = behaviour.targetAttractor
                if (!a) return
                ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)'
                this.draw.cross(a.location, 5)
            } else if (behaviour instanceof AvoidObstaclesBehavior) {
                ctx.strokeStyle = 'rgba(0, 0, 0, 1)'
                const p = behaviour.getPredictionVector()
                this.draw.vector(agent.location, p)

                const edge = behaviour.edge
                if (edge) {
                    ctx.strokeStyle = 'rgba(0, 255, 0, 1)'
                    const c = edge.getCentroid()
                    const n = edge.normal
                        .clone()
                        .setLength(25)

                    this.draw.line(edge)
                    this.draw.vector(c, n)

                    // ctx.strokeStyle = 'rgba(100, 100, 0, 1)'
                    // this.draw.path([this.agent.location, behaviour.pl])

                    // ctx.strokeStyle = 'rgba(255, 0, 255, 1)'
                }

                const reflection = behaviour.reflection
                if (reflection) {
                    const r = reflection.clone()
                        .normalize()
                        .mult(5)
                    ctx.strokeStyle = 'rgba(250, 0, 0, 1)'
                    this.draw.vector(agent.location, r)
                }
            } else if (behaviour instanceof InteractPheromonesBehaviour) {
                const s = 2
                ctx.strokeStyle = 'rgba(0, 255, 0, 1)'
                ctx.fillStyle = null

                behaviour.target.forEach(({location}) => {
                    this.draw.cross(location, s, s)
                })
            } else if (behaviour instanceof SeparateAgentsBehaviour) {
                ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)'
                ctx.fillStyle = null

                this.draw.circleCenter(agent.location, behaviour.radius)
            }
        }
    }
}