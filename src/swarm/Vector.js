export default class Vector {
    static sub(a, b) {
        return new Vector(
            a.x - b.x,
            a.y - b.y,
        )
    }

    get x() {
        return this._x
    }

    get y() {
        return this._y
    }

    get length() {
        return Math.sqrt(this._x * this._x + this._y * this._y)
    }

    constructor(x, y) {
        this._x = x
        this._y = y
    }

    set(x, y){
        this._x = x
        this._y = y
    }

    add(vector){
        this._x += vector.x
        this._y += vector.y

        return this
    }

    mult(value){
        this._x *= value
        this._y *= value

        return this
    }

    normalize() {
        const length = this.length
        this._x = this._x / length
        this._y = this._y / length

        return this
    }
}