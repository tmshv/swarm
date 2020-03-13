import { fastInverseSqrt } from './lib/math'

export default class Vector {
    static sub(a: Vector, b: Vector) {
        return new Vector(
            a.x - b.x,
            a.y - b.y,
        )
    }

    static add(a: Vector, b: Vector) {
        return new Vector(
            a.x + b.x,
            a.y + b.y,
        )
    }

    static fromAngle(angle: number) {
        return new Vector(
            Math.cos(angle),
            Math.sin(angle),
        )
    }

    private _x: number
    private _y: number

    get x() {
        return this._x
    }

    set x(value) {
        this._x = value
    }

    get y() {
        return this._y
    }

    set y(value) {
        this._y = value
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

    constructor(x: number, y: number) {
        this._x = x
        this._y = y
    }

    clone() {
        return new Vector(this._x, this._y)
    }

    set(x: number, y: number) {
        this._x = x
        this._y = y

        return this
    }

    direct(vector: Vector) {
        const angle = Math.atan2(vector.y, vector.x)
        return this.setAngle(angle)
    }

    setAngle(angle: number) {
        const length = this.length

        return this.set(
            Math.cos(angle) * length,
            Math.sin(angle) * length,
        )
    }

    setFrom(vector: Vector) {
        return this.set(vector.x, vector.y)
    }

    dot(vector: Vector) {
        return this._x * vector.x + this._y * vector.y
    }

    add(vector: Vector) {
        this._x += vector.x
        this._y += vector.y

        return this
    }

    sub(vector: Vector) {
        this._x -= vector.x
        this._y -= vector.y

        return this
    }

    mult(value: number) {
        this._x *= value
        this._y *= value

        return this
    }

    multNonUniform(xValue: number, yValue: number) {
        this._x *= xValue
        this._y *= yValue

        return this
    }

    divide(value: number) {
        this._x = this._x / value
        this._y = this._y / value

        return this
    }

    normalize() {
        const lengthSquared = this._x ** 2 + this._y ** 2
        const inverseSqrt = fastInverseSqrt(lengthSquared)
        this._x *= inverseSqrt
        this._y *= inverseSqrt

        return this
    }

    reverse() {
        return this.mult(-1)
    }

    setLength(value: number) {
        return !(this._x === 0 && this._y === 0)
            ? this.normalize().mult(value)
            : this
    }

    limit(value: number) {
        return this.lengthSquared > value ** 2
            ? this.normalize().mult(value)
            : this
    }

    right() {
        return new Vector(-this.y, this.x)
    }

    left() {
        return new Vector(this.y, -this.x)
    }

    dist(vector: Vector) {
        const dx = this._x - vector.x
        const dy = this._y - vector.y

        return Math.sqrt(dx * dx + dy * dy)
    }

    distSquared(vector: Vector) {
        const dx = this._x - vector.x
        const dy = this._y - vector.y

        return dx * dx + dy * dy
    }

    distQuad(vector: Vector) {
        const dx = this._x - vector.x
        const dy = this._y - vector.y

        return dx * dx + dy * dy
    }

    isNaN() {
        return isNaN(this._x) || isNaN(this._y)
    }

    equals(vector: Vector) {
        return this._x === vector.x && this._y === vector.y
    }

    toArray(): [number, number] {
        return [this._x, this._y]
    }
}
