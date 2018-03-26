import QuadTree from './QuadTree'
import Vector from './Vector'

export default class AgentPool {
    constructor() {
        // this.store = new QuadTree()

        this.agents = []
    }

    // getAgent() {
    //     return this.store.getItem()
    // }

    addAgent(agent) {
        this.agents.push(agent)

        agent.events.die.on(() => {
            this.agents = this.agents.filter(x => agent !== x)
        })

        // return this.store.addItem()
    }

    getNearest(x, y) {
        let minDist = 10000000
        let agent = null
        this.agents.forEach(a => {
            const d = (new Vector(x, y))
                .sub(a.location)
                .lengthQuad
            if (d < minDist) {
                minDist = d
                agent = a
            }
        })
        return agent
    }

    getInRadius(coord, radius) {
        const radiusQuad = radius ** 2

        return this.agents.filter(a => coord.distQuad(a.location) < radiusQuad)
    }
}