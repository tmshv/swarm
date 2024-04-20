import { useState, useEffect } from 'react'
import {
    Agent,
    AgentPool,
    Simulation,
    Environment,
    Attractor,
    Id,
    Emitter,
    Vector,
    Pheromones,
    ObstacleType,
    Tag,
    PathObstacle,
    AttractorType,
    ComposableBehavior,
    TtlBehavior,
    SeekLocationBehavior,
    SeekNearestAttractorBehavior,
    SeparateAgentsBehavior,
    SpreadPheromonesBehavior,
    AvoidObstaclesBehavior,
    LimitAccelerationBehavior,
    InteractPheromonesBehavior,
    AgentBehavior,
    RandomWalkBehavior,
} from '@tmshv/swarm'
import { AppController, RAFRunner } from '@tmshv/swarm-render'

export type CreateControlsFn = () => object[]
export type GetLayersFn = () => object[]
export type CameraTransform = [number, number, number, number, number, number]

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
            InteractPheromonesBehavior,
            RandomWalkBehavior,
        })
    } catch (error) {
        console.log('failed to find swarm function', error)
        return null
    }
}

export type SwarmController = {
    // options: object
    // project: any
    raf: RAFRunner
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

export function useSwarm(scriptUrl: string, camera: CameraTransform | null, getLayers: GetLayersFn, createControls: CreateControlsFn) {
    const [controller, setController] = useState<SwarmController | null>(null)

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
            if (camera) {
                swarm.viewController.applyMatrix({
                    a: camera[0],
                    b: camera[1],
                    c: camera[2],
                    d: camera[3],
                    e: camera[4],
                    f: camera[5],
                })
            }

            // initDebugTools(swarm)

            const raf = new RAFRunner(simulation)

            const layers = swarm.createLayout(getLayers())
            const ui = {
                onClick: () => {
                    if (raf.isRunning) {
                        raf.stop()
                    } else {
                        raf.start()
                    }
                }
            }
            raf.start()

            //Init render on simulation tick
            swarm.viewController.subscribe(raf.updateSignal)

            setController({
                // options: project.options,
                // project,
                raf,
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
