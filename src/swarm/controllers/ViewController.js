import {Matrix} from 'transformation-matrix-js'

export default class ViewController {
    constructor(simulation) {
        // this.screen = screen
        this.simulation = simulation

        this.simulation.channels.update.on(this.onSimulationUpdate.bind(this))
        // this.screen.channels.update.on(this.onScreenUpdate.bind(this))

        this.viewFactory = new Map()
        this.views = []

        this._matrix = new Matrix()
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
        // this._matrix.reset()
        this._matrix.translate(tx, ty)
        this._matrix.scale(sx, sy)
        this._matrix.rotate(a)

        this.views.forEach(view => {
            view.applyMatrix(this._matrix)
        })

        return this
    }

    translateViews(coord) {
        this._matrix.translate(coord.x, coord.y)

        this.views.forEach(view => {
            view.translate(coord)
        })

        return this
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
