const TWO_PI = 2 * Math.PI

export default class Render {
    constructor(context, width, height) {
        this.context = context
        this.width = width
        this.height = height
    }

    circleCenter(x, y, radius) {
        this.context.beginPath()
        this.context.arc(x, y, radius, 0, TWO_PI)
        this.context.stroke()
    }

    rectCenter(x, y, w, h) {
        const w2 = w / 2
        const h2 = h / 2

        this.context.fillRect(x - w2, y - h2, w, h)
    }
}