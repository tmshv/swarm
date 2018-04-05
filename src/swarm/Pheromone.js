import Vector from './Vector'

export default class Pheromone {
    static fromLocation(coord) {
        const value = new Pheromone()
        value.location.setFrom(coord)

        return value
    }

    get location() {
        return this._location
    }

    get velocity() {
        return this._velocity
    }

    get power() {
        return this._power
    }

    constructor() {
        this._location = new Vector(0, 0)
        this._velocity = new Vector(0, 0)
        this._power = 0
    }

    increasePower(value) {
        this._power += value
        return this
    }

    decreasePower(value) {
        this._power -= value
        return this
    }

}