import ClearableView from './ClearableView'
import SeekNearestAttractorBehaviour from '../behaviours/SeekNearestAttractorBehaviour'
import InteractEnvironmentBehaviour from '../behaviours/InteractEnvironmentBehaviour'
import InteractAgentsBehaviour from '../behaviours/InteractAgentsBehaviour'

export default class SelectedAgentView extends ClearableView {
    constructor({...args}) {
        super({
            ...args,
            clear: true,
        })
    }

    run(options) {
        super.run(options)
        if (options.point) {
            const {x, y} = options.point
            this.agent = this.simulation.getNearestAgent(x, y)
        }
    }

    render() {
        const ctx = this.draw.context

        const agent = this.agent
        if (agent && agent.isAlive) {
            ctx.fillStyle = 'rgba(255, 0, 255, 1)'

            const s = 16
            this.draw.targetArea(agent.location, s, s, 3)

            agent.behaviours.forEach(x => this.drawBehaviour(ctx, x))
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
        } else if (behaviour instanceof SeekNearestAttractorBehaviour) {
            const a = behaviour.targetAttractor
            if (!a) return
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)'
            this.draw.cross(a.location, 5)
        }
    }
}