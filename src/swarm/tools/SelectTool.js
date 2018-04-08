import Tool from './Tool'
import UpdateChannel from '../channels/UpdateChannel'

export default class SelectTool extends Tool {
    constructor({channel, simulation, select, radius}) {
        super()
        this.channels = new UpdateChannel(this)

        this._cursorChannel = channel
        this.simulation = simulation
        this.select = select
        this.radius = radius

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
        const item = this.select.call(null, this.simulation, coord, this.radius)
        this.channels.update.trigger(item)
    }
}
