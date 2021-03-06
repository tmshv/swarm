import Shape from './Shape'

export default class PathShape extends Shape {
    init({coords, fill}) {
        this.coords = coords
        this.fill = fill
    }

    draw(context) {
        const coords = this.coords
        const length = coords.length
        if (length < 2) return

        context.beginPath()
        const {x, y} = coords[0]
        context.moveTo(x, y)

        for (let i = 1; i < length; i++) {
            const {x, y} = coords[i]
            context.lineTo(x, y)
        }

        if (this.fill) {
            context.fill()
        } else {
            context.stroke()
        }
    }
}