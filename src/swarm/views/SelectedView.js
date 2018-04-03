import ClearableView from './ClearableView'
import SelectedAgentView from './SelectedAgentView'

export default class SelectedView extends ClearableView {
    constructor({...args}) {
        super({
            ...args,
            clear: true,
        })

        this.agentsView = new SelectedAgentView(args)
        this.currentView = null
    }

    select(options) {
        if (this.agentsView.select(options)) {
            this.currentView = this.agentsView
            return
        }

        this.currentView = null
    }

    render() {
        if (this.currentView) this.currentView.render()
    }
}