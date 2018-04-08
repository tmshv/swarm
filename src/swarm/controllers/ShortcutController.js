import {zip} from 'lodash'

export default class ShortcutController {
    constructor(keyboardChannel) {
        this.registry = new Map()

        keyboardChannel.keyPress.on(this.listenPress.bind(this))
        // keyboardChannel.keyDown.on(this.listenDown.bind(this))
        // keyboardChannel.keyUp.on(this.listenUp.bind(this))

        // this._lastFiredCombination = null
    }

    listenPress(event) {
        const combination = getEventCombination(event)

        if (event.repeat) return

        // if (this._lastFiredCombination === combination) return
        if (this.registry.has(combination)) {
            // this._lastFiredCombination = combination
            const fn = this.registry.get(combination)
            fn.call(null)
        }
    }

    listenUp(event) {
        // this._lastFiredCombination = null
    }

    register(combination, fn) {
        this.registry.set(combination, fn)
    }
}

function getEventCombination(event) {
    const chars = [
        'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p',
        'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l',
        'z', 'x', 'c', 'v', 'b', 'n', 'm',
    ]

    const id = chars.includes(event.key.toLowerCase())
        ? event.key.toLowerCase()
        : event.code.toLowerCase()

    const modNames = ['meta', 'ctrl', 'alt', 'shift']
    const modValues = [event.metaKey, event.ctrlKey, event.altKey, event.shiftKey]

    const mod = zip(modNames, modValues)
        .filter(x => x[1])
        .map(x => x[0])

    return [...mod, id].join('+')
}