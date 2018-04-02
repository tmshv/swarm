import ClearableView from './ClearableView'

export default class ObstacleView extends ClearableView {
    render() {
        const ctx = this.draw.context
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