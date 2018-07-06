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
        let status = false
        this.behaviours.forEach(x => {
            status = x.run(options)
        })

        return status
    }
}