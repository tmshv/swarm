import { createEventToVectorMapper } from '../lib/browser'
import ScreenControllerChannel from '../channels/ScreenControllerChannel'
import { Vector } from '@tmshv/swarm'

export default class ScreenController {
    constructor(window) {
        this._window = window
        this.channels = new ScreenControllerChannel(this)

        this.onMouseDown = triggerCoordEvent(this.channels.mouseDown, this._transform.bind(this))
        this.onMouseUp = triggerCoordEvent(this.channels.mouseUp, this._transform.bind(this))
        this.onMouseMove = triggerCoordEvent(this.channels.mouseMove, this._transform.bind(this))
        this.onClick = triggerCoordEvent(this.channels.click, this._transform.bind(this))

        const mouseWheelDelta = new Vector(0, 0)
        this.onMouseWheel = (event) => {
            event.preventDefault()

            mouseWheelDelta.set(
                event.deltaX,
                event.deltaY,
            )

            this.channels.mouseWheel.trigger(mouseWheelDelta)
        }
    }

    _transform(coord) {
        return coord.mult(this._window.devicePixelRatio)
    }

    getMouseCallbacks() {
        return {
            onMouseDown: this.onMouseDown,
            onMouseUp: this.onMouseUp,
            onMouseMove: this.onMouseMove,
            onClick: this.onClick,
            onMouseWheel: this.onMouseWheel,
        }
    }
}

function triggerCoordEvent(channel, fn) {
    return createEventToVectorMapper(coord => {
        channel.trigger(fn(coord))
    })
}
