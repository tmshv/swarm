import Vector from './Vector'
import Tag from './Tag'

export default class Environment {
    constructor() {
        this.attractors = []
        this._pheromones = new Map()
        this.obstacles = []
    }

    run(context) {
        this._pheromones.forEach(x => x.run(context))
    }

    addPheromones(name, pheromones){
        this._pheromones.set(name, pheromones)
    }

    getPheromones(name){
        return this._pheromones.get(name)
    }

    getPheromonesNamesIter(){
        return this._pheromones.keys()
    }

    getSample(center, matrix) {
        return [...this.attractors]
    }

    addAttractor(attractor) {
        this.attractors.push(attractor)
        return this
    }

    removeAttractor(attractor) {
        const i = this.attractors.indexOf(attractor)
        this.attractors.splice(i, 1)
        return this
    }
    
    getRandomAttractor() {
        const i = Math.floor(Math.random() * this.attractors.length)

        return this.attractors[i]
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
    
    getNearestAttractorWithOneOfType(coord, types, excluded = []) {
        let minDist = 10000000
        let result = null

        this.attractors.forEach(a => {
            const type = a.getTag(Tag.TYPE)
            if (!types.includes(type)) {
                return null
            }

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