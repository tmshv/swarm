export default class Obstacle {
    constructor() {
        this.tags = new Map()
    }

    addTag(name, tag) {
        this.tags.set(name, tag)
        return this
    }

    getTag(name) {
        return this.tags.get(name)
    }
}