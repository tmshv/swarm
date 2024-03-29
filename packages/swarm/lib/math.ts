import Vector from "./vector"

export function lerp(min: number, max: number, coef: number) {
    return min + (max - min) * coef
}

export function getCentroid(vectors: Vector[]): Vector {
    const center = vectors.reduce((c, i) => c.add(i), Vector.zero())
    return center.divide(vectors.length)
}
