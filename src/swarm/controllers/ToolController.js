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

    activate(name, options) {
        this.deactivate()
        this._currentTool = this.run(name, options)
    }

    run(name, options) {
        const tool = this.tools.get(name)
        tool.run(options)
        this.channels.update.trigger(tool)

        return tool
    }

    deactivate() {
        if (this._currentTool) {
            this._currentTool.destroy()
            this._currentTool = null
        }
    }
}
