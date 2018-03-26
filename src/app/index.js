import React from 'react'
import {render} from 'react-dom'
import Simulation from '../swarm/Simulation'
import AgentPool from '../swarm/AgentPool'
import Agent from '../swarm/Agent'
import App from '../components/App/App'
import Environment from '../swarm/Environment'

import './index.less'
import Attractor from '../swarm/Attractor'
import Id from '../swarm/Id'
import Emitter from '../swarm/Emitter'
import InteractAgentsBehaviour from '../swarm/behaviours/InteractAgentsBehaviour'
import InteractEnvironmentBehaviour from '../swarm/behaviours/InteractEnvironmentBehaviour'
import Vector from '../swarm/Vector'
import RandomWalkBehaviour from '../swarm/behaviours/RandomWalkBehaviour'

const width = 1400
const height = 800

function main() {
    const simulation = createSimulation()
    const mountElement = document.querySelector('#app')

    simulation.run()

    const props = {
        simulation,
        width,
        height,
        devicePixelRatio: window.devicePixelRatio
    }

    render(<App {...props}/>, mountElement)
}

function createSimulation() {
    const pool = createAgentPool()
    const env = createEnvironment()

    const s = new Simulation()
    s.setAgents(pool)
    s.setEnvironment(env)
    s.addEmitter(createEmitter({x: 250, y: 250}))
    s.addEmitter(createEmitter({x: 450, y: 150}))

    return s
}

function createEmitter({x, y}) {
    return new Emitter({
        x,
        y,
        period: 2000,
        amount: 3,
        factory: createAgent,
    })
}

function createAgentPool() {
    const pool = new AgentPool()
    for (let i = 0; i < 10; i++) {
        pool.addAgent(createAgentInRandomCoords(width, height))
    }
    return pool
}

function createEnvironment() {
    const env = new Environment()

    const w = 50
    const h = 50

    const ws = width / w
    const hs = width / h

    for (let x = ws / 2; x < width; x += ws) {
        for (let y = hs / 2; y < height; y += hs) {
            env.addAttractor(createAttractor(x, y))
        }
    }

    return env
}

function createAgentInRandomCoords(width, height) {
    const {x, y} = randomCoord([width, height])

    return createAgent(new Vector(x, y))
}

function createAgent(loc) {
    const agent = new Agent()
    agent.location.set(loc.x, loc.y)
    agent.addBehaviour(new InteractAgentsBehaviour({
        accelerate: 0.00004,
        radius: 50,
        initialInterest: 200,
    }))
    agent.addBehaviour(new RandomWalkBehaviour({accelerate: 0.0025}))
    agent.addBehaviour(new InteractEnvironmentBehaviour({
        accelerate: 0.0075
    }))

    return agent
}

function createAttractor(x, y) {
    // const {x, y} = randomCoord([width, height])

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