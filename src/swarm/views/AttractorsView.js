import EnvironmentView from './EnvironmentView'
import Vector from '../Vector'
import Tag from '../Tag'
import AttractorType from '../AttractorType'

const unknownTextOffset = new Vector(10, 5)
const busStopOffset = new Vector(-5, 5)
const busStopTextOffset = new Vector(10, 5)

export default class AttractorsView extends EnvironmentView {
    render() {
        const ctx = this.draw.context

        this.environment.attractors.forEach(a => {
            const type = a.getTag(Tag.TYPE)

            switch (type) {
                case AttractorType.BUS_STOP: {
                    return this.renderBusStation(ctx, a)
                }

                default: {
                    return this.renderUnknown(ctx, a)
                }
            }
        })
    }

    renderBusStation(ctx, a) {
        const location = a.location
        const agentsPoolSize = a.agents.length
        const alpha = agentsPoolSize
            ? 1
            : 0.3
        ctx.lineWidth = 2
        ctx.fillStyle = `rgba(250, 20, 20, ${alpha})`

        const s = 5
        this.draw.text(location, `A`, busStopOffset)
        // this.draw.cross(location, s, s)

        if (agentsPoolSize) {
            // ctx.fillStyle = `#000`
            this.draw.text(location, `${agentsPoolSize}`, busStopTextOffset)
        }
    }

    renderUnknown(ctx, a) {
        const location = a.location
        const agentsPoolSize = a.agents.length
        ctx.lineWidth = 1
        ctx.strokeStyle = `rgb(30, 30, 30)`

        const s = 5
        this.draw.cross(location, s, s)

        if (agentsPoolSize) {
            ctx.fillStyle = `rgb(30, 30, 30)`
            this.draw.text(location, `${agentsPoolSize}`, unknownTextOffset)
        }
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