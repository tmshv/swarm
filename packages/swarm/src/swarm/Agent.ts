// @ts-nocheck

import Channel from '~/src/lib/Channel'
import AgentEvent from './AgentEvent'
import Vehicle from './Vehicle'
import Vector from './Vector'
import Behavior from './behaviors/Behavior'
import Tag from './Tag'

export default class Agent extends Vehicle {
    get isAlive() {
        return this._alive
    }

    get isLocked() {
        return this._locked
    }

    get track() {
        return this._track
    }

    private _locked: boolean
    private _alive: boolean
    public events: Channel
    private behavior: Behavior
    private namedBehaviors: Map<string, Behavior>

    private _stepForces: any[]
    private _stepAcceleration: Vector

    private _saveTrackPeriod: number
    private __saveTrackCount: number
    private _track: any[]
    private tags: Map<string, Tag>

    constructor({behavior}) {
        super()
        behavior.setAgent(this)

        this._locked = false
        this._alive = true
        this.events = new Channel()
        this.behavior = behavior
        this.namedBehaviors = new Map()

        this._stepForces = []
        this._stepAcceleration = new Vector(0, 0)

        this._saveTrackPeriod = 10
        this.__saveTrackCount = 0
        this._track = []
        this.tags = new Map()
    }

    saveTrack() {
        if (this.__saveTrackCount === 0) {
            this.__saveTrackCount = this._saveTrackPeriod
            this._track.push(this.location.clone())
        }

        this.__saveTrackCount--
    }

    force(vector) {
        this._stepForces.push(vector)
        return super.force(vector)
    }

    lock() {
        this._locked = true
    }

    unlock() {
        this._locked = false
    }

    move() {
        if (this._locked) return
        super.move()
        this.saveTrack()
    }

    addTag(tag, value) {
        this.tags.set(tag, value)

        return this
    }

    getTag(tag) {
        return this.tags.get(tag)
    }

    die() {
        this._alive = false
        this.events.get(AgentEvent.DIE).trigger(this)
    }

    addBehavior(name, behavior) {
        behavior.setAgent(this)
        this.namedBehaviors.set(name, behavior)
    }

    getBehavior(name) {
        return this.namedBehaviors.get(name)
    }

    run(options) {
        this._stepForces.length = 0
        this._stepAcceleration.setFrom(this.acceleration)

        this.behavior.run(options)
    }
}
