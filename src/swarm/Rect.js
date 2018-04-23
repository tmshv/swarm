import Vector from './Vector'

export default class Rect {
    static fromWidthAndHeight(width, height) {
        return new Rect(
            new Vector(0, 0),
            new Vector(width, height),
        )
    }

    get topLeft() {
        return this._tl
    }

    get rightBottom() {
        return this._rb
    }

    get width() {
        return this._rb.x - this._tl.x
    }

    get height() {
        return this._rb.y - this._tl.y
    }

    constructor(tl, rb) {
        this._tl = tl
        this._rb = rb
    }

    contains(coord) {
        return false
    }
}