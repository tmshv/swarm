import SimulationView from './SimulationView'

export default class EmittersView extends SimulationView {
    render() {
        const ctx = this.draw.context

        this.simulation.emitters.forEach(e => {
            ctx.strokeStyle = 'rgba(0, 200, 0, 1)'
            ctx.fillStyle = 'rgba(0, 200, 0, 1)'

            this.draw.cross(e.location, 5)
            // ctx.fill()
        })
    }
}