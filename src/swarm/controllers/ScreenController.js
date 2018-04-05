import Vector from '../Vector'

export default class ScreenController {
    get isDragging() {
        return this._drag
    }

    constructor() {
        this.views = []

        this.center = new Vector(-100, 0)
        this.mouse = new Vector(0, 0)
        this.offset = new Vector(0, 0)

        this._drag = false
    }

    dragOn() {
        this._drag = true
    }

    dragOff() {
        this._drag = false
    }

    init(simulation) {

    }

    update() {
        this.views.forEach(view => {
            view.translate(this.center)
        })
        return this
    }

    addView(view) {
        view.translate(this.center)

        this.views.push(view)
        return this
    }
}
