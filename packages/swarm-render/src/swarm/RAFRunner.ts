import { Signal, Simulation } from '@tmshv/swarm'

export default class RAFRunner {
    private _swarm: Simulation
    private _animationFrameRequestId: number
    public isRunning: boolean
    public readonly updateSignal: Signal<number>
    public readonly startSignal: Signal<number>
    public readonly stopSignal: Signal<number>

    constructor(swarm: Simulation) {
        this._swarm = swarm
        this.loop = this.loop.bind(this)
        this.isRunning = false
        this.updateSignal = new Signal()
        this.startSignal = new Signal()
        this.stopSignal = new Signal()
        this._animationFrameRequestId = null
    }

    start() {
        this.isRunning = true
        this._animationFrameRequestId = requestAnimationFrame(this.loop)

        this.startSignal.trigger(this._swarm.frame)
    }

    stop() {
        this.isRunning = false
        cancelAnimationFrame(this._animationFrameRequestId)

        this.stopSignal.trigger(this._swarm.frame)
    }

    private loop() {
        this._swarm.step()
        this.updateSignal.trigger(this._swarm.frame)
        this._animationFrameRequestId = requestAnimationFrame(this.loop)
    }
}
