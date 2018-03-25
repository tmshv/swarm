import Signal from '../lib/Signal'
import Vector from './Vector'

export default class Simulation {
    constructor() {
        this.loop = this.loop.bind(this)

        this.isRunning = false
        this.env = null
        this.agents = null
        this.emitters = []

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
        let minDist = 10000000
        let agent = null
        this.agents.agents.forEach(a => {
            const d = (new Vector(x, y))
                .sub(a.location)
                .lengthQuad
            if (d < minDist) {
                minDist = d
                agent = a
            }
        })
        return agent
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

        this.emitters.forEach(x => x.run())
    }

    stop() {
        this.isRunning = false
        this.events.stop.trigger(this)

        this.emitters.forEach(x => x.stop())
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

    addEmitter(emitter) {
        this.emitters.push(emitter)

        emitter.events.emit.on(agents => {
            agents.forEach(x => this.agents.addAgent(x))
        })
    }
}