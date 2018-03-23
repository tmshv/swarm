import React from 'react'
import {render} from 'react-dom'
import Simulation from '../swarm/Simulation'
import AgentPool from '../swarm/AgentPool'
import Agent from '../swarm/Agent'
import App from '../components/App/App'
import Environment from '../swarm/Environment'

const width = 500
const height = 500

function main() {
    const simulation = createSimulation()
    const mountElement = document.querySelector('#app')

    const props = {
        simulation,
        width,
        height,
    }

    render(<App {...props}/>, mountElement)
}

function createSimulation() {
    const pool = new AgentPool()
    const env = new Environment()

    for (let i = 0; i < 100; i++) {
        pool.addAgent(createAgent(width, height))
    }

    const s = new Simulation()
    s.setAgents(pool)
    s.setEnvironment(env)

    return s
}

function createAgent(width, height) {
    const x = Math.random() * width
    const y = Math.random() * height

    const agent = new Agent()
    agent.location.set(x, y)
    return agent
}

main()