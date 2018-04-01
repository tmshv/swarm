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
    constructor({cellSize, increaseValue = 1, decreaseValue = 1}) {
        this.values = new Map()
        this.cellSize = cellSize
        this.increaseValue = increaseValue
        this.decreaseValue = decreaseValue
    }

    run() {
        for (let [key, x] of this.values.entries()) {
            const value = x.value - this.decreaseValue

            if (value > 0) {
                this.values.set(key, {
                    ...x,
                    value,
                })
            } else {
                this.values.delete(key)
            }
        }
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

    getMaxValue() {
        let max = 0

        for (let {value} of this.getValuesIterator()) {
            if (value > max) {
                max = value
            }
        }
        return max
    }
}