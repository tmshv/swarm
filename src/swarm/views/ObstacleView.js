import SimulationView from './SimulationView'

export default class ObstacleView extends SimulationView {
    render() {
        const ctx = this.draw.context

        // const b = Math.floor(Math.random() * 256)
        // ctx.fillStyle = `rgba(200, 0, ${b}, 1)`
        // this.draw.screenRect(0, 0, 50, 50)

        const alpha = 1
        ctx.strokeStyle = `rgba(200, 200, 200, ${alpha})`

        this.simulation.env.obstacles
            .forEach(obstacle => {
                obstacle.lines.forEach(line => {
                    this.draw.line(line)

                    const c = line.getCentroid()
                    const n = line
                        .normal
                        .clone()
                        .mult(2)
                    this.draw.vector(c, n)
                })
                // this.draw.plus(obstacle.centroid, 5)
            })
    }
}