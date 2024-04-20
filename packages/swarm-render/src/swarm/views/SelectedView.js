import View from './View'
import SelectedObstacleView from './SelectedObstacleView'
import { Agent, Emitter, Attractor, Obstacle } from '@tmshv/swarm'
import SelectedAgentView from './SelectedAgentView'
import SelectedEmitterView from './SelectedEmitterView'
import SelectedAttractorView from './SelectedAttractorView'

export default class SelectedView extends View {
    constructor({ updateSignal, ...args }) {
        super({
            ...args,
            clear: true,
        })

        this.updateSignal = updateSignal
        this.updateSignal.on(item => {
            if (!item) {
                this.currentView = null
                return
            }

            if (item instanceof Obstacle) {
                this.currentView = new SelectedObstacleView({
                    item,
                })
            } else if (item instanceof Agent) {
                this.currentView = new SelectedAgentView({
                    item,
                })
            } else if (item instanceof Emitter) {
                this.currentView = new SelectedEmitterView({
                    item,
                })
            } else if (item instanceof Attractor) {
                this.currentView = new SelectedAttractorView({
                    item,
                })
            }

            if (this.currentView) {
                this.currentView.init(this.initOptions)
                this.applyMatrixToCurrentView()
            }
        })

        this.currentView = null
    }

    applyMatrix(matrix) {
        this._matrix = matrix
        if (this.currentView) this.applyMatrixToCurrentView()
    }

    applyMatrixToCurrentView() {
        this.currentView.draw.matrix.reset()
        this.currentView.draw.matrix.transform(
            this._matrix.a, this._matrix.b, this._matrix.c,
            this._matrix.d, this._matrix.e, this._matrix.f,
        )
    }

    render() {
        if (this.currentView) this.currentView.render()
    }
}
