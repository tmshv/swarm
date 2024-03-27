import EnvironmentView from './EnvironmentView'

export default class PheromonesView extends EnvironmentView {
    constructor({
        pheromonesName,
        pheromoneVelocityMultiplier,
        fill,
        ...args
    }) {
        super(args)

        this.pheromonesName = pheromonesName
        this.pheromoneVelocityMultiplier = pheromoneVelocityMultiplier
        this.fill = fill
    }

    render() {
        const ctx = this.draw.context
        const pheromones = this.simulation.environment.getPheromones(this.pheromonesName)
        const s = pheromones.cellSize
        const fillStyle = this.fill

        for (let pheromone of pheromones.getValuesIterator()) {
            const location = pheromone.location
            const alpha = pheromone.velocity.length * this.pheromoneVelocityMultiplier

            ctx.fillStyle = fillStyle(alpha)
            this.draw.rectCenterZoomed(location, s, s)
        }
    }

    renderPheromoneForce(ctx, pheromone) {
        const location = pheromone.location
        const predict = pheromone.velocity
            .clone()
            .add(pheromone.location)

        ctx.strokeStyle = `rgb(0, 250, 50)`
        this.draw.path([location, predict])
    }
}