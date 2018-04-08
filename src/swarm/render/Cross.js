import Shape from './Shape'

export default class Cross extends Shape {
    init({center, size}) {
        this.center = center
        this.size = size
    }

    render(context) {
        const size = this.size
        const x = this.center.x
        const y = this.center.y

        context.beginPath()
        context.moveTo(x - size, y - size)
        context.lineTo(x + size, y + size)
        context.stroke()

        context.beginPath()
        context.moveTo(x - size, y + size)
        context.lineTo(x + size, y - size)
        context.stroke()
    }
}