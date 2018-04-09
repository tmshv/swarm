import EnvironmentView from './EnvironmentView'
import Vector from '../Vector'

const textOffset = new Vector(20, 10)

export default class AttractorsView extends EnvironmentView {
    render() {
        const ctx = this.draw.context

        this.environment.attractors.forEach(a => {
            const location = a.location

            const alpha = a.power / 200
            // const alpha = 1

            const style = `rgba(20, 20, 0, ${1})`
            ctx.lineWidth = 2
            ctx.strokeStyle = style
            ctx.fillStyle = style

            // const s = 20
            const s = 10 + (a.power / 60) * 2
            this.draw.cross(location, s, s)

            this.draw.text(location, `${a.agents.length}`, textOffset)
        })
    }
}