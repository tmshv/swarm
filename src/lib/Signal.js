export default class Signal {
    constructor(target) {
        this.target = target
		this.listeners = []
	}

	on(callback) {
		this.listeners.push(callback)
		return this
	}

    once(callback) {
        const wrapper = (...args) => {
            this.off(wrapper)
            callback(...args)
        }

        return this.on(wrapper)
    }

	off(callback) {
		this.listeners = this.listeners
			.filter(x => x !== callback)
		return this
	}

	trigger(...args) {
		this.listeners.forEach(x => {
			x(...args)
		})
		return this
	}
}
