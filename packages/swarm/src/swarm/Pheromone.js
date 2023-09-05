import Vector from './Vector'

export default class Pheromone {
    get location() {
        return this._location
    }

    get velocity() {
        return this._velocity
    }

    get power() {
        return this._velocity.lengthSquared
    }

    constructor({damp}) {
        this._location = new Vector(0, 0)
        this._velocity = new Vector(0, 0)
        this._damp = damp
    }

    isActive() {
        return this._velocity.lengthSquared > .000001
    }

    waste() {
        this._velocity.mult(this._damp)

        return this
    }

    gain(vector) {
        this._velocity.add(vector)

        return this
    }
}