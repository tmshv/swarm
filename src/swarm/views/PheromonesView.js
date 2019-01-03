import EnvironmentView from './EnvironmentView'

export default class PheromonesView extends EnvironmentView {
    constructor({ pheromonesName, ...args }) {
        super(args)

        this.pheromonesName = pheromonesName
        const m = 1
        this.fill = alpha => `rgba(140, 160, 255, ${alpha * m})`

        if (pheromonesName === 'bus-stop') {
            this.fill = alpha => `rgba(150, 170, 255, ${alpha * m})`
        }

        if (pheromonesName === 'metro') {
            this.fill = alpha => `rgba(220, 220, 255, ${alpha * m})`
        }
    }

    render() {
        const ctx = this.draw.context
        const pheromones = this.simulation.environment.getPheromones(this.pheromonesName)
        const s = pheromones.cellSize
        const fillStyle = this.fill

        for (let pheromone of pheromones.getValuesIterator()) {
            const location = pheromone.location

            const alpha = pheromone.velocity.length * 0.5
            // const alpha = 1
            ctx.fillStyle = fillStyle(alpha)
            this.draw.rectCenterZoomed(location, s, s)
        }
    }

    renderPheromoneForce(ctx, pheromone) {
        const location = pheromone.location
        const predict = pheromone.velocity
            .clone()
            // .limit(50)
            .add(pheromone.location)

        ctx.strokeStyle = `rgb(0, 250, 50)`
        this.draw.path([location, predict])
    }
}