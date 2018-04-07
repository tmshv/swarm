import SimulationView from './SimulationView'

export default class AgentsView extends SimulationView {
    render() {
        const ctx = this.draw.context
        ctx.fillStyle = `rgba(200, 0, 0, ${1})`

        const s = 2
        this.simulation
            .getAgents()
            .forEach(agent => {
                this.draw.rect(agent.location, s, s)
            })
    }
}