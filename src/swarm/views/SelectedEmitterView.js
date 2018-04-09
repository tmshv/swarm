import View from './View'

export default class SelectedEmitterView extends View {
    constructor({item, ...args}) {
        super({
            ...args,
            clear: true,
        })

        this.item = item
    }

    render() {
        const ctx = this.draw.context

        const radius = 25
        const location = this.item.location
        const angle = -(this.item.counter / this.item.period) * Math.PI * 2

        ctx.lineWidth = 1
        ctx.strokeStyle = 'rgba(0, 255, 0, 1)'
        this.draw.circleCenter(location, radius)

        ctx.lineWidth = 3
        ctx.strokeStyle = 'rgba(0, 255, 0, 1)'
        this.draw.arcCenter(location, radius, 0, angle)
    }
}