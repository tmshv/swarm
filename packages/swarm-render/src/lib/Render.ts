// @ts-nocheck

import { Matrix } from 'transformation-matrix-js'
import { Vector } from '@tmshv/swarm'
import Cross from '~/src/swarm/render/Cross'
import PathShape from '~/src/swarm/render/PathShape'

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

    clear() {
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
        const { scale } = this.matrix.decompose()
        return value * scale.x
    }

    /**
     * this function map simulation coord to screen space
     * @param {*} param0
     */
    getCoord({ x, y }) {
        return this.matrix.applyToPoint(x, y)
    }

    text(coord, text, offset) {
        return this.textWithOffset(coord, text, offset.x, offset.y)
    }

    textWithOffset(coord, text, offsetX, offsetY) {
        let { x, y } = this.getCoord(coord)
        x += offsetX
        y += offsetY
        this.context.font = '16px Arial'
        this.context.fillText(text, x, y)
    }

    circleCenterZoomed(coord, radius) {
        const r = this.getValue(radius)
        const { x, y } = this.getCoord(coord)

        this.context.beginPath()
        this.context.arc(x, y, r, 0, TWO_PI)
        this.context.stroke()
    }

    circleCenterFill(coord, radius) {
        const { x, y } = this.getCoord(coord)
        this.context.beginPath()
        this.context.arc(x, y, radius, 0, TWO_PI)
        this.context.fill()
    }

    circleCenter(coord, radius) {
        this.arcCenter(coord, radius, 0, TWO_PI)
    }

    arcCenter(coord, radius, startAngle, endAngle) {
        const { x, y } = this.getCoord(coord)
        this.context.beginPath()
        this.context.arc(x, y, radius, startAngle, endAngle)
        this.context.stroke()
    }

    rect(coord, w, h) {
        const { x, y } = this.getCoord(coord)

        this.context.fillRect(x, y, w, h)
    }

    rectCenterZoomed(coord, w, h) {
        const { x, y } = this.getCoord(coord)

        const wz = this.getValue(w)
        const hz = this.getValue(h)

        const w2 = wz / 2
        const h2 = hz / 2

        this.context.fillRect(x - w2, y - h2, wz, hz)
    }

    rectCenter(coord, w, h) {
        const { x, y } = this.getCoord(coord)

        const w2 = w / 2
        const h2 = h / 2

        this.context.fillRect(x - w2, y - h2, w, h)
    }

    targetArea(coord, w, h, s) {
        const { x, y } = this.getCoord(coord)

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
        const { x, y } = this.getCoord(coord)

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
        const { x, y } = this.getCoord(coord)

        this.crossShape.init({
            size: s,
        })
        this.crossShape.render(this.context, {
            translate: { x, y },
        })
    }

    path(coords, fill = false) {
        this.pathShape.init({
            fill,
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
