export default class View {
    static join(views) {
        const v = new View({})

        v.render = () => {
            for (let view of views) {
                view.render()
            }
        }

        return v
    }

    constructor({draw, simulation}) {
        this.draw = draw
        this.simulation = simulation
    }

    translate(coord) {
        if (!this.draw) return

        this.draw.matrix.reset()
        this.draw.matrix.translate(coord.x, coord.y)
    }

    run(options) {
        if (!this.shouldRender()) return

        this.beforeRender()
        this.render()
        this.afterRender()
    }

    shouldRender() {
        return true
    }

    beforeRender() {

    }

    afterRender() {

    }

    render() {

    }
}