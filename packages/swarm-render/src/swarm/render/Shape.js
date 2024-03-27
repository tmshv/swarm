export default class Shape {
    constructor(options) {
        this.init(options)
    }

    init() {

    }

    render(context, {translate, rotate, scale}) {
        context.save()

        if (translate) context.translate(translate.x, translate.y)
        if (rotate) context.rotate(rotate)
        if (scale) context.scale(scale, scale)

        this.draw(context)
        context.restore()
    }

    draw(context) {

    }
}