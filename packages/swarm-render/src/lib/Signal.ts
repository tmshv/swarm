export type SignalCallback<T> = (...args:T[]) => void

export default class Signal<T> {
    private target: any
    private listeners: SignalCallback<T>[]

    constructor(target) {
        this.target = target
        this.listeners = []
    }

    on(callback: SignalCallback<T>) {
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

    trigger(...args: T[]) {
        this.listeners.forEach(x => {
            x(...args)
        })
        return this
    }
}
