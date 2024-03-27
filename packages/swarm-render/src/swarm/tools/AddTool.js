import Tool from './Tool'
import UpdateChannel from '../channels/UpdateChannel'

export default class AddTool extends Tool {
    constructor({channel, simulation, add}) {
        super()
        this.channels = new UpdateChannel(this)

        this._cursorChannel = channel
        this.simulation = simulation
        this.add = add

        this.onClick = this.onClick.bind(this)
    }

    run() {
        this._cursorChannel.click.on(this.onClick)

        return this
    }

    destroy() {
        this._cursorChannel.click.off(this.onClick)

        return this
    }

    onClick(coord) {
        const item = this.add.call(null, this.simulation, coord)
        this.channels.update.trigger(item)
    }
}
