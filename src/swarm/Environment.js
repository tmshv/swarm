export default class Environment {
    constructor() {
        this.attractors = []
    }

    getSample(center, matrix) {
        return [...this.attractors]
    }

    addAttractor(attractor) {
        this.attractors.push(attractor)
        return this
    }
}