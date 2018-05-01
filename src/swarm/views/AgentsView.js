import SimulationView from './SimulationView'

export default class AgentsView extends SimulationView {
    render() {
        const ctx = this.draw.context
        ctx.fillStyle = `rgba(200, 0, 0, ${1})`

        // this.renderTrack()
        const s = 2
        this.simulation
            .getAgents()
            .forEach(agent => {
                this.draw.rect(agent.location, s, s)
            })
    }

    renderTrack() {
        const ctx = this.draw.context
        ctx.strokeStyle = `rgba(200, 0, 0, ${0.5})`

        this.simulation.agents
            .agents
            .forEach(agent => {
                this.draw.path(agent.track)
            })

        this.simulation.agents
            .inactiveAgents
            .forEach(agent => {
                this.draw.path(agent.track)
            })
    }
}