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
        // return this.store.addItem()
    }
}