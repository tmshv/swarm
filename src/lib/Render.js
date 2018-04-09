import {Matrix} from 'transformation-matrix-js'
import Vector from '../swarm/Vector'
import Cross from '../swarm/render/Cross'
import PathShape from '../swarm/render/PathShape'

const TWO_PI = 2 * Math.PI

export default class Render {
    constructor() {
        this.matrix = new Matrix()

        this.context = null
        this.width = null
        this.height = null

        this.crossShape = new Cross({})
        this.pathShape = new PathShape({})
    }

    setContext(context) {
        this.context = context
    }

    setFrame(width, height) {
        this.width = width
        this.height = height
    }

    clear(){
        this.context.clearRect(0, 0, this.width * 2, this.height * 2)
    }

    screenRect(x, y, w, h) {
        w = this.width
        h = this.height
        this.context.fillRect(x, y, w, h)
    }

    // style(style) {
    //
    // }

    // render(coord, shape) {
    //     shape.render(this.context)
    // }

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
        const r = radius

        this.context.beginPath()
        this.context.arc(x, y, r, startAngle, endAngle)
        this.context.stroke()
    }

    rect(coord, w, h) {
        const {x, y} = this.getCoord(coord)

        this.context.fillRect(x, y, w, h)
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

        this.crossShape.init({
            size: s,
        })
        this.crossShape.render(this.context, {
            translate: {x, y},
        })
    }

    path(coords) {
        this.pathShape.init({
            coords: coords.map(c => this.getCoord(c)),
        })
        this.pathShape.render(this.context, {})
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