import Vector from './Vector'

export default class Environment {
    constructor({pheromones}) {
        this.attractors = []
        this.pheromones = pheromones
    }

    getSample(center, matrix) {
        return [...this.attractors]
    }

    addAttractor(attractor) {
        this.attractors.push(attractor)
        return this
    }

    getNearestAttractor(coord, excluded = []) {
        let minDist = 10000000
        let result = null
        this.attractors.forEach(a => {
            const d = Vector
                .sub(coord, a.location)
                .lengthQuad
            if (d < minDist && !excluded.includes(a)) {
                minDist = d
                result = a
            }
        })

        return result
    }
}