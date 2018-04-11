import SimulationView from './SimulationView'
import Tag from '../Tag'
import ObstacleType from '../ObstacleType'

export default class ObstacleView extends SimulationView {
    render() {
        const ctx = this.draw.context

        this.simulation.environment.obstacles
            .forEach(obstacle => {
                const type = obstacle.getTag(Tag.TYPE)

                switch (type) {
                    case ObstacleType.BUILDING: {
                        return this.renderBuilding(ctx, obstacle)
                    }

                    case ObstacleType.ROAD: {
                        return this.renderRoad(ctx, obstacle)
                    }
                }
            })
    }

    renderBuilding(ctx, obstacle) {
        const alpha = 1
        ctx.strokeStyle = `rgba(200, 200, 200, ${alpha})`
        ctx.fillStyle = `rgba(250, 250, 250, 1)`

        const coords = obstacle.lines.map(x => x.a)
        this.draw.path(coords)
        ctx.fill()

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
}