import SimulationView from './SimulationView'

export default class ObstacleView extends SimulationView {
    render() {
        const ctx = this.draw.context

        const alpha = 1
        ctx.strokeStyle = `rgba(200, 200, 200, ${alpha})`
        ctx.fillStyle = `rgba(250, 250, 250, 1)`

        this.simulation.env.obstacles
            .forEach(obstacle => {
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
            })
    }
}