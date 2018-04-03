import Behaviour from './Behaviour'
import Vector from '../Vector'

import {Chance} from 'chance'

const chance = new Chance()

export default class SpreadPheromonesBehaviour extends Behaviour {
    init({pheromones}) {
        this.pheromones = pheromones
    }

    run() {
        this.pheromones.increaseInLocation(this.agent.location)
    }
}