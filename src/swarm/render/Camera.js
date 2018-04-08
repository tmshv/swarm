import Vector from '../Vector'
import {getWindowHeight, getWindowWidth} from '../lib/browser'

export default class Camera {
    constructor(window) {
        this._window = window
        this.location = new Vector(0, 0)
    }

    getScreenCenterOffset() {
        const m = window.devicePixelRatio

        return new Vector(
            getWindowWidth(this._window) / 2 * m,
            getWindowHeight(this._window) / 2 * m,
        )
    }
}