import { expect, test } from 'vitest'
import { lerp } from './math'

test.each([
    [0, 10, 0.5, 5],
    [-10, 10, 0.5, 0],
])("lerp(%f, %f, %f) -> %f", (a, b, val, expected) => {
    expect(lerp(a, b, val)).toEqual(expected)
})
