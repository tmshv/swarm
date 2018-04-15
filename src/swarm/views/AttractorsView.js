import EnvironmentView from './EnvironmentView'
import Vector from '../Vector'

const textOffset = new Vector(10, 5)

export default class AttractorsView extends EnvironmentView {
    render() {
        const ctx = this.draw.context

        this.environment.attractors.forEach(a => {
            this.renderEmitterAssociation(a)

            const location = a.location
            const agentsPoolSize = a.agents.length
            const alpha = agentsPoolSize
                ? 1
                : 0.3
            ctx.lineWidth = 2
            ctx.strokeStyle = `rgba(20, 20, 0, ${alpha})`

            const s = 5
            this.draw.cross(location, s, s)

            if (agentsPoolSize) {
                this.draw.text(location, `${agentsPoolSize}`, textOffset)
            }
        })
    }

    renderEmitterAssociation(attractor){
        const ctx = this.draw.context

        ctx.strokeStyle = `rgba(0, 0, 0, 0.1)`
        ctx.lineWidth = 1
        attractor.getAssociatedEmitters()
            .forEach(e => {
                this.draw.path([attractor.location, e.location])
            })
    }
}