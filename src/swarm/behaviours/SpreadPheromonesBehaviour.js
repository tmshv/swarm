import Behaviour from './Behaviour'

export default class SpreadPheromonesBehaviour extends Behaviour {
    init({}) {
    }

    run({environment}) {
        environment.pheromones.gain(this.agent.location, this.agent.velocity)
    }
}