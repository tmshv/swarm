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

    targetArea(x, y, w, h, s) {
        const w2 = w / 2
        const h2 = h / 2

        this.context.beginPath()
        this.context.moveTo(x - w2, y - h2 + s)
        this.context.lineTo(x - w2, y - h2)
        this.context.lineTo(x - w2 + s, y - h2)
        this.context.stroke()

        this.context.beginPath()
        this.context.moveTo(x + w2, y - h2 + s)
        this.context.lineTo(x + w2, y - h2)
        this.context.lineTo(x + w2 - s, y - h2)
        this.context.stroke()

        this.context.beginPath()
        this.context.moveTo(x + w2, y + h2 - s)
        this.context.lineTo(x + w2, y + h2)
        this.context.lineTo(x + w2 - s, y + h2)
        this.context.stroke()

        this.context.beginPath()
        this.context.moveTo(x - w2, y + h2 - s)
        this.context.lineTo(x - w2, y + h2)
        this.context.lineTo(x - w2 + s, y + h2)
        this.context.stroke()
    }

    plus(x, y, s) {
        this.context.beginPath()
        this.context.moveTo(x - s, y)
        this.context.lineTo(x + s, y)
        this.context.stroke()

        this.context.beginPath()
        this.context.moveTo(x, y - s)
        this.context.lineTo(x, y + s)
        this.context.stroke()
    }

    cross(x, y, s) {
        this.context.beginPath()
        this.context.moveTo(x - s, y - s)
        this.context.lineTo(x + s, y + s)
        this.context.stroke()

        this.context.beginPath()
        this.context.moveTo(x - s, y + s)
        this.context.lineTo(x + s, y - s)
        this.context.stroke()
    }
}