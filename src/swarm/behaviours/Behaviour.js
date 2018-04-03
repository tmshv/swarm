export default class Behaviour {
    constructor(options) {
        this.init(options)
    }

    init({accelerate}) {
        this.accelerate = accelerate
    }

    setAgent(agent) {
        this.agent = agent
    }

    seek(target) {
        this.agent.seek(target)
    }

    seekAccelerated(target) {
        this.agent.seek(target, this.accelerate)
    }

    forceAccelerated(force) {
        this.agent.force(force
            .normalize()
            .mult(this.accelerate)
        )
        return force
    }

    run(options) {
        throw new Error('Behavior::run is not overrided')
    }
}