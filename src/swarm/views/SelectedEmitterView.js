import ClearableView from './ClearableView'
import {findNearestInLocation} from '../lib/utils'

export default class SelectedEmitterView extends ClearableView {
    constructor({radius, ...args}) {
        super({
            ...args,
            clear: true,
        })

        this.radius = radius
    }

    select(coord) {
        const item = findNearestInLocation(this.simulation.emitters, coord, this.radius)
        // const item = this.simulation.emitters[0]

        console.log('e', item, this.radius)

        if (!item) return false

        this.emitter = item

        return true
    }

    render() {
        const ctx = this.draw.context

        ctx.strokeStyle = 'rgba(0, 255, 0, 1)'

        const angle = - (this.emitter.counter / this.emitter.period) * Math.PI * 2
        const radius = 25
        const location = this.emitter.location

        this.draw.targetArea(location, 16, 16, 2)
        this.draw.arcCenter(location, radius, 0, angle)
    }
}