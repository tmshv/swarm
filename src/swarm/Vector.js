export default class Vector {
    get x() {
        return this._x
    }

    get y() {
        return this._y
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
    }
}