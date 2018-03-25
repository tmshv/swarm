import Vector from './Vector'

export default class Attractor {
    get location() {
        return this._location
    }

    get power() {
        return this._power
    }

    constructor({id, x, y, power}) {
        this._location = new Vector(x, y)
        this._power = power
        this.id = id
    }
}