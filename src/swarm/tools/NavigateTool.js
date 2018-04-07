import Vector from '../Vector'
import Tool from './Tool'
import UpdateChannel from '../channels/UpdateChannel'

export default class NavigateTool extends Tool {
    get isDragging() {
        return this._drag
    }

    constructor({camera, channel}) {
        super()
        this.channels = new UpdateChannel(this)

        this._savedCursorLocation = new Vector(0, 0)
        this._savedCameraLocation = new Vector(0, 0)
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
        this._savedCursorLocation.setFrom(coord)
        this._savedCameraLocation.setFrom(this._camera.location)
        this.dragOn()
    }

    onMouseUp() {
        this.dragOff()
    }

    onMouseMove(coord) {
        if (this.isDragging) {
            const vectorFromClickToMouse = Vector.sub(coord, this._savedCursorLocation)

            this._camera.location.setFrom(this._savedCameraLocation)
            this._camera.location.add(vectorFromClickToMouse)

            this.channels.update.trigger(this)
        }
    }
}
