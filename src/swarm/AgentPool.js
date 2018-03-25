import QuadTree from './QuadTree'

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
}