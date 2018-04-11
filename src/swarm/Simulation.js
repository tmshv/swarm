import UpdateChannel from './channels/UpdateChannel'

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

        this.channels = new UpdateChannel(this)
        this._animationFrameRequestId = null
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
        this._animationFrameRequestId = requestAnimationFrame(this.loop)

        // this.events.run.trigger(this)

        return this
    }

    stop() {
        this.isRunning = false
        cancelAnimationFrame(this._animationFrameRequestId)

        // this.events.stop.trigger(this)
    }

    loop() {
        this.step()
        if (this.isRunning) {
            this._animationFrameRequestId = requestAnimationFrame(this.loop)
        }
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

            this.channels.update.trigger(this)
        } catch (e) {
            console.error(e)
            console.warn('Stopping simulation cause error')
            this.stop()
        }

        this._frame++
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