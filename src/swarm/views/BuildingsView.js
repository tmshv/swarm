import SimulationView from './SimulationView'

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
        ctx.fillStyle = `#9099a3`
        this.draw.path(polygon.coords, true)
    }
}
