import React, {Component} from 'react'
import Canvas from '../Canvas/Canvas'
import {Matrix} from 'transformation-matrix-js'
import {getBoundingBox, getCentroid} from '../../swarm/lib/geometry'

function eventCoord(event, element) {
    return [
        (event.offsetX || (event.pageX - element.offsetLeft)) * 2,
        (event.offsetY || (event.pageY - element.offsetTop)) * 2,
    ]
}

export default class ZoomSample extends Component {
    constructor(...args) {
        super(...args)

        this._matrix = new Matrix()

        this.onRef = this.onRef.bind(this)
    }

    translate(x, y) {
        return this._matrix.translate(x, y)
    }

    scale(x, y) {
        return this._matrix.scale(x, y)
    }

    setScale(x, y) {
        const m = this._matrix
        return this._matrix.setTransform(x, m.b, m.c, y, m.e, m.f)
    }

    inversedPoint(x, y) {
        return this._matrix
            .inverse()
            .applyToPoint(x, y)
    }

    transformedPoint(x, y) {
        const p = this._matrix.applyToPoint(x, y)
        p.x = Math.round(p.x)
        p.y = Math.round(p.y)

        return p
    }

    scaledPoint(x, y) {
        const m = new Matrix()
        m.setTransform(this._matrix.a, this._matrix.b, this._matrix.c, this._matrix.d, 0, 0)
        return m.applyToPoint(x, y)
    }

    onRef(element) {
        this.canvas = element.canvas
    }

    clear(ctx, canvas) {
        ctx.save()
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.restore()
    }

    redraw(ctx, canvas) {
        this.clear(ctx, canvas)
        this.draw(ctx)
    }

    draw(ctx) {
        let t
        ctx.save()
        t = this.scaledPoint(50, 50)
        ctx.translate(t.x, t.y)
        ctx.lineWidth = 1
        ctx.strokeStyle = `#eeeeee`
        this.drawRect(ctx, 0, 0, 1000, 1000)
        ctx.stroke()
        ctx.restore()

        ctx.lineWidth = 5
        ctx.strokeStyle = `#aa0000`
        this.drawRect(ctx, 0, 0, 100, 100)
        ctx.stroke()

        ctx.save()
        t = this.scaledPoint(1000, 1000)
        ctx.translate(t.x, t.y)
        ctx.lineWidth = 15
        ctx.strokeStyle = `#aa00aa`
        this.drawRect(ctx, 0, 0, 100, 100)
        ctx.stroke()
        ctx.restore()

        ctx.save()
        t = this.scaledPoint(1100 / 2, 1100 / 2)
        ctx.translate(t.x, t.y)
        ctx.lineWidth = 3
        ctx.strokeStyle = `#0000aa`
        this.drawRect(ctx, -5, -5, 10, 10)
        ctx.stroke()
        ctx.restore()
    }

    drawRect(ctx, x, y, w, h) {
        const x2 = x + w
        const y2 = y + h
        const coords = [
            this.transformedPoint(x, y),
            this.transformedPoint(x2, y),
            this.transformedPoint(x2, y2),
            this.transformedPoint(x, y2),
            this.transformedPoint(x, y),
        ]
        const length = coords.length
        const {x: x1, y: y1} = coords[0]

        ctx.beginPath()
        ctx.moveTo(x1, y1)

        for (let i = 1; i < length; i++) {
            const {x, y} = coords[i]
            ctx.lineTo(x, y)
        }
    }

    componentDidMount() {
        const canvas = this.canvas
        const ctx = canvas.getContext('2d')

        let scaleFactor = 1.05
        let lastX = canvas.width / 2
        let lastY = canvas.height / 2
        let dragStart

        const worldMouse = (event) => {
            const [x, y] = eventCoord(event, canvas)
            return this.inversedPoint(x, y)
        }

        canvas.addEventListener('mousedown', evt => {
            [lastX, lastY] = eventCoord(evt, canvas)

            dragStart = this.inversedPoint(lastX, lastY)
        })

        canvas.addEventListener('mousemove', evt => {
            [lastX, lastY] = eventCoord(evt, canvas)

            if (dragStart) {
                const pt = this.inversedPoint(lastX, lastY)
                this.translate(pt.x - dragStart.x, pt.y - dragStart.y)

                this.redraw(ctx, canvas)
            }
        })

        canvas.addEventListener('mouseup', () => {
            dragStart = null
        })

        canvas.addEventListener('click', event => {
            const [x, y] = eventCoord(event, canvas)
            const m = this.inversedPoint(x, y)

            console.log('Mouse:', x, y)
            console.log('WMouse:', m.x, m.y)

            if (event.shiftKey) {
                const tl = {x: 0, y: 0}
                const br = {x: 1100, y: 1000}

                fit([tl, br])

                this.redraw(ctx, canvas)
            }
        })

        canvas.addEventListener('dblclick', event => {
            setCenter(worldMouse(event))
            this.redraw(ctx, canvas)
        })

        canvas.addEventListener('mousewheel', event => {
                event.preventDefault()

                const delta = event.deltaY
                if (delta > 0) zoomOut()
                else zoomIn()

                this.redraw(ctx, canvas)
            }
        )

        const zoomIn = () => {
            zoom(1)
        }

        const zoomOut = () => {
            zoom(-1)
        }

        const zoom = m => {
            const s = scaleFactor ** m
            const pt = this.inversedPoint(lastX, lastY)
            this.translate(pt.x, pt.y)
            this.scale(s, s)
            this.translate(-pt.x, -pt.y)
        }

        const fit = (coords) => {
            const padding = 100

            const c = getCentroid(coords)
            const bb = getBoundingBox(coords)

            const vw = canvas.width - (padding * 2)
            const vh = canvas.height - (padding * 2)

            const rw = vw / bb.width
            const rh = vh / bb.height

            const scale = Math.min(rw, rh)

            this.setScale(scale, scale)
            setCenter(c)
        }

        const setCenter = (coord) => {
            const center = this.inversedPoint(
                canvas.width / 2,
                canvas.height / 2,
            )
            this.translate(-coord.x, -coord.y)
            this.translate(center.x, center.y)
        }

        this.redraw(ctx, canvas)
    }

    render() {
        return (
            <Canvas
                width={this.props.width}
                height={this.props.height}
                devicePixelRatio={this.props.devicePixelRatio}
                ref={this.onRef}
            />
        )
    }
}
