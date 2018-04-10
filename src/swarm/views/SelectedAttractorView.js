import View from './View'

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
        this.item.getAssociatedEmitters()
            .forEach(e => {
                let count = this.item.getAssociatedEmitterCount(e)
                ctx.lineWidth = Math.min(5, Math.ceil(count / 10))
                this.draw.path([coord, e.location])
            })

        ctx.strokeStyle = `rgb(255, 0, 0)`
        ctx.lineWidth = 4
        this.draw.cross(coord, 15)
    }
}