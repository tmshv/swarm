import SimulationView from './SimulationView'
import Tag from '../Tag'
import ObstacleType from '../ObstacleType'
import Polygon from '../Polygon'

export default class BuildingsView extends SimulationView {
    render() {
        const ctx = this.draw.context
        const layer = this.simulation.layer('houses')

        for (const house of layer.data) {
            this.renderHouse(ctx, house)
        }
    }

    renderHouse(ctx, polygon) {
        ctx.strokeStyle = null
        ctx.fillStyle = `#9a9a9a`
        this.draw.path(polygon.coords, true)
    }
}
