import { Vector } from '@tmshv/swarm'

export function findNearestInLocation(items, coord, radius) {
    let minDist = radius ** 2
    let found = null

    items.forEach(x => {
        const v = Vector.sub(x.location, coord)
        const d = v.lengthSquared
        if (d < minDist) {
            minDist = d
            found = x
        }
    })

    return found
}
