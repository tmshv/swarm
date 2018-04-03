import View from './View'

export default class AgentsView extends View {
    constructor({clear, ...args}) {
        super(args)

        this.clear = clear
    }
    render() {
        if (this.clear) this.draw.clear()

        const ctx = this.draw.context
        ctx.fillStyle = `rgba(200, 0, 0, ${1})`

        const s = 1
        this.simulation
            .getAgents()
            .forEach(agent => {
                this.draw.rect(agent.location, s, s)
            })
    }
}