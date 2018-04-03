export default class Vector {
    static sub(a, b) {
        return new Vector(
            a.x - b.x,
            a.y - b.y,
        )
    }

    static add(a, b) {
        return new Vector(
            a.x + b.x,
            a.y + b.y,
        )
    }

    static fromAngle(angle) {
        return new Vector(
            Math.cos(angle),
            Math.sin(angle),
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

    get lengthQuad() {
        return this._x * this._x + this._y * this._y
    }

    get lengthSquared() {
        return this._x * this._x + this._y * this._y
    }

    constructor(x, y) {
        this._x = x
        this._y = y
    }

    clone() {
        return new Vector(this._x, this._y)
    }

    set(x, y){
        this._x = x
        this._y = y

        return this
    }

    dot(vector) {
        return this._x * vector.x + this._y * vector.y
    }

    add(vector){
        this._x += vector.x
        this._y += vector.y

        return this
    }

    sub(vector){
        this._x -= vector.x
        this._y -= vector.y

        return this
    }

    mult(value){
        this._x *= value
        this._y *= value

        return this
    }

    divide(value) {
        this._x = this._x / value
        this._y = this._y / value

        return this
    }

    normalize() {
        const length = this.length
        this._x = this._x / length
        this._y = this._y / length

        return this
    }

    reverse() {
        return this.mult(-1)
    }

    limit(value) {
        if (this.lengthQuad > value ** 2) {
            return this
                .normalize()
                .mult(value)
        }

        return this
    }

    right() {
        return new Vector(-this.y, this.x)
    }

    left() {
        return new Vector(this.y, -this.x)
    }

    dist(vector) {
        const dx = this._x - vector.x
        const dy = this._y - vector.y

        return Math.sqrt(dx * dx + dy * dy)
    }

    distSquared(vector) {
        const dx = this._x - vector.x
        const dy = this._y - vector.y

        return dx * dx + dy * dy
    }

    distQuad(vector) {
        const dx = this._x - vector.x
        const dy = this._y - vector.y

        return dx * dx + dy * dy
    }

    isNaN() {
        return isNaN(this._x) || isNaN(this._y)
    }

    equals(vector) {
        return this._x === vector.x && this._y === vector.y
    }

    toArray() {
        return [this._x, this._y]
    }
}