import {createEventToVectorMapper} from '../lib/browser'
import ScreenControllerChannel from '../channels/ScreenControllerChannel'

export default class ScreenController {
    constructor(window) {
        this.channels = new ScreenControllerChannel(this)

        const m = window.devicePixelRatio
        this.onMouseDown = triggerCoordEvent(this.channels.mouseDown, m)
        this.onMouseUp = triggerCoordEvent(this.channels.mouseUp, m)
        this.onMouseMove = triggerCoordEvent(this.channels.mouseMove, m)
        this.onClick = triggerCoordEvent(this.channels.click, m)
    }

    getMouseCallbacks() {
        return {
            onMouseDown: this.onMouseDown,
            onMouseUp: this.onMouseUp,
            onMouseMove: this.onMouseMove,
            onClick: this.onClick,
        }
    }
}

function triggerCoordEvent(channel, m) {
    return createEventToVectorMapper(coord => channel.trigger(coord.mult(m)))
}
