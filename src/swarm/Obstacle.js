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

    getNearestEdge(coord, direction) {
        let edges = []

        const nextCoord = Vector.add(coord, direction)

        for (let line of this.lines) {
            if (line.normal.dot(direction) < 0) { // edge in opposite direction
                const coordProjected = line.project(coord)
                if (line.isBetween(coordProjected)) {
                    // const nextCoordProjected = line.project(nextCoord)

                    // if (nextCoordProjected)

                    edges.push([line, line.distSquared(nextCoord)])
                }
            }
        }

        edges = edges.sort((a, b) => {
            return a[1] - b[1]
        })

        // const ps = this.lines
        //     .map(line => {
        //         const projection = line.project(coord)
        //
        //         const between = line.isBetween(projection)
        //         const distSquared = Vector
        //             .sub(coord, projection)
        //             .lengthSquared
        //         return [line, distSquared, between]
        //     })
        //     .filter(x => x[2])
        //     .sort((a, b) => {
        //         return a[1] - b[1]
        //     })
        return edges.length
            ? edges[0][0]
            : null
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