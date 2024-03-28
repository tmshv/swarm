import MovingBehavior from './MovingBehavior'
import Vector from '../../lib/vector'

export default class InteractPheromonesBehavior extends MovingBehavior {
    init({ pheromonesName }) {
        this.pheromonesName = pheromonesName
        this.target = []
    }

    run({ environment }) {
        this.target = []
        const pheromones = environment.getPheromones(this.pheromonesName)
        if (!pheromones) {
            return false
        }

        const v = pheromones.getVelocityImpact(this.agent.location)
        this.force(v)

        return true

        // const ph = pheromones.getValuesIterator()
        //
        // for (let pheromone of ph) {
        //     if (this.isOnTheWay(pheromone.location)) {
        //         this.target.push(pheromone)
        //
        //         const a = pheromone.value * 0.01
        //         this.agent.seek(pheromone.location, a)
        //     }
        // }
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
