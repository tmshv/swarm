import SimulationView from './SimulationView'
import Tag from '../Tag'
import ObstacleType from '../ObstacleType'

export default class ObstacleView extends SimulationView {
    render() {
        const ctx = this.draw.context

        const renderers = {
            [ObstacleType.BUILDING]: this.renderBuilding.bind(this),
            [ObstacleType.ROAD]: this.renderRoad.bind(this),
            [ObstacleType.THING]: this.renderThing.bind(this),
        }
        // delete renderers[ObstacleType.ROAD]

        this.simulation.environment.obstacles
            .filter(obstacle => renderers.hasOwnProperty(obstacle.getTag(Tag.TYPE)))
            .forEach(obstacle => {
                const type = obstacle.getTag(Tag.TYPE)
                renderers[type](ctx, obstacle)
            })
    }

    renderBuilding(ctx, obstacle) {
        const alpha = 1
        ctx.strokeStyle = `rgba(200, 200, 200, ${alpha})`

        const coords = obstacle.lines.map(x => x.a)
        this.draw.path(coords)

        obstacle.lines.forEach(line => {
            this.draw.line(line)

            const c = line.getCentroid()
            const n = line
                .normal
                .clone()
                .mult(2)
            this.draw.vector(c, n)
        })
    }

    renderRoad(ctx, obstacle) {
        ctx.strokeStyle = `rgb(100, 100, 100)`

        const coords = obstacle.lines.map(x => x.a)
        this.draw.path(coords)
    }

    renderThing(ctx, obstacle) {
        ctx.strokeStyle = `rgb(100, 100, 100)`
        this.draw.circleCenter(obstacle.location, obstacle.radius)
        this.draw.cross(obstacle.location, 5)
    }
}