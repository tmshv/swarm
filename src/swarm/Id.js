let counter = 0

export default class Id {
    static get(prefix = '') {
        return `${prefix}_${counter++}`
    }
}