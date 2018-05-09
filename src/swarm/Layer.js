export class Layer {
    get name() {
        return this._name
    }

    get data() {
        return this._items
    }

    constructor({name}) {
        this._name = name

        this._items = []
    }

    push(object) {
        this._items.push(object)

        return this
    }
}