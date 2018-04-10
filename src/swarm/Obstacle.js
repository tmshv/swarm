import Vector from './Vector'
import Line from './Line'

export default class Obstacle {
    static fromCoords(coords) {
        const length = coords.length
        if (length < 2) {
            throw new Error('Coords size is too small')
        }

        const lines = []
        for (let i = 0; i < length; i += 1) {
            const a = i % length
            const b = (i + 1) % length
            const line = new Line(coords[a], coords[b])
            lines.push(line)
        }

        return new Obstacle({lines})
    }

    constructor({lines}) {
        this.lines = lines
        this.centroid = this.calcCentroid()

        this.lines.forEach(line => {
            line.directNormalFrom(this.centroid)
        })

        this.tags = new Map()
    }

    addTag(name, tag) {
        this.tags.set(name, tag)
        return this
    }

    getTag(name) {
        return this.tags.get(name)
    }

    calcCentroid() {
        const centroid = this.lines
            .reduce(
                (acc, line) => acc.add(line.a),
                new Vector(0, 0)
            )
        return centroid.divide(this.lines.length)
    }
}