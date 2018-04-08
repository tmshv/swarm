import ViewChannel from '../channels/ViewChannel'
import Render from '../../lib/Render'

export default class View {
    get isInitialized() {
        return this._initialized
    }

    constructor({clear}) {
        this._initialized = false
        this.channels = new Event(this)
        this.draw = new Render()

        this.clear = clear
    }

    init(options) {
        this.initOptions = options
        const {width, height, canvas} = options
        this._initialized = true

        const context = canvas.getContext('2d')
        this.draw.setContext(context)
        this.draw.setFrame(width, height)
    }

    destroy() {
        this.channels.get(ViewChannel.DESTROY).trigger(this)
    }

    applyMatrix(matrix) {
        if (!this.draw) return

        this.draw.matrix.reset()
        this.draw.matrix.transform(
            matrix.a, matrix.b, matrix.c,
            matrix.d, matrix.e, matrix.f,
        )
    }

    translate(coord) {
        if (!this.draw) return

        this.draw.matrix.reset()
        this.draw.matrix.translate(coord.x, coord.y)
    }

    run(options) {
        if (!this.shouldRender()) return

        this.beforeRender()
        this.render()
        this.afterRender()
    }

    shouldRender() {
        return true
    }

    beforeRender() {
        if (this.clear) this.draw.clear()
    }

    afterRender() {

    }

    render() {

    }
}