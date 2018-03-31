import ClearableView from './ClearableView'

export default class EmittersView extends ClearableView {
    constructor({...args}) {
        super(args)
    }

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