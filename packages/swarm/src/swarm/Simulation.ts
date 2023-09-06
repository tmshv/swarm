// @ts-nocheck

import UpdateChannel from './channels/UpdateChannel'
import { Layer } from './Layer'
import Environment from './Environment'
import AgentPool from './AgentPool'
import Emitter from './Emitter'

export default class Simulation {
    get frame() {
        return this._frame
    }

    get environment() {
        return this.env
    }

    private _frame: number
    public isRunning: boolean
    private env: Environment
    private agents: AgentPool
    private emitters: Emitter[]
    private channels: UpdateChannel
    private _animationFrameRequestId: number
    private _layers: Map<string, Layer>
    private viewFactory: any
    private variables: any // object

    constructor() {
        this.loop = this.loop.bind(this)

        this._frame = 0

        this.isRunning = false
        this.env = null
        this.agents = null
        this.emitters = []

        this.channels = new UpdateChannel(this)
        this._animationFrameRequestId = null

        this._layers = new Map()

        this.variables = {}
    }

    setVariables(x) {
        this.variables = x
    }

    layer(name) {
        if (this._layers.has(name)) return this._layers.get(name)

        const layer = new Layer({ name })
        this._layers.set(name, layer)
        return layer
    }

    getAgents() {
        return this.agents.agents
    }

    setAgents(agentPool) {
        this.agents = agentPool
    }

    setEnvironment(env: Environment) {
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
        const variables = this.variables
        try {
            const agents = this.getAgents()

            this.emitters.forEach(x => x.run(variables))
            this.env.run(variables)

            agents.forEach(a => {
                a.run({
                    agentsPool: this.agents,
                    environment: this.env,
                    variables,
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
