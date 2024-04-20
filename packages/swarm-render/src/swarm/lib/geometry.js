import { Rect } from '@tmshv/swarm'

export function getBoundingBox(coords) {
    const tl = { x: 0, y: 0 }
    const br = { x: 0, y: 0 }

    const xs = coords.map(i => i.x).sort()
    const ys = coords.map(i => i.x).sort()

    tl.x = xs[0]
    tl.y = ys[0]

    br.x = xs[xs.length - 1]
    br.y = ys[ys.length - 1]

    return new Rect(tl, br)
}
