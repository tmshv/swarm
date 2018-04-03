import {Matrix} from 'transformation-matrix-js'
import Vector from '../swarm/Vector'

const TWO_PI = 2 * Math.PI

export default class Render {
    constructor(context, width, height) {
        this.context = context
        this.width = width
        this.height = height

        this.matrix = new Matrix()
    }

    clear(){
        this.context.clearRect(0, 0, this.width, this.height)
    }

    getValue(value) {
        return this.matrix.applyToPoint(value, 0).x
    }

    getCoord({x, y}) {
        return this.matrix.applyToPoint(x, y)
    }

    circleCenter(coord, radius) {
        this.arcCenter(coord, radius, 0, TWO_PI)
    }

    arcCenter(coord, radius, startAngle, endAngle) {
        const {x, y} = this.getCoord(coord)
        const r = this.getValue(radius)

        this.context.beginPath()
        this.context.arc(x, y, r, startAngle, endAngle)
        this.context.stroke()
    }

    rect(coord, w, h) {
        const {x, y} = this.getCoord(coord)
        const {x: width, y: height} = this.getCoord({x: w, y: h})

        this.context.fillRect(x, y, width, height)
    }

    rectCenter(coord, w, h) {
        const {x, y} = this.getCoord(coord)
        const {x: width, y: height} = this.getCoord({x: w, y: h})

        const w2 = width / 2
        const h2 = height / 2

        this.context.fillRect(x - w2, y - h2, width, height)
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

    path(coords) {
        const length = coords.length
        if (length < 2) return

        this.context.beginPath()
        const {x, y} = this.getCoord(coords[0])
        this.context.moveTo(x, y)

        for (let i = 1; i < length; i++) {
            const {x, y} = this.getCoord(coords[i])
            this.context.lineTo(x, y)
        }
        this.context.stroke()
    }

    line(line) {
        this.path([line.a, line.b])
    }

    vector(coord, vector) {
        const end = Vector.add(coord, vector)
        this.path([coord, end])
        // this.cross(end, 2)
    }
}