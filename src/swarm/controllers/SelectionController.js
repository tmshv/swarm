import UpdateChannel from '../channels/UpdateChannel'
import Agent from '../Agent'

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
        })
    }
}
