import React, {Component} from 'react'
import Render from '../../lib/Render'
import Canvas from '../Canvas/Canvas'
import AgentsView from '../../swarm/views/AgentsView'

export default class Simulation extends Component {
    constructor(...args) {
        super(...args)

        this.onRef = this.onRef.bind(this)
        this.onUpdate = this.onUpdate.bind(this)
    }

    onRef(canvas) {
        this.context = canvas.context
    }

    onUpdate() {
        this.view.render()
    }

    componentDidMount() {
        const {width, height, simulation} = this.props
        this.sim = simulation
        this.sim.events.update.on(this.onUpdate)

        this.view = new AgentsView({
            draw: new Render(this.context, width, height),
            simulation: this.sim,
        })
    }

    componentWillUnmount() {
        this.sim.events.run.off(this.onUpdate)
        this.sim = null
    }

    render() {
        return (
            <Canvas ref={this.onRef} {...this.props}/>
        )
    }
}