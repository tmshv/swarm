import KeyboardChannel from '../channels/KeyboardChannel'

export default class KeyboardController {
    constructor(target) {
        this._target = target
        this.channels = new KeyboardChannel(this)

        this.onKeyDown = create(this.channels.keyDown)
        this.onKeyUp = create(this.channels.keyUp)
        this.onKeyPress = create(this.channels.keyPress)

        this.listenTarget()
    }

    listenTarget() {
        this._target.addEventListener('keydown', this.onKeyDown)
        this._target.addEventListener('keyup', this.onKeyUp)
        this._target.addEventListener('keypress', this.onKeyPress)
    }
}

function create(signal) {
    return event => {
        signal.trigger(event)
    }
}