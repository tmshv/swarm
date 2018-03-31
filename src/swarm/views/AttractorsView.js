import ClearableView from './ClearableView'

export default class AttractorsView extends ClearableView {
    constructor({...args}) {
        super(args)
    }

    render() {
        const ctx = this.draw.context

        this.simulation.env.attractors.forEach(a => {
            const alpha = a.power / 200
            // const alpha = 1

            const style = `rgba(20, 20, 0, ${alpha})`
            ctx.strokeStyle = style
            ctx.fillStyle = style

            // const s = 20
            const s = 1 + (a.power / 60) * 2
            this.draw.plus(a.location, s, s)
        })
    }
}