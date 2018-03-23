export default class Simulation {
    constructor() {
        this.loop = this.loop.bind(this)

        this.isRunning = false
        this.env = null
        this.agents = null
    }

    getAgents() {
        return this.agents.agents
    }

    addAgents(agentPool) {
        this.agents = agentPool
    }

    addLayer(layer) {

    }

    run(callback) {
        this.callback = callback
        this.isRunning = true
        requestAnimationFrame(this.loop)
    }

    stop() {
        this.isRunning = false
    }

    loop() {
        if (this.isRunning) requestAnimationFrame(this.loop)

        // simulate
        this.getAgents()
            .forEach(a => {
                a.run(this.agents, this.env)
            })

        this.callback()
    }
}