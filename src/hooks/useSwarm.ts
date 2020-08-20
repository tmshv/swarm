import { useState, useEffect } from 'react'
import { getLayers, createControls } from '../app/init'
import { initDebugTools } from '../app'
import AppController from '@/swarm/controllers/AppController'

import Simulation from '@/swarm/Simulation'
import AgentPool from '@/swarm/AgentPool'
import Agent from '@/swarm/Agent'
import Environment from '@/swarm/Environment'
import Attractor from '@/swarm/Attractor'
import Id from '@/swarm/Id'
import Emitter from '@/swarm/Emitter'
import Vector from '@/swarm/Vector'
import Pheromones from '@/swarm/Pheromones'
import ObstacleType from '@/swarm/ObstacleType'
import Tag from '@/swarm/Tag'
import PathObstacle from '@/swarm/PathObstacle'
import AttractorType from '@/swarm/AttractorType'
import ComposableBehavior from '@/swarm/behaviors/ComposableBehavior'
import TtlBehavior from '@/swarm/behaviors/TtlBehavior'
import SeekLocationBehavior from '@/swarm/behaviors/SeekLocationBehavior'
import SeekNearestAttractorBehavior from '@/swarm/behaviors/SeekNearestAttractorBehavior'
import SeparateAgentsBehavior from '@/swarm/behaviors/SeparateAgentsBehavior'
import SpreadPheromonesBehavior from '@/swarm/behaviors/SpreadPheromonesBehavior'
import AvoidObstaclesBehavior from '@/swarm/behaviors/AvoidObstaclesBehavior'
import LimitAccelerationBehavior from '@/swarm/behaviors/LimitAccelerationBehavior'
import AgentBehavior from '@/swarm/AgentBehavior'

async function initSwarm(): Promise<Simulation> {
    try {
        return (window as any).swarm({
            Agent,
            Simulation,
            AgentPool,
            Environment,
            Attractor,
            Id,
            Emitter,
            Vector,
            Pheromones,
            Tag,
            ObstacleType,
            PathObstacle,
            AttractorType,
            AgentBehavior,
            ComposableBehavior,
            TtlBehavior,
            SeekLocationBehavior,
            SeparateAgentsBehavior,
            SeekNearestAttractorBehavior,
            SpreadPheromonesBehavior,
            AvoidObstaclesBehavior,
            LimitAccelerationBehavior,
        })
    } catch (error) {
        console.log('failed to find swarm function', error)
        return null
    }
}

export type SwarmController = {
    // options: object
    // project: any
    ui: any
    layers: any[]
    swarm: AppController
    simulation: Simulation
    createControls: any
}

async function inject(src: string): Promise<HTMLScriptElement> {
    return new Promise((resolve, reject) => {
        const s = document.createElement('script')
        s.src = src

        s.onload = () => {
            try {
                resolve(s)
                // (window as any).initSim('kek')
            } catch (error) {
                s.remove()
                reject(error)
                // console.log('failed to find initSim')
            }
        }

        document.body.appendChild(s)
    })
}

export function useSwarm(scriptUrl: string) {
    const [controller, setController] = useState<SwarmController>(null)

    useEffect(() => {
        let se: HTMLScriptElement = null
        let mounted = true;
        (async () => {
            try {
                se = await inject(scriptUrl)
            } catch (error) {
                console.log('failed to inject script')
            }

            const simulation = await initSwarm()
            if (!simulation) {
                console.log('cannot define simulation')
                return
            }

            const cameraCoord = Vector.zero()
            const scale = 1
            const scaleX = scale
            const scaleY = -scale

            // Init swarm controller
            const swarm = new AppController(window, document)
            swarm.init({
                simulation,
                scaleX,
                scaleY,
                cameraCoord,
            })
            initDebugTools(swarm)

            const layers = swarm.createLayout(getLayers())
            const ui = {
                onClick: () => {
                    if (simulation.isRunning) {
                        simulation.stop()
                    } else {
                        simulation.run()
                    }
                }
            }
            simulation.run()

            setController({
                // options: project.options,
                // project,
                ui,
                layers,
                swarm,
                simulation,
                createControls,
            })
        })()

        return () => {
            mounted = false

            if (se) {
                se.remove()
            }
        }
    }, [])

    return controller
}
