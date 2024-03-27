import {
    ComposableBehavior,
    SeekNearestAttractorBehavior,
    AvoidObstaclesBehavior,
    InteractPheromonesBehavior,
    InteractAgentsBehavior,
    InteractEnvironmentBehavior,
    AvoidPointObstaclesBehavior,
    SeparateAgentsBehavior,
} from '@tmshv/swarm'
import View from './View'
import renderAvoidObstacleBehavior from './render/renderAvoidObstacleBehavior'

export default class SelectedAgentView extends View {
    constructor({ item, ...args }) {
        super({
            ...args,
            clear: true,
        })

        this.item = item
    }

    shouldRender() {
        return this.item.isAlive
    }

    render() {
        this.renderBehavior(this.item, this.item.behavior)
        this.renderAgent(this.item)
    }

    renderAgent(agent) {
        const location = agent.location

        const s = 30
        this.draw.context.lineWidth = 2
        // this.draw.context.strokeStyle = 'rgba(0, 0, 0, 1)'
        this.draw.context.strokeStyle = 'white'
        this.draw.targetArea(location, s, s, 6)

        this.draw.context.strokeStyle = '#fff'
        agent._stepForces.forEach(f => {
            this.draw.vector(location, f)
        })

        // this.draw.context.strokeStyle = 'rgba(250, 250, 0, 1)'
        // this.draw.vector(location, agent._stepAcceleration)

        // this.draw.context.lineWidth = 3
        // this.draw.vector(location, agent
        //     .velocity
        //     .clone()
        //     .setLength(5)
        // )

        this.draw.context.fillStyle = '#fff'
        this.draw.circleCenterFill(location, 2)
    }

    renderBehavior(agent, behavior) {
        const location = agent.location
        const ctx = this.draw.context
        ctx.lineWidth = 1
        ctx.strokeStyle = 'rgba(255, 0, 255, 1)'

        if (behavior instanceof ComposableBehavior) {
            behavior.behaviors.forEach(b => {
                this.renderBehavior(agent, b)
            })
        } else if (behavior instanceof InteractEnvironmentBehavior) {
            // const a = behavior.targetAttractor
            // const interest = behavior.interest.get(a)
            //
            // if (interest > 0) {
            //     this.draw.circleCenter(a.location, interest)
            // }
        } else if (behavior instanceof InteractAgentsBehavior) {
            // ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)'
            //
            // this.draw.circleCenter(agent.location, behavior.radius)
            //
            // ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)'
            // behavior.agentsInView.forEach(agent => {
            //     const r = behavior.interest.get(agent) / behavior.initialInterest
            //     const s = r * 5
            //     this.draw.cross(agent.location, s)
            // })
        } else if (behavior instanceof SeekNearestAttractorBehavior) {
            // this.draw.circleCenter(a.location, behavior.radius)

            // const a = behavior.targetAttractor
            // if (!a) return
            // ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)'
            // this.draw.cross(a.location, 5)
        } else if (behavior instanceof AvoidObstaclesBehavior) {
            renderAvoidObstacleBehavior(this.draw, agent, behavior)
        } else if (behavior instanceof InteractPheromonesBehavior) {
            // const s = 2
            // ctx.strokeStyle = 'rgba(0, 255, 0, 1)'
            // ctx.fillStyle = null
            //
            // behavior.target.forEach(({location}) => {
            //     this.draw.cross(location, s, s)
            // })
        } else if (behavior instanceof SeparateAgentsBehavior) {
            // ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)'
            // ctx.fillStyle = null
            //
            // this.draw.circleCenter(agent.location, behavior.radius)
        } else if (behavior instanceof AvoidPointObstaclesBehavior) {
            // const p = behavior
            //     .getPredictionVector()
            //     .setLength(100)
            // this.draw.vector(agent.location, p)

            const obstacle = behavior.obstacle
            if (obstacle) {
                if (obstacle.containCoord(agent.location)) {
                    ctx.strokeStyle = 'rgba(250, 0, 250, 1)'
                    this.draw.cross(agent.location, 5)
                }

                const offsetRadius = obstacle.radius + behavior.predictionDistance

                ctx.strokeStyle = null
                ctx.fillStyle = 'rgba(250, 0, 250, 0.1)'
                this.draw.circleCenter(obstacle.location, offsetRadius)
            }
        }
    }
}
