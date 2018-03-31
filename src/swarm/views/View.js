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

    run(options) {
        this.beforeRender()
        this.render()
        this.afterRender()
    }

    beforeRender() {

    }

    afterRender() {

    }

    render() {

    }
}