import Tool from './Tool'
import UpdateChannel from '../channels/UpdateChannel'

export default class SelectTool extends Tool {
    constructor({channel, simulation}) {
        super()
        this.channels = new UpdateChannel(this)

        this._cursorChannel = channel
        this.simulation = simulation
        this.radius = 100

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
        // this.channels.update.trigger(this.selectObstacle(coord))
        this.channels.update.trigger(this.selectAgent(coord))
    }

    selectObstacle(coord) {
        return this.simulation.environment.findObstacle(coord, this.radius)
    }

    selectAgent(coord) {
        return this.simulation.agents.getNearest(coord, this.radius)
    }
}
