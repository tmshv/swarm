// @ts-nocheck

export default class Storage {
    constructor(provider) {
        this._provider = provider
    }

    getItem(key) {
        const data = this._provider.getItem(key)

        try {
            return JSON.parse(data)
        } catch (e) {
            return null
        }
    }

    setItem(key, value) {
        const data = JSON.stringify(value)

        return this._provider.setItem(key, data)
    }
}
