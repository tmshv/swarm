import EnvironmentView from './EnvironmentView'

export default class PheromonesView extends EnvironmentView {
    constructor({ pheromonesName, ...args }) {
        super(args)

        this.pheromonesName = pheromonesName
        this.fill = alpha => `rgba(255, 255, 255, ${alpha})`

        if (pheromonesName === 'bus-stop') {
            this.fill = alpha => `rgba(250, 250, 0, ${alpha})`
        }

        if (pheromonesName === 'metro') {
            this.fill = alpha => `rgba(250, 0, 250, ${alpha})`
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