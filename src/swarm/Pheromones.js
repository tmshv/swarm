import Vector from './Vector'
import Pheromone from './Pheromone'

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
        for (let [key, pheromone] of this.values.entries()) {
            pheromone.decreasePower(this.decreaseValue)

            if (pheromone.power <= 0) {
                this.values.delete(key)
            }
        }
    }

    increaseInLocation(location, value = this.increaseValue) {
        const rounded = roundVector(location, this.cellSize)
        const key = `${rounded.x}_${rounded.y}`
        const pheromone = this.values.has(key)
            ? this.values.get(key)
            : Pheromone.fromLocation(rounded)
        this.values.set(key, pheromone.increasePower(value))
        return this
    }

    getValuesIterator(){
        return this.values.values()
    }

    getMaxValue() {
        let max = 0

        for (let x of this.getValuesIterator()) {
            if (x.power > max) {
                max = x.power
            }
        }
        return max
    }
}