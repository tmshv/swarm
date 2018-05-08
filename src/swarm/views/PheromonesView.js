import EnvironmentView from './EnvironmentView'

export default class PheromonesView extends EnvironmentView {
    constructor({...args}) {
        super(args)
    }

    render() {
        const ctx = this.draw.context
        const pheromones = this.simulation.environment.pheromones
        const s = pheromones.cellSize

        for (let pheromone of pheromones.getValuesIterator()) {
            const location = pheromone.location

            const alpha = pheromone.velocity.length * 0.01
            ctx.fillStyle = `rgba(0, 250, 50, ${alpha})`
            this.draw.rectCenter(location, s, s)
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