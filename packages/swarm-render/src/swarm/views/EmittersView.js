import SimulationView from './SimulationView'

export default class EmittersView extends SimulationView {
    render() {
        const ctx = this.draw.context

        this.simulation.emitters.forEach(e => {
            ctx.strokeStyle = `rgba(250, 0, 250, 1)`
            ctx.fillStyle = null

            this.draw.circleCenter(e.location, 2)
        })
    }
}