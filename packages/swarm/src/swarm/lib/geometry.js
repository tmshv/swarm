import Rect from '../Rect'
import Vector from '../../lib/vector'

export function getBoundingBox(coords) {
    const tl = {x: 0, y: 0}
    const br = {x: 0, y: 0}

    const xs = coords.map(i => i.x).sort()
    const ys = coords.map(i => i.x).sort()

    tl.x = xs[0]
    tl.y = ys[0]

    br.x = xs[xs.length - 1]
    br.y = ys[ys.length - 1]

    return new Rect(tl, br)
}

export function getCentroid(coords) {
    const center = coords.reduce((c, i) => c.add(i), new Vector(0, 0))

    return center.divide(coords.length)
}