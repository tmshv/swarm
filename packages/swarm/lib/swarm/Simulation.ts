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
    private env: Environment | null
    private agents: AgentPool | null
    private emitters: Emitter[]
    private _layers: Map<string, Layer>
    private viewFactory: any
    private variables: any // object

    constructor() {
        this._frame = 0
        this.env = null
        this.agents = null
        this.emitters = []
        this._layers = new Map()
        this.variables = {}
    }

    setVariables(x: any) {
        this.variables = x
    }

    layer(name: string) {
        if (this._layers.has(name)) return this._layers.get(name)

        const layer = new Layer({ name })
        this._layers.set(name, layer)
        return layer
    }

    getAgents() {
        return this.agents!.agents
    }

    setAgents(agentPool: AgentPool) {
        this.agents = agentPool
    }

    setEnvironment(env: Environment) {
        this.env = env
    }

    step() {
        const variables = this.variables
        const agents = this.getAgents()

        // Update env
        this.emitters.forEach(x => x.run(variables))
        this.env!.run(variables)

        // Update agents
        agents.forEach(a => {
            a.run({
                agentsPool: this.agents,
                environment: this.env,
                variables,
            })
        })

        // Apply agents actions
        agents.forEach(a => {
            a.move()
        })

        this._frame++
    }

    addEmitter(emitter: Emitter) {
        this.emitters.push(emitter)

        emitter.events.emit.on(agents => {
            agents.forEach(x => this.agents!.addAgent(x))
        })
    }

    setViewFactory(factory: any) {
        this.viewFactory = factory
    }

    createView(params: any) {
        return this.viewFactory({
            ...params,
            simulation: this,
        })
    }
}
