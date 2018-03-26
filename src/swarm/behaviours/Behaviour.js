export default class Behaviour {
    constructor({accelerate}) {
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

    run(options) {
        throw new Error('Behavior::run is not overrided')
    }
}