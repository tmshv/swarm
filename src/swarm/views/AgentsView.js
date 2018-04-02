import View from './View'

export default class AgentsView extends View {
    constructor({clear, ...args}) {
        super(args)

        this.clear = clear
    }
    render() {
        if (this.clear) this.draw.clear()

        const ctx = this.draw.context

        const s = 1
        this.simulation
            .getAgents()
            .forEach(agent => {
                let alpha = agent.ttl / 10000
                ctx.fillStyle = `rgba(200, 0, 0, ${alpha})`

                this.draw.rectCenter(agent.location, s, s)
            })
    }
}