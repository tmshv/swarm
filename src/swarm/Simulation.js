import Signal from '../lib/Signal'
import Vector from './Vector'

export default class Simulation {
    get frame() {
        return this._frame
    }

    get environment() {
        return this.env
    }

    constructor() {
        this.loop = this.loop.bind(this)

        this._frame = 0

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
        this.step()
        this._frame++
        if (this.isRunning) requestAnimationFrame(this.loop)
    }

    step() {
        try {
            const agents = this.getAgents()

            this.emitters.forEach(x => x.run())
            this.env.run()

            agents.forEach(a => {
                a.run({
                    agentsPool: this.agents,
                    environment: this.env,
                })
            })
            agents.forEach(a => {
                a.move()
            })

            this.events.update.trigger(this)
        } catch (e) {
            console.error(e)
            console.warn('Stopping simulation cause error')
            this.stop()
        }
    }

    addEmitter(emitter) {
        this.emitters.push(emitter)

        emitter.events.emit.on(agents => {
            agents.forEach(x => this.agents.addAgent(x))
        })
    }

    setViewFactory(factory) {
        this.viewFactory = factory
    }

    createView(params) {
        return this.viewFactory({
            ...params,
            simulation: this,
        })
    }
}