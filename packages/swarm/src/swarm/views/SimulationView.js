import View from './View'

export default class SimulationView extends View {
    constructor({simulation, ...args}) {
        super(args)
        this.simulation = simulation
    }
}