import SimulationView from './SimulationView'

export default class AgentsView extends SimulationView {
    render() {
        const ctx = this.draw.context

        // this.renderTrack()
        this.simulation
            .getAgents()
            .forEach(agent => {
                const deviant = agent.getTag('deviant')

                const s = deviant
                    ? 4
                    : 2

                ctx.fillStyle = deviant
                    ? `rgb(200, 0, 200)`
                    : `rgb(200, 0, 0)`

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