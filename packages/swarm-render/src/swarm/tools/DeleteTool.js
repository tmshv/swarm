import Tool from './Tool'
import UpdateChannel from '../channels/UpdateChannel'
import { Attractor } from '@tmshv/swarm'

export default class DeleteTool extends Tool {
    constructor({ simulation }) {
        super()
        this.channels = new UpdateChannel(this)

        this._simulation = simulation
    }

    run({ selectionController }) {
        const selected = selectionController.selectedItem

        if (selected instanceof Attractor) {
            this._simulation.environment.removeAttractor(selected)
            selectionController.reset()

            this.channels.update.trigger(selected)
        }

        return this
    }
}
