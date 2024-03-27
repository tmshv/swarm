import UpdateChannel from '../channels/UpdateChannel'
import { Agent } from '@tmshv/swarm'

export default class SelectionController {
    get selectedItem() {
        return this._currentItem
    }

    constructor(selectSignal) {
        this.channels = new UpdateChannel(this)
        this._currentItem = null

        selectSignal.on(item => {
            if (this._currentItem instanceof Agent) {
                try {
                    item.unlock()
                } catch (e) {

                }
            }
            this._currentItem = item
            this.channels.update.trigger(this._currentItem)
        })
    }

    reset() {
        this._currentItem = null
        this.channels.update.trigger(this._currentItem)
    }
}
