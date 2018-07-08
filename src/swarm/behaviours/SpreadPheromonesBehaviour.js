import Behaviour from './Behaviour'

export default class SpreadPheromonesBehaviour extends Behaviour {
    init({pheromonesName}) {
        this.pheromonesName = pheromonesName
    }

    run({environment}) {
        const pheromones = environment.getPheromones(this.pheromonesName)
        pheromones.gain(this.agent.location, this.agent.velocity)

        return true
    }
}