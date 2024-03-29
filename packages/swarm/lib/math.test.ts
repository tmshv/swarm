import { expect, test } from 'vitest'
import { getCentroid, lerp } from './math'
import Vector from './vector'

test.each([
    [0, 10, 0.5, 5],
    [-10, 10, 0.5, 0],
])("lerp(%f, %f, %f) -> %f", (a, b, val, expected) => {
    expect(lerp(a, b, val)).toEqual(expected)
})

test("getCentroid", () => {
    const ctr = getCentroid([
        new Vector(-1, 0),
        new Vector(1, 0),
        new Vector(0, -1),
        new Vector(0, 1),
    ])
    expect(ctr).toEqual(Vector.zero())
})
