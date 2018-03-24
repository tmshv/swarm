import Signal from '../lib/Signal'

export default class Simulation {
    constructor() {
        this.loop = this.loop.bind(this)

        this.isRunning = false
        this.env = null
        this.agents = null

        this.events = {
            run: new Signal(),
            stop: new Signal(),
            update: new Signal(),
        }
    }

    getAgents() {
        return this.agents.agents
    }

    getNearestAgent(x, y) {
        return this.agents.agents[0]
    }

    setAgents(agentPool) {
        this.agents = agentPool
    }

    setEnvironment(env) {
        this.env = env
    }

    run() {
        this.isRunning = true
        requestAnimationFrame(this.loop)

        this.events.run.trigger(this)
    }

    stop() {
        this.isRunning = false
        this.events.stop.trigger(this)
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

        this.events.update.trigger(this)
    }
}