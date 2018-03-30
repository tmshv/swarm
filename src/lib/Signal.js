export default class Signal {
	constructor() {
		this.listeners = []
	}

	on(callback) {
		this.listeners.push(callback)
		return this
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
