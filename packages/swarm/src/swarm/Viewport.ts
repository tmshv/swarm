import Rect from './Rect'
import Vector from './Vector'
import { getWindowHeight, getWindowWidth } from './lib/browser'

export default class Viewport {
    static fromWindow(window: Window) {
        const w = getWindowWidth(window)
        const h = getWindowHeight(window)
        return new Viewport(window, w, h)
    }

    private _rect: Rect
    private _padding: number
    private _window: Window

    get width() {
        return this._rect.width
    }

    get height() {
        return this._rect.height
    }

    constructor(window: Window, width: number, height: number) {
        this._rect = Rect.fromWidthAndHeight(width, height)
        this._padding = 0

        this._window = window
    }

    getScreenCenterOffset() {
        const m = this._window.devicePixelRatio * 2

        return new Vector(
            getWindowWidth(this._window) / m,
            getWindowHeight(this._window) / m,
        )
    }
}