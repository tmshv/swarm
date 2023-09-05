import View from './View'

export default class SelectedObstacleView extends View {
    constructor({item, ...args}) {
        super({
            ...args,
            clear: true,
        })

        this.item = item
    }

    render() {
        const ctx = this.draw.context
        ctx.strokeStyle = `rgb(0, 0, 0)`
        ctx.lineWidth = 1

        this.item.lines.forEach(line => {
            this.draw.line(line)

            const c = line.getCentroid()
            const n = line
                .normal
                .clone()
                .mult(5)
            this.draw.vector(c, n)
        })

        ctx.fillStyle = `rgb(100, 100, 100)`
        this.draw.circleCenter(this.item.centroid, 1)
        ctx.fill()
    }
}