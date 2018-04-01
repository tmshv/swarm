import ClearableView from './ClearableView'

export default class PheromonesView extends ClearableView {
    render() {
        const ctx = this.draw.context
        const ph = this.simulation.env.pheromones
        const items = ph.getValuesIterator()

        for (let {location, value} of items) {
            const alpha = value / 200

            const style = `rgba(0, 250, 50, ${alpha})`
            ctx.strokeStyle = style
            ctx.fillStyle = style

            const s = ph.cellSize
            this.draw.rect(location, s, s)
        }
    }
}