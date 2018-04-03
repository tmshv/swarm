import ClearableView from './ClearableView'
import SelectedAgentView from './SelectedAgentView'
import Vector from '../Vector'
import SelectedEmitterView from './SelectedEmitterView'

export default class SelectedView extends ClearableView {
    constructor({...args}) {
        super({
            ...args,
            clear: true,
        })

        this.views = [
            new SelectedAgentView(args),
            new SelectedEmitterView(args),
        ]

        this.currentView = null
    }

    select({point}) {
        if (point) {
            const coord = new Vector(point.x, point.y)

            for (let view of this.views) {
                if (view.select(coord)) {
                    this.currentView = view
                    return
                }
            }
        }

        this.currentView = null
    }

    render() {
        if (this.currentView) this.currentView.render()
    }
}