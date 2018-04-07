import SimulationView from './SimulationView'

export default class EnvironmentView extends SimulationView {
    constructor({simulation, ...args}) {
        super({simulation, ...args})
        this.environment = simulation.environment
    }
}