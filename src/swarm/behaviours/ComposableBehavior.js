import Behaviour from './Behaviour'

export default class ComposableBehavior extends Behaviour {
    static compose(...behaviours) {
        return new ComposableBehavior({behaviours})
    }

    init({behaviours}) {
        this.behaviours = behaviours
    }

    setAgent(agent) {
        this.behaviours.forEach(x => x.setAgent(agent))
    }

    run(options) {
        this.behaviours.forEach(x => x.run(options))
    }
}