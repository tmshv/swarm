import View from './View'

export default class AgentsView extends View {
    render() {
        const ctx = this.draw.context

        const s = 1
        this.simulation
            .getAgents()
            .forEach(agent => {
                let alpha = agent.ttl / 1000
                ctx.fillStyle = 'rgba(200, 0, 0, 0.05)'

                this.draw.rectCenter(agent.location, s, s)
            })
    }
}