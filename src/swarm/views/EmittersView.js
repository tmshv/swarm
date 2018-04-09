import SimulationView from './SimulationView'

export default class EmittersView extends SimulationView {
    render() {
        const ctx = this.draw.context

        this.simulation.emitters.forEach(e => {
            const color = (e.period - e.counter) < 5
                ? 'rgba(0, 255, 0, 1)'
                : 'rgba(0, 200, 0, 1)'

            ctx.strokeStyle = color
            ctx.fillStyle = color

            this.draw.circleCenter(e.location, 3)
            ctx.fill()
        })
    }
}