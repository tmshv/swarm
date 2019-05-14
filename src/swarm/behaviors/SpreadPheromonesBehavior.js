import Behavior from './Behavior'

export default class SpreadPheromonesBehavior extends Behavior {
    init({pheromonesName}) {
        this.pheromonesName = pheromonesName
    }

    run({environment}) {
        const pheromones = environment.getPheromones(this.pheromonesName)
        pheromones.gain(this.agent.location, this.agent.velocity)

        return true
    }
}