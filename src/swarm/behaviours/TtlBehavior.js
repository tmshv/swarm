import Behaviour from './Behaviour'

export default class TtlBehavior extends Behaviour {
    init({ttl}) {
        this.ttl = ttl
    }

    run() {
        this.ttl--

        if (this.ttl === 0) {
            this.agent.die()
        }
    }
}