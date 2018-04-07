import Vector from '../Vector'

export function createEventToVectorMapper(callback) {
    const coord = new Vector(0, 0)

    return event => callback(coord.set(
        event.clientX,
        event.clientY,
    ))
}

export function getWindowWidth(window) {
    return window.innerWidth
}

export function getWindowHeight(window) {
    return window.innerHeight
}