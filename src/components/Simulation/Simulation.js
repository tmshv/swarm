import React, {Component} from 'react'

export default class Simulation extends Component {
    constructor(...args) {
        super(...args)

        this.onRef = this.onRef.bind(this)
        this.onUpdate = this.onUpdate.bind(this)
    }

    onRef(canvas) {
        this.context = canvas.getContext('2d')
    }

    onUpdate() {
        const ctx = this.context
        // ctx.fillRect(0, 0, example.width, example.height);
        // const {width, height} = this.props

        // ctx.fillStyle = '#AF5200';
        // ctx.fillStyle = 'rgba(200, 0, 0, 0.05)'
        ctx.fillStyle = 'rgba(200, 0, 0, 1)'
        // ctx.fillRect(20, 20, 256, 256);
        // ctx.clearRect(0, 0, width, height);

        this.sim
            .getAgents()
            .forEach(agent => {
                ctx.fillRect(agent.location.x, agent.location.y, 1, 1);
            })
    }

    componentDidMount() {
        const {simulation} = this.props
        this.sim = simulation
        this.sim.run(this.onUpdate)
    }

    render() {
        const {width, height} = this.props

        return (
            <div>
                <canvas ref={this.onRef} width={width} height={height}/>
            </div>
        )
    }
}