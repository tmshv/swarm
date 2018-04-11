import Tool from './Tool'
import UpdateChannel from '../channels/UpdateChannel'
import Agent from '../Agent'

export default class MoveTool extends Tool {
    constructor({channel, simulation}) {
        super()
        this._cursorChannel = channel
        this.simulation = simulation

        this.onMove = this.onMove.bind(this)
    }

    run({selectionController}) {
        this.selectionController = selectionController
        this._cursorChannel.mouseMove.on(this.onMove)

        return this
    }

    destroy() {
        this._cursorChannel.mouseMove.off(this.onMove)

        return this
    }

    onMove(coord) {
        const item = this.selectionController.selectedItem

        if (item instanceof Agent) {
            item.lock()
            item.location.setFrom(coord)
        }
    }
}
