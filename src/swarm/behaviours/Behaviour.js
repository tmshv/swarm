export default class Behaviour {
    setAgent(agent) {
        this.agent = agent
    }

    run(options) {
        throw new Error('Behavior::run is not overrided')
    }
}