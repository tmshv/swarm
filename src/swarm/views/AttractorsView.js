import EnvironmentView from './EnvironmentView'

export default class AttractorsView extends EnvironmentView {
    render() {
        const ctx = this.draw.context

        this.environment.attractors.forEach(a => {
            const alpha = a.power / 200
            // const alpha = 1

            const style = `rgba(20, 20, 0, ${alpha})`
            ctx.strokeStyle = style
            ctx.fillStyle = style

            // const s = 20
            const s = 4 + (a.power / 60) * 2
            this.draw.plus(a.location, s, s)
        })
    }
}