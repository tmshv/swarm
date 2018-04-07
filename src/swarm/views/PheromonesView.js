import EnvironmentView from './EnvironmentView'

export default class PheromonesView extends EnvironmentView {
    constructor({maxValue, ...args}) {
        super(args)

        this.maxValue = maxValue
    }

    render() {
        const ctx = this.draw.context
        const ph = this.simulation.env.pheromones
        const itemsIter = ph.getValuesIterator()
        const m = this.maxValue
            ? this.maxValue
            : ph.getMaxValue()

        for (let pheromone of itemsIter) {
            const alpha = pheromone.power / m

            const style = `rgba(0, 250, 50, ${alpha})`
            ctx.strokeStyle = style
            ctx.fillStyle = style

            const s = ph.cellSize
            this.draw.rectCenter(pheromone.location, s, s)
        }
    }
}