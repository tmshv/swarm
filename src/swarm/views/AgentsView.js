import SimulationView from './SimulationView'

export default class AgentsView extends SimulationView {
    constructor({
        fill,
        size,
        ...args
    }) {
        super(args)

        this.fill = fill
        this.size = size
    }

    render(options) {
        const ctx = this.draw.context

        // this.renderTrack()
        this.simulation
            .getAgents()
            .forEach(agent => {
                const s = this.size(agent, options)
                ctx.fillStyle = this.fill(agent, options)

                this.draw.circleCenterFill(agent.location, s)
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