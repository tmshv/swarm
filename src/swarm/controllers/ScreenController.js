import Vector from '../Vector'
import {createEventToVector, getWindowHeight, getWindowWidth} from '../lib/browser'

export default class ScreenController {
    get isDragging() {
        return this._drag
    }

    constructor(window) {
        this.views = []

        this.center = new Vector(-100, 0)
        this.mouse = new Vector(0, 0)
        this.offset = new Vector(0, 0)

        this._drag = false

        this._window = window
    }

    setCenter(coord) {
        const offsetX = getWindowWidth(this._window) / 2
        const offsetY = getWindowHeight(this._window) / 2

        this.center.set(
            -coord.x + offsetX,
            -coord.y + offsetY,
        )
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

    getMouseCallbacks() {
        return {
            onMouseDown: createEventToVector(coord => {
                this.mouse.setFrom(coord)
                this.offset.setFrom(this.center)
                this.dragOn()
            }),
            onMouseUp: createEventToVector(coord => {
                this.dragOff()
            }),
            onMouseMove: createEventToVector(coord => {
                const vectorFromClickToMouse = Vector.sub(coord, this.mouse)

                if (this.isDragging) {
                    this.center.setFrom(this.offset)
                    this.center.add(vectorFromClickToMouse)
                    this.update()
                }
            }),
        }
    }
}

