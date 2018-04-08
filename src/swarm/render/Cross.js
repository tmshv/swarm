import Shape from './Shape'

export default class Cross extends Shape {
    init({size}) {
        this.size = size
    }

    draw(context) {
        const size = this.size

        context.beginPath()
        context.moveTo(-size, -size)
        context.lineTo(size, size)
        context.stroke()

        context.beginPath()
        context.moveTo(-size, size)
        context.lineTo(size, -size)
        context.stroke()
    }
}