import Vector from '../lib/vector'
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

const dummyForce = new Vector(0, 0)

export default class Pheromones {
    constructor({ cellSize, damp = 1 }) {
        this.values = new Map()
        this.cellSize = cellSize
        this.pheromoneDamp = damp
    }

    getValuesIter() {
        return this.values.values()
    }

    createPheromone(coord) {
        const rounded = roundVector(coord, this.cellSize)
        const p = new Pheromone({
            damp: this.pheromoneDamp,
        })
        p.location.setFrom(rounded)

        return p
    }

    run() {
        for (let [key, pheromone] of this.values.entries()) {
            pheromone.waste()

            if (!pheromone.isActive()) {
                this.values.delete(key)
            }
        }
    }

    gain(coord, velocity) {
        const key = this.createKey(coord)
        const pheromone = this.values.has(key)
            ? this.values.get(key)
            : this.createPheromone(coord)
        this.values.set(key, pheromone.gain(velocity))
        return this
    }

    getVelocityImpact(coord) {
        const key = this.createKey(coord)
        return this.values.has(key)
            ? this.values.get(key).velocity
            : dummyForce
    }

    getValuesIterator() {
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

    createKey(coord) {
        const rounded = roundVector(coord, this.cellSize)
        return `${rounded.x}_${rounded.y}`
    }
}