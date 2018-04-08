import Vector from '../Vector'
import Tool from './Tool'
import UpdateChannel from '../channels/UpdateChannel'

export default class NavigateTool extends Tool {
    get isDragging() {
        return this._drag
    }

    constructor({camera, channel}) {
        super()
        this.mouseDirectionMultiplyX = 1
        this.mouseDirectionMultiplyY = 1
        this.channels = new UpdateChannel(this)

        this._lastCursorLocation = null
        this._drag = false

        this._camera = camera
        this._cursorChannel = channel

        this.onMouseDown = this.onMouseDown.bind(this)
        this.onMouseUp = this.onMouseUp.bind(this)
        this.onMouseMove = this.onMouseMove.bind(this)
    }

    run() {
        this._cursorChannel.mouseDown.on(this.onMouseDown)
        this._cursorChannel.mouseUp.on(this.onMouseUp)
        this._cursorChannel.mouseMove.on(this.onMouseMove)

        return this
    }

    destroy() {
        this._cursorChannel.mouseDown.off(this.onMouseDown)
        this._cursorChannel.mouseUp.off(this.onMouseUp)
        this._cursorChannel.mouseMove.off(this.onMouseMove)

        return this
    }

    dragOn() {
        this._drag = true
    }

    dragOff() {
        this._drag = false
    }

    onMouseDown(coord) {
        this._lastCursorLocation = coord.clone()
        this.dragOn()
    }

    onMouseUp() {
        this._lastCursorLocation = null
        this.dragOff()
    }

    onMouseMove(coord) {
        if (this.isDragging) {
            const mouseDirection = Vector
                .sub(this._lastCursorLocation, coord)
            mouseDirection.x *= this.mouseDirectionMultiplyX
            mouseDirection.y *= this.mouseDirectionMultiplyY
            this._lastCursorLocation.setFrom(coord)

            this._camera.location.add(mouseDirection)
            this.channels.update.trigger(this)
        }
    }
}
