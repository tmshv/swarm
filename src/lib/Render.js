import {Matrix} from 'transformation-matrix-js'

const TWO_PI = 2 * Math.PI

export default class Render {
    constructor(context, width, height) {
        this.context = context
        this.width = width
        this.height = height

        this.matrix = new Matrix()
    }

    getCoord({x, y}) {
        return this.matrix.applyToPoint(x, y)
    }

    circleCenter(coord, radius) {
        const {x, y} = this.getCoord(coord)

        this.context.beginPath()
        this.context.arc(x, y, radius, 0, TWO_PI)
        this.context.stroke()
    }

    rectCenter(coord, w, h) {
        const {x, y} = this.getCoord(coord)

        const w2 = w / 2
        const h2 = h / 2

        this.context.fillRect(x - w2, y - h2, w, h)
    }

    targetArea(coord, w, h, s) {
        const {x, y} = this.getCoord(coord)

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

    plus(coord, s) {
        const {x, y} = this.getCoord(coord)

        this.context.beginPath()
        this.context.moveTo(x - s, y)
        this.context.lineTo(x + s, y)
        this.context.stroke()

        this.context.beginPath()
        this.context.moveTo(x, y - s)
        this.context.lineTo(x, y + s)
        this.context.stroke()
    }

    cross(coord, s) {
        const {x, y} = this.getCoord(coord)

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