export default class QuadTree {
    get depth() {
        return this._depth
    }

    constructor(width, height) {
        this._depth = 5

        this.width = width
        this.height = height
    }

    addItem(item, x, y) {
        return item
    }

    getItem(x, y) {

    }

    getNeighbors(x, y, matrix) {

    }
}