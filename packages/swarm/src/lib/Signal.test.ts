import { expect, test } from 'vitest'
import Signal from './signal'

test("Signal listener call", () => {
    let called = false
    const s = new Signal<string>(null)
    s.on(() => {
        called = true
    })
    s.trigger()
    expect(called).toBeTruthy()
})

test("Signal listener called once", () => {
    let counter = 0
    const s = new Signal<string>(null)
    s.once(() => {
        counter++
    })
    s.trigger()
    s.trigger()
    expect(counter).toEqual(1)
})

test("Signal stops listener call after off", () => {
    let counter = 0
    const s = new Signal<string>(null)
    const listener = () => {
        counter++
    }
    s.on(listener)
    s.trigger()
    s.off(listener)
    expect(counter).toEqual(1)
})
