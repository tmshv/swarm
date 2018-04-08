import {Matrix} from 'transformation-matrix-js'
import Vector from '../Vector'
import MouseChannel from '../channels/MouseChannel'

export default class ViewController {
    constructor(simulation) {
        // this.screen = screen
        this.simulation = simulation

        this.simulation.channels.update.on(this.onSimulationUpdate.bind(this))
        // this.screen.channels.update.on(this.onScreenUpdate.bind(this))

        this.viewFactory = new Map()
        this.views = []

        this._matrix = new Matrix()
        this._inverseMatrix = null
        this._translation = new Vector(0, 0)
        this._scale = new Vector(1, 1)
        this._rotation = 0
    }

    translateFromCamera(camera) {
        const offset = camera
            .getScreenCenterOffset()
            .mult(1 / this._scale.x)

        const t = camera.location
            .clone()
            .mult(-1)
            .add(offset)
        return this.translateViews(t)
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
        const {x, y} = this._inverseMatrix.applyToPoint(coord.x, coord.y)

        return coord.set(x, y)
    }

    screenToWorld(coord) {
        return this.setScreenToWorld(coord.clone())
    }

    // subscribe(updateChannel) {
    //     updateChannel.on(this.onScreenUpdate.bind(this))
    // }

    render() {
        this.views.forEach(view => {
            if (view.isInitialized) view.run()
        })

        return this
    }

    onSimulationUpdate() {
        this.render()
    }

    setTransformation(tx, ty, sx, sy, a) {
        this._translation.set(tx, ty)
        this._scale.set(sx, sy)
        this._rotation = a

        return this.applyTransform()
    }

    applyTransform() {
        this._matrix.reset()
        this._matrix.scale(this._scale.x, this._scale.y)
        this._matrix.translate(this._translation.x, this._translation.y)
        this._matrix.rotate(this._rotation)
        this._inverseMatrix = this._matrix.inverse()

        this.views.forEach(view => {
            view.applyMatrix(this._matrix)
        })

        return this
    }

    translateViews(coord) {
        this._translation.setFrom(coord)

        return this.applyTransform()
    }

    scaleViews(scaleX, scaleY) {
        this._scale.set(scaleX, scaleY)

        return this.applyTransform()
    }

    rotateViews(angle) {
        this._rotation = angle

        return this.applyTransform()
    }

    // onScreenUpdate() {
    //     this.views.forEach(view => {
    //         view.translate(this.screen.camera.location)
    //     })
    //
    //     this.render()
    // }

    registerViewFactory(name, factory) {
        this.viewFactory.set(name, factory)

        return this
    }

    addLayout(layer) {
        const view = this.createView(layer, {
            simulation: this.simulation,
        })
        this.views.push(view)

        return this
    }

    createView(name, params) {
        if (!this.viewFactory.has(name)) throw new Error(`Layer ${name} is not registered`)

        const factory = this.viewFactory.get(name)
        return factory(params)
    }

    getLayers(props) {
        return this.views.map(view => ({
            view,
            ...props,
        }))
    }
}
