import Tool from './Tool'
import UpdateChannel from '../channels/UpdateChannel'

export default class SimulationControlStepTool extends Tool {
    constructor() {
        super()
        this.channels = new UpdateChannel(this)
    }

    run({simulation}) {
        if (simulation.isRunning) {
            simulation.stop()
        }

        simulation.step()
        this.channels.update.trigger(simulation)

        return this
    }
}
