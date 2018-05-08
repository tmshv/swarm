import Vector from '../Vector'
import Tool from './Tool'
import UpdateChannel from '../channels/UpdateChannel'

export default class NavigateTool extends Tool {
    get isDragging() {
        return this._drag
    }

    constructor({viewController, channel}) {
        super()
        this.channels = new UpdateChannel(this)

        this._dragStart = null
        this._cursor = new Vector(0, 0)
        this._drag = false

        this._viewController = viewController
        this._cursorChannel = channel

        this.onMouseDown = this.onMouseDown.bind(this)
        this.onMouseUp = this.onMouseUp.bind(this)
        this.onMouseMove = this.onMouseMove.bind(this)
        this.onMouseWheel = this.onMouseWheel.bind(this)
    }

    run() {
        this._cursorChannel.mouseDown.on(this.onMouseDown)
        this._cursorChannel.mouseUp.on(this.onMouseUp)
        this._cursorChannel.mouseMove.on(this.onMouseMove)
        this._cursorChannel.mouseWheel.on(this.onMouseWheel)

        return this
    }

    destroy() {
        this._cursorChannel.mouseDown.off(this.onMouseDown)
        this._cursorChannel.mouseUp.off(this.onMouseUp)
        this._cursorChannel.mouseMove.off(this.onMouseMove)
        this._cursorChannel.mouseWheel.off(this.onMouseWheel)

        return this
    }

    dragOn() {
        this._drag = true
    }

    dragOff() {
        this._drag = false
    }

    onMouseDown(coord) {
        this._dragStart = this._viewController.inversedCoord(coord)
        this.dragOn()
    }

    onMouseUp() {
        this._dragStart = null
        this.dragOff()
    }

    onMouseMove(coord) {
        this._cursor.setFrom(coord)

        if (this.isDragging) {

            const pt = this._viewController
                .inversedCoord(coord)
                .sub(this._dragStart)
            this._viewController.translate(pt)
            this.channels.update.trigger(this)
        }
    }

    onMouseWheel(delta) {
        if (delta.y < 0) {
            this._viewController.zoomIn(this._cursor)
        } else {
            this._viewController.zoomOut(this._cursor)
        }

        this.channels.update.trigger(this)
    }
}
