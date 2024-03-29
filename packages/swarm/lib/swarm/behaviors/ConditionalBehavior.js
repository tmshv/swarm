import Behavior from './Behavior'

export default class ConditionalBehavior extends Behavior {
    constructor({predicate, trueBranch, falseBranch, ...options}) {
        super(options)

        this.predicate = predicate
        this.trueBranch = trueBranch
        this.falseBranch = falseBranch
    }

    setAgent(agent) {
        this.trueBranch = this.branch(this.trueBranch)
        this.falseBranch = this.branch(this.falseBranch)

        this.predicate.setAgent(agent)
        this.trueBranch.setAgent(agent)
        this.falseBranch.setAgent(agent)
    }

    run(options) {
        const branch = this.predicate.run(options)
            ? this.trueBranch
            : this.falseBranch
        return branch.run(options)
    }

    branch(value) {
        return typeof value === 'string'
            ? this.agent.getBehavior(value)
            : value
    }
}