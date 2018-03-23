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

    setAgents(agentPool) {
        this.agents = agentPool
    }

    setEnvironment(env) {
        this.env = env
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
                a.run({
                    agentsPool: this.agents,
                    environment: this.env,
                })
            })

        this.callback()
    }
}