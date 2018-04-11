import SeekNearestAttractorBehaviour from '../behaviours/SeekNearestAttractorBehaviour'
import InteractEnvironmentBehaviour from '../behaviours/InteractEnvironmentBehaviour'
import InteractAgentsBehaviour from '../behaviours/InteractAgentsBehaviour'
import AvoidObstaclesBehavior from '../behaviours/AvoidObstaclesBehavior'
import InteractPheromonesBehaviour from '../behaviours/InteractPheromonesBehaviour'
import ComposableBehavior from '../behaviours/ComposableBehavior'
import SeparateAgentsBehaviour from '../behaviours/SeparateAgentsBehaviour'
import View from './View'
import Unit4AgentBehaviour from '../behaviours/Unit4AgentBehaviour'
import AvoidPointObstaclesBehavior from '../behaviours/AvoidPointObstaclesBehavior'

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
        const location = agent.location

        const s = 16
        this.draw.context.lineWidth = 1
        this.draw.context.strokeStyle = 'rgba(0, 0, 0, 1)'
        this.draw.targetArea(location, s, s, 3)

        this.draw.context.strokeStyle = 'rgba(0, 0, 0, .5)'
        agent._stepForces.forEach(f => {
            this.draw.vector(location, f)
        })

        this.draw.context.strokeStyle = 'rgba(250, 250, 0, 1)'
        this.draw.vector(location, agent._stepAcceleration)

        // this.draw.context.lineWidth = 3
        // this.draw.vector(location, agent
        //     .velocity
        //     .clone()
        //     .setLength(5)
        // )
    }

    renderBehaviour(agent, behaviour) {
        const location = agent.location
        const ctx = this.draw.context
        ctx.lineWidth = 1
        ctx.strokeStyle = 'rgba(255, 0, 255, 1)'

        if (behaviour instanceof ComposableBehavior) {
            behaviour.behaviours.forEach(b => {
                this.renderBehaviour(agent, b)
            })
        } else if (behaviour instanceof InteractEnvironmentBehaviour) {
            // const a = behaviour.targetAttractor
            // const interest = behaviour.interest.get(a)
            //
            // if (interest > 0) {
            //     this.draw.circleCenter(a.location, interest)
            // }
        } else if (behaviour instanceof InteractAgentsBehaviour) {
            // ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)'
            //
            // this.draw.circleCenter(agent.location, behaviour.radius)
            //
            // ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)'
            // behaviour.agentsInView.forEach(agent => {
            //     const r = behaviour.interest.get(agent) / behaviour.initialInterest
            //     const s = r * 5
            //     this.draw.cross(agent.location, s)
            // })
        } else if (behaviour instanceof SeekNearestAttractorBehaviour) {
            // const a = behaviour.targetAttractor
            // if (!a) return
            // ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)'
            // this.draw.cross(a.location, 5)
        } else if (behaviour instanceof AvoidObstaclesBehavior) {
            // ctx.strokeStyle = 'rgba(0, 50, 200, 0.25)'
            // const predictionVector = behaviour.getPredictionVector()
            // this.draw.vector(agent.location, predictionVector)

            const edge = behaviour.edge
            if (edge) {
                const offsetSize = behaviour.predictionDistance
                const offset = edge.offset(edge
                    .normal
                    .clone()
                    .setLength(offsetSize)
                )

                ctx.strokeStyle = null
                ctx.fillStyle = 'rgba(250, 0, 250, 0.1)'
                this.draw.path([
                    edge.a, edge.b,
                    offset.b, offset.a,
                ], true)

                ctx.strokeStyle = 'rgba(200, 0, 200, 1)'
                // this.draw.vector(location, behaviour.getForce(edge))
                // this.draw.vector(location, behaviour.getNormalForce(edge))
            }

            ctx.strokeStyle = 'rgba(250, 0, 250, 1)'
            this.draw.circleCenter(agent.location, behaviour.radius)

            const impactForce = behaviour.impactForce
            if (impactForce) {
                const r = impactForce
                    .clone()
                    .setLength(40)
                ctx.strokeStyle = 'rgba(250, 0, 0, 1)'
                this.draw.vector(agent.location, r)
            }

            const intersection = behaviour.intersection
            if (intersection) {
                ctx.strokeStyle = null
                ctx.fillStyle = 'rgba(250, 0, 250, 1)'
                this.draw.circleCenter(intersection, 2)
                ctx.fill()
            }

            // const obstacle = behaviour.obstacle
            // if (obstacle) {
            //     ctx.strokeStyle = 'rgba(250, 0, 250, 0.5)'
            //     this.draw.line(obstacle.lines[0])
            // }
        } else if (behaviour instanceof InteractPheromonesBehaviour) {
            // const s = 2
            // ctx.strokeStyle = 'rgba(0, 255, 0, 1)'
            // ctx.fillStyle = null
            //
            // behaviour.target.forEach(({location}) => {
            //     this.draw.cross(location, s, s)
            // })
        } else if (behaviour instanceof SeparateAgentsBehaviour) {
            // ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)'
            // ctx.fillStyle = null
            //
            // this.draw.circleCenter(agent.location, behaviour.radius)
        } else if (behaviour instanceof Unit4AgentBehaviour) {
            // ctx.lineWidth = 1
            // ctx.strokeStyle = 'rgba(0, 0, 0, 1)'
            // ctx.fillStyle = null
            //
            // // this.draw.circleCenter(agent.location, behaviour.radius)
        } else if (behaviour instanceof AvoidPointObstaclesBehavior) {
            // const p = behaviour
            //     .getPredictionVector()
            //     .setLength(100)
            // this.draw.vector(agent.location, p)

            const obstacle = behaviour.obstacle
            if (obstacle) {
                if (obstacle.containCoord(agent.location)) {
                    ctx.strokeStyle ='rgba(250, 0, 250, 1)'
                    this.draw.cross(agent.location, 5)
                }

                const offsetRadius = obstacle.radius + behaviour.predictionDistance

                ctx.strokeStyle = null
                ctx.fillStyle = 'rgba(250, 0, 250, 0.1)'
                this.draw.circleCenter(obstacle.location, offsetRadius)
            }
        }
    }
}