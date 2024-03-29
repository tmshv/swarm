import { expect, test } from 'vitest'
import Vector from './vector'

test("Vector zero should return (0, 0)", () => {
    expect(Vector.zero()).toEqual(new Vector(0, 0))
})

test.each([
    [0, 1, 0],
    [Math.PI / 2, 0, 1],
    [Math.PI, -1, 0],
])("fromAngle %f -> (%f, %f)", (angle, x, y) => {
    const v = Vector.fromAngle(angle)
    expect(v.x).toBeCloseTo(x)
    expect(v.y).toBeCloseTo(y)
})
