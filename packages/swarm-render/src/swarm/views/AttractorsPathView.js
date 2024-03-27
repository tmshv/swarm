import ClearableView from './ClearableView'

export default class AttractorsPathView extends ClearableView {
    render() {
        const ctx = this.draw.context

        const coords = this.simulation.env.attractors
            .map(a => {
                return a.location
            })

        // const alpha = a.power / 200
        const alpha = 1
        ctx.strokeStyle = `rgba(200, 200, 200, ${alpha})`

        this.draw.path(coords)
    }
}