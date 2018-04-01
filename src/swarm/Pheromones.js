import Vector from './Vector'

function round(n, v) {
    return Math.floor(n / v) * v
}

function roundVector(vector, v) {
    return new Vector(
        round(vector.x, v),
        round(vector.y, v),
    )
}

export default class Pheromones {
    constructor({cellSize, increaseValue = 1}) {
        this.values = new Map()
        this.cellSize = cellSize
        this.increaseValue = increaseValue
    }

    increaseInLocation(location, value = this.increaseValue) {
        const rounded = roundVector(location, this.cellSize)
        const key = `${rounded.x}_${rounded.y}`
        const pheromone = this.values.has(key)
            ? this.values.get(key).value + value
            : value

        this.values.set(key, {value: pheromone, location: rounded})
        return this
    }

    getValuesIterator(){
        return this.values.values()
    }
}