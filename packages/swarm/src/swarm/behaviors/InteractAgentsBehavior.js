import Behavior from './Behavior'
import Vector from '../Vector'

import {Chance} from 'chance'

const chance = new Chance()

export default class InteractAgentsBehavior extends Behavior {
    init({radius, initialInterest}) {
        this.initialInterest = initialInterest
        this.radius = radius
        this.radiusQuad = radius ** 2
        this.agentsInView = []
        this.interest = new Map()
    }

    run({agentsPool}) {
        if (this.needToUpdateAgents()) {
            this.updateAgents(agentsPool)
        }

        // const v = this.agentsInView.reduce((acc, {location}) => acc.add(location), new Vector(0, 0))
        // v.divide(length)
        // this.seek(v)

        for (let a of this.agentsInView) {
            this.seekAccelerated(a.location)

            let interest = this.interest.get(a)
            if (interest > 0) interest--
            this.interest.set(a, interest)
        }
    }

    needToUpdateAgents() {
        if (!this.agentsInView.length) return true

        const a = this.agentsInView[0]
        if (this.agent.location.distQuad(a.location) > this.radiusQuad) return true

        const v = this.interest.get(a)
        return v <= 0
    }

    updateAgents(pool) {
        const agents = pool
            .getInRadius(this.agent.location, this.radius)
            .filter(a => a !== this.agent)
            .filter(a => !this.interest.has(a))
        if (!agents.length) return

        this.agentsInView = chance.pickset(agents, 1)
        this.agentsInView.forEach(a => {
            if (!this.interest.has(a)) {
                this.interest.set(a, this.initialInterest)
            }
        })
    }
}