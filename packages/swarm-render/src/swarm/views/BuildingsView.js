import SimulationView from './SimulationView'

export default class BuildingsView extends SimulationView {
    constructor({
        fill,
        ...args
    }) {
        super(args)

        this.fill = fill
    }

    render() {
        const ctx = this.draw.context
        const layer = this.simulation.layer('houses')

        for (const house of layer.data) {
            this.renderHouse(ctx, house)
        }
    }

    renderHouse(ctx, polygon) {
        ctx.strokeStyle = null
        ctx.fillStyle = this.fill(polygon)
        this.draw.path(polygon.coords, true)
    }
}
