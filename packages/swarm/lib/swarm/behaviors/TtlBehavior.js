import Behavior from './Behavior'

export default class TtlBehavior extends Behavior {
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