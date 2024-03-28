export type SignalCallback<T> = (param: T) => void
export type SignalCancel = () => void

export default class Signal<T> {
    private listeners: SignalCallback<T>[]

    constructor() {
        this.listeners = []
    }

    on(callback: SignalCallback<T>): SignalCancel {
        this.listeners.push(callback)

        return () => {
            this.off(callback)
        }
    }

    once(callback: SignalCallback<T>) {
        const wrapper: SignalCallback<T> = (...args) => {
            this.off(wrapper)
            callback(...args)
        }

        return this.on(wrapper)
    }

    off(callback: SignalCallback<T>) {
        this.listeners = this.listeners
            .filter(x => x !== callback)
        return this
    }

    trigger(param: T) {
        this.listeners.forEach(x => {
            x(param)
        })
        return this
    }
}
