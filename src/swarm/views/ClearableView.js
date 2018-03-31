import View from './View'

export default class ClearableView extends View {
    constructor({clear, ...args}) {
        super(args)

        this.clear = clear
    }

    beforeRender() {
        if (this.clear) this.draw.clear()
        super.beforeRender()
    }
}