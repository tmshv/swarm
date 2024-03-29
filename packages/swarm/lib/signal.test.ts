import { expect, test } from 'vitest'
import Signal from './signal'

test("Signal listener call after trigger", () => {
    let called = false
    const s = new Signal<string>()
    s.on(() => {
        called = true
    })
    s.trigger("")
    expect(called).toBeTruthy()
})

test("Signal listener called once", () => {
    let counter = 0
    const s = new Signal<string>()
    s.once(() => {
        counter++
    })
    s.trigger("")
    s.trigger("")
    expect(counter).toEqual(1)
})

test("Signal stops calling listener by cancel function", () => {
    let counter = 0
    const s = new Signal<string>()
    const cancel = s.on(() => {
        counter++
    })
    s.trigger("")
    cancel()
    s.trigger("")
    expect(counter).toEqual(1)
})

test("Signal stops calling listener after off", () => {
    let counter = 0
    const s = new Signal<string>()
    const listener = () => {
        counter++
    }
    s.on(listener)
    s.trigger("")
    s.off(listener)
    s.trigger("")
    expect(counter).toEqual(1)
})
