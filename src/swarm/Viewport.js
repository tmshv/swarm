import Rect from './Rect'
import {getWindowHeight, getWindowWidth} from './lib/browser'
import Vector from './Vector'
import View from './views/View'

export default class Viewport {
    static fromWindow(window) {
        const w = getWindowWidth(window)
        const h = getWindowHeight(window)
        return new Viewport(window, w, h)
    }

    get width() {
        return this._rect.width
    }

    get height() {
        return this._rect.height
    }

    constructor(window, width, height) {
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