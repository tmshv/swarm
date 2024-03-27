import Tool from './Tool'
import UpdateChannel from '../channels/UpdateChannel'

export default class SimulationControlSwitchTool extends Tool {
    constructor() {
        super()
        this.channels = new UpdateChannel(this)
    }

    run({simulation}) {
        if (simulation.isRunning) {
            simulation.stop()
        } else {
            simulation.run()
        }

        this.channels.update.trigger(simulation)

        return this
    }
}
