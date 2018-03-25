import React from 'react'
import {render} from 'react-dom'
import Simulation from '../swarm/Simulation'
import AgentPool from '../swarm/AgentPool'
import EnvironmentAgent from '../swarm/EnvironmentAgent'
import App from '../components/App/App'
import Environment from '../swarm/Environment'

import './index.less'
import Attractor from '../swarm/Attractor'
import Id from '../swarm/Id'
import Emitter from '../swarm/Emitter'

const width = 500
const height = 500

function main() {
    const simulation = createSimulation()
    const mountElement = document.querySelector('#app')

    simulation.run()

    const props = {
        simulation,
        width,
        height,
    }

    render(<App {...props}/>, mountElement)
}

function createSimulation() {
    const pool = createAgentPool()
    const env = createEnvironment()
    const emitter = createEmitter()

    const s = new Simulation()
    s.setAgents(pool)
    s.setEnvironment(env)
    s.addEmitter(emitter)

    return s
}

function createEmitter() {
    const x = 250
    const y = 250

    return new Emitter({
        x,
        y,
        period: 1000,
        amount: 1,
        factory: createAgent,
    })
}

function createAgentPool() {
    const pool = new AgentPool()
    // for (let i = 0; i < 10; i++) {
    //     pool.addAgent(createAgentInRandomCoords(width, height))
    // }
    return pool
}

function createEnvironment() {
    const env = new Environment()

    for (let i = 0; i < 10; i++) {
        env.addAttractor(createAttractor())
    }

    return env
}

function createAgentInRandomCoords(width, height) {
    const {x, y} = randomCoord([width, height])

    const agent = new EnvironmentAgent()
    agent.location.set(x, y)
    return agent
}

function createAgent(loc) {
    const agent = new EnvironmentAgent()
    agent.location.set(loc.x, loc.y)
    return agent
}

function createAttractor() {
    const {x, y} = randomCoord([width, height])

    const power = 10 + Math.random() * 50
    const id = Id.get('attractor')
    return new Attractor({id, x, y, power})
}

function randomCoord([maxX, maxY]) {
    const x = Math.random() * maxX
    const y = Math.random() * maxY

    return {x, y}
}

main()