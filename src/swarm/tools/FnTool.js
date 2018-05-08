import Tool from './Tool'
import UpdateChannel from '../channels/UpdateChannel'

export default class FnTool extends Tool {
    constructor(fn) {
        super()
        this.channels = new UpdateChannel(this)

        this.fn = fn
    }

    run(...args) {
        const result = this.fn(...args)
        this.channels.update.trigger(result)

        return this
    }
}
