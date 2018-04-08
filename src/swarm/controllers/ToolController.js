import UpdateChannel from '../channels/UpdateChannel'

export default class ToolController {
    constructor() {
        this.channels = new UpdateChannel(this)
        this.tools = new Map()
        this._currentTool = null
    }

    register(name, tool) {
        this.tools.set(name, tool)
        return this
    }

    getToolUpdateSignal(name) {
        return this.tools.get(name).channels.update
    }

    activate(name) {
        this.deactivate()
        const tool = this.tools.get(name)

        this._currentTool = tool
        this._currentTool.run()
        this.channels.update.trigger(tool)
    }

    deactivate() {
        if (this._currentTool) {
            this._currentTool.destroy()
            this._currentTool = null
        }
    }
}
