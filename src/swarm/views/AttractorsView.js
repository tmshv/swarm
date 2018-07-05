import {max} from 'lodash'
import EnvironmentView from './EnvironmentView'
import Vector from '../Vector'
import Tag from '../Tag'
import AttractorType from '../AttractorType'

const unknownTextOffset = new Vector(10, 5)
const busStopOffset = new Vector(-5, 5)
const busStopTextOffset = new Vector(5, 5)

const radiusVector = new Vector(0, 0)

export default class AttractorsView extends EnvironmentView {
    render() {
        const ctx = this.draw.context
        const maxValue = this.getMaxAttractorValue()

        this.environment.attractors.forEach(a => {
            const type = a.getTag(Tag.TYPE)

            switch (type) {
                case AttractorType.BUS_STOP: {
                    return this.renderBusStation(ctx, a, maxValue)
                }

                case AttractorType.METRO_STATION: {
                    return this.renderMetroStation(ctx, a, maxValue)
                }

                default: {
                    return this.renderUnknown(ctx, a, maxValue)
                }
            }
        })
    }

    getMaxAttractorValue() {
        const maxValue = max(
            this.environment.attractors.map(a => a.getAgentsCount())
        )

        const M = 100
        return maxValue < M
            ? M
            : maxValue
    }

    renderMetroStation(ctx, a, maxAgentsCount) {
        const location = a.location
        const agentsCount = a.getAgentsCount()
        ctx.lineWidth = 2
        ctx.fillStyle = 'white'

        this.draw.text(location, `M`, busStopOffset)

        if (agentsCount) {
            const acRatio = Math.min(1, (agentsCount / maxAgentsCount))
            const radius = acRatio * 100

            ctx.lineWidth = 1
            ctx.strokeStyle = `rgb(250, 20, 20)`

            this.draw.circleCenterZoomed(location, radius)
            this.draw.text(location, `${agentsCount}`, busStopTextOffset)
        }
    }

    renderBusStation(ctx, a, maxAgentsCount) {
        const location = a.location
        const agentsCount = a.getAgentsCount()
        const alpha = agentsCount
            ? 1
            : 0.3
        ctx.lineWidth = 2
        ctx.fillStyle = `rgba(250, 20, 20, ${alpha})`

        const s = 5
        this.draw.text(location, `A`, busStopOffset)
        // this.draw.cross(location, s, s)

        if (agentsCount) {
            const acRatio = Math.min(1, (agentsCount / maxAgentsCount))
            const radius = acRatio * 100
            ctx.lineWidth = 1
            ctx.strokeStyle = `rgb(250, 20, 20)`
            this.draw.circleCenterZoomed(location, radius)

            // radiusVector.set(radius, 0)
            // radiusVector.setAngle(Math.PI * 0.25)
            // this.draw.vector(location, radiusVector)

            // ctx.fillStyle = `#000`
            this.draw.text(location, `${agentsCount}`, busStopTextOffset)
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