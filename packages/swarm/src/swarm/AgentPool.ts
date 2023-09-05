import QuadTree from './QuadTree'
import Vector from './Vector'
import AgentEvent from './AgentEvent'
import Agent from './Agent'

export default class AgentPool {
    get size() {
        return this.agents.length
    }

    private _poolLimit: number
    public agents: Agent[]
    private inactiveAgents: Agent[]

    constructor(limit = 1000) {
        // this.store = new QuadTree()

        this._poolLimit = limit
        this.agents = []
        this.inactiveAgents = []
    }

    // getAgent() {
    //     return this.store.getItem()
    // }

    addAgent(agent: Agent) {
        if (this.agents.length >= this._poolLimit) return

        this.agents.push(agent)

        agent.events.get(AgentEvent.DIE).on(() => {
            this.inactiveAgents.push(agent)
            this.agents = this.agents.filter(x => agent !== x)
        })

        // return this.store.addItem()
    }

    getAgents(): Agent[] {
        return this.agents
    }

    getNearest(coord: Vector, radius: number): Agent[] {
        let minDist = radius ** 2
        let agent = null
        this.agents.forEach(a => {
            const d = Vector.sub(a.location, coord).lengthSquared
            if (d < minDist) {
                minDist = d
                agent = a
            }
        })
        return agent
    }

    getInRadius(coord: Vector, radius: number): Agent[] {
        const radiusQuad = radius ** 2

        return this.agents.filter(a => coord.distQuad(a.location) < radiusQuad)
    }
}
