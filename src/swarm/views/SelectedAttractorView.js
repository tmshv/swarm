import View from './View'
import Line from '../Line'

export default class SelectedAttractorView extends View {
    constructor({item, ...args}) {
        super({
            ...args,
            clear: true,
        })

        this.item = item
    }

    render() {
        const coord = this.item.location
        const ctx = this.draw.context

        ctx.strokeStyle = `rgba(0, 0, 0, 0.5)`
        ctx.lineWidth = 1
        this.item.getAssociatedEmitters()
            .forEach(e => {
                this.draw.line(new Line(coord, e.location))
            })

        ctx.strokeStyle = `rgb(255, 0, 0)`
        ctx.lineWidth = 4
        this.draw.cross(coord, 15)
    }
}