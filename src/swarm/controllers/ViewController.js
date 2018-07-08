import {Matrix} from 'transformation-matrix-js'
import Vector from '../Vector'
import MouseChannel from '../channels/MouseChannel'

export default class ViewController {
    constructor(simulation, viewport) {
        this.simulation = simulation
        this.viewport = viewport

        this.viewFactory = new Map()
        this.views = []
        this.viewOptions = []

        this._matrix = new Matrix()

        this.render = this.render.bind(this)
    }

    subscribe(signal) {
        signal.on(this.render)
    }

    invertCoord(coord) {
        const p = this._matrix
            .inverse()
            .applyToPoint(coord.x, coord.y)
        coord.x = p.x
        coord.y = p.y
        return coord
    }

    inversedCoord(coord) {
        return this.invertCoord(coord.clone())
    }

    translate(coord) {
        this._matrix.translate(coord.x, coord.y)

        return this
    }

    scaleUniform(s) {
        this._matrix.scaleU(s)

        return this
    }

    scale(sx, sy) {
        this._matrix.scale(sx, sy)

        return this
    }

    rotate(angle) {
        this._matrix.rotate(angle)

        return this
    }

    transform(matrix) {
        this._matrix.transform(
            matrix.a, matrix.b, matrix.c,
            matrix.d, matrix.e, matrix.f,
        )

        return this
    }

    applyMatrix(matrix) {
        return this.setTransform(
            matrix.a, matrix.b, matrix.c,
            matrix.d, matrix.e, matrix.f,
        )
    }

    setTransform(a, b, c, d, e, f) {
        this._matrix.setTransform(a, b, c, d, e, f)

        return this
    }

    resetTransform() {
        this._matrix.reset()

        return this
    }

    applyTransform() {
        this.updateViewsMatrix()

        return this
    }

    setCenter(coord) {
        const center = this.viewport.getScreenCenterOffset()

        const t = this
            .invertCoord(center)
            .sub(coord)

        return this.translate(t)
    }

    zoomIn(target) {
        return this.zoom(1, target)
    }

    zoomOut(target) {
        return this.zoom(-1, target)
    }

    zoom(m, target) {
        let scaleFactor = 1.05
        const s = scaleFactor ** m
        const pt = this.inversedCoord(target)

        this.translate(pt)

        this.scaleUniform(s, s)

        pt.mult(-1)
        this.translate(pt)

        return this
    }

    translateFromCamera(camera) {
        return this.setCenter(camera.location)
        // const offset = camera
        //     .getScreenCenterOffset()
        // // offset.x *= 1 / this._scale.x
        // // offset.y *= 1 / this._scale.y
        //
        // const t = camera.location
        //     .clone()
        //     .mult(-1)
        //     .add(offset)
        // return this.translateViews(t)
    }

    getTransform() {
        return this._matrix.clone()
    }

    createScreenToWorldChannel(mouseChannel) {
        const worldChannel = new MouseChannel(mouseChannel.target)

        mouseChannel.mouseDown.on(coord => {
            worldChannel.mouseDown.trigger(this.screenToWorld(coord))
        })

        mouseChannel.mouseUp.on(coord => {
            worldChannel.mouseUp.trigger(this.screenToWorld(coord))
        })

        mouseChannel.mouseMove.on(coord => {
            worldChannel.mouseMove.trigger(this.screenToWorld(coord))
        })

        mouseChannel.click.on(coord => {
            worldChannel.click.trigger(this.screenToWorld(coord))
        })

        return worldChannel
    }

    setScreenToWorld(coord) {
        const {x, y} = this._matrix
            .inverse()
            .applyToPoint(coord.x, coord.y)

        return coord.set(x, y)
    }

    screenToWorld(coord) {
        return this.setScreenToWorld(coord.clone())
    }

    render() {
        this.views.forEach(view => {
            if (view.isInitialized) view.run()
        })

        return this
    }

    updateViewsMatrix() {
        this.views.forEach(view => {
            view.applyMatrix(this._matrix)
        })
    }

    addLayout(view, options) {
        this.views.push(view)
        this.viewOptions.push(options)

        return this
    }

    getLayers(mouseCallbacks) {
        return this.views.map((view, i) => ({
            ...this.viewOptions[i],
            ...mouseCallbacks,
            view,
        }))
    }

    transformCoord(coord) {
        const {x, y} = this._inverseMatrix.applyToPoint(coord.x, coord.y)

        return new Vector(x, y)
    }
}
