import Behavior from './Behavior'

export default class ComposableBehavior extends Behavior {
    static compose(...behaviors) {
        return new ComposableBehavior({behaviors})
    }

    init({behaviors}) {
        this.behaviors = behaviors
    }

    setAgent(agent) {
        this.behaviors.forEach(x => x.setAgent(agent))
    }

    run(options) {
        let status = false
        this.behaviors.forEach(x => {
            status = x.run(options)
        })

        return status
    }
}