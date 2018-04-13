import Behaviour from './Behaviour'

export default class TtlBehavior extends Behaviour {
    init({ttl}) {
        this.ttl = ttl
    }

    run() {
        if(this.agent.isLocked) return

        this.ttl--

        if (this.ttl === 0) {
            this.agent.die()
        }
    }
}