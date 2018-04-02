import Behaviour from './Behaviour'
import Vector from '../Vector'

export default class InteractPheromonesBehaviour extends Behaviour {
    constructor(options) {
        super(options)

        this.target = []
    }

    run({environment}) {
        this.target = []
        const pheromones = environment.pheromones
        const ph = pheromones.getValuesIterator()

        for (let pheromone of ph) {
            if (this.isOnTheWay(pheromone.location)) {
                this.target.push(pheromone)

                const a = pheromone.value * 0.01
                this.agent.seek(pheromone.location, a)
            }
        }
    }

    isOnTheWay(coord) {
        const d = 20 ** 2
        const location = this.agent.location
        const desire = Vector.sub(coord, location)

        if (desire.lengthSquared > d) return false
        if (desire.dot(this.agent.velocity) < 0) return false

        return true
    }
}