import Vector from './Vector'

export default class Environment {
    constructor({pheromones}) {
        this.attractors = []
        this.pheromones = pheromones
        this.obstacles = []
    }

    run() {
        this.pheromones.run()
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

    addObstacle(obstacle) {
        this.obstacles.push(obstacle)
        return this
    }

    findObstacle(location, radius) {
        const radiusSquared = radius ** 2
        let minDistanceSquared = radiusSquared
        let result = null

        for (let o of this.obstacles) {
            const distSquared = location.distQuad(o.centroid)
            if (distSquared < radiusSquared && distSquared < minDistanceSquared) {
                minDistanceSquared = distSquared
                result = o
            }
        }

        return result
    }
}