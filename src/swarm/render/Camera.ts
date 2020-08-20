import Vector from '../Vector'
import { getWindowHeight, getWindowWidth } from '../lib/browser'

export default class Camera {
    private _window: Window
    private location: Vector

    constructor(window: Window) {
        this._window = window
        this.location = new Vector(0, 0)
    }

    public getScreenCenterOffset() {
        const m = this._window.devicePixelRatio

        return new Vector(
            getWindowWidth(this._window) / 2 * m,
            getWindowHeight(this._window) / 2 * m,
        )
    }
}