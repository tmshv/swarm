async function swarm(SWARM) {
    console.log('Swarming MEGA KAZAN')

    const projectRes = await fetch('/MEGA_SWARM2.json')
    const project = await projectRes.json()

    const s = new SWARM.Simulation()
    s.setAgents(new SWARM.AgentPool(100))

    const env = new SWARM.Environment()
    s.setEnvironment(env)
    env.addPheromones('kek', new SWARM.Pheromones({
        cellSize: 7,
        damp: 0.9999,
        // increaseValue: 1,
        // decreaseValue: .0001,
    }))

    project.layers.forEach(item => {
        switch (item.layer) {
            case 'attractors': {
                return setupAttractors(item)
            }
            case 'obstacles': {
                return setupObstacles(item)
            }
            case 'exit_points': {
                return setupEmitters(item)
            }

            default: {
                return
            }
        }
    })

    // Init Attractors
    function setupAttractors(item) {
        item.objects
            // .filter(x => x.type === 'attractor')
            .forEach(obj => {
                const coord = createGeometry(obj)
                const power = 1
                const id = SWARM.Id.get(obj.type)
                const a = new SWARM.Attractor({
                    id,
                    power,
                    x: coord.x,
                    y: coord.y,
                })
                a.addTag(SWARM.AttractorType.UNKNOWN, null)
                env.addAttractor(a)
            })
    }

    // Init Emitters
    function setupEmitters(item) {
        item.objects
            // .filter(x => x.type === 'emitter')
            .forEach(obj => {
                const coord = createGeometry(obj)
                // const amount = obj.properties.amount
                // const period = obj.properties.period || 100
                const amount = 1
                const period = 100
                s.addEmitter(new SWARM.Emitter({
                    x: coord.x,
                    y: coord.y,
                    period,
                    amount,
                    factory: createAgent,
                }))
            })
    }

    // Init Obstacles
    // DATA.objects
    //     .filter(x => x.type === 'obstacle' && x.geometry.type === 'point')
    //     .forEach(obj => {
    //         const radius = 10
    //         const coord = createGeometry(obj.geometry)
    //         const x = new PointObstacle({ radius })
    //         x.location.setFrom(coord)
    //         x.addTag(Tag.TYPE, ObstacleType.THING)
    //         env.addObstacle(x)
    //     })

    function setupObstacles(layer) {
        layer.objects
            .filter(obj => obj.type === 'polyline')
            .forEach(obj => {
                const cs = createGeometry(obj)
                const fix = false
                // let fix = obj.properties.type === 'volume'

                // if (obj.properties.type === 'void') {
                //     fix = false
                //     cs.reverse()
                // }

                const x = SWARM.PathObstacle.fromCoords(cs, fix)

                x.addTag(SWARM.Tag.TYPE, SWARM.ObstacleType.BUILDING)
                env.addObstacle(x)
            })


        const test = SWARM.PathObstacle.fromCoords([
            SWARM.Vector.zero(),
            new SWARM.Vector(
                517481.0,
                296050.0,
            )
        ], false)
        env.addObstacle(test)
    }

    // export function getLayers() {
    //     return [
    //         {
    //             name: 'Buildings',
    //             view: 'buildings',
    //             options: {}
    //         },

    //         {
    //             name: 'Obstacles',
    //             view: 'obstacles',
    //             options: {}
    //         },

    //         {
    //             name: 'Ph',
    //             view: 'pheromones',
    //             options: {
    //                 pheromonesName: 'kek',
    //                 pheromoneVelocityMultiplier: 0.1,
    //                 fill: (alpha) => {
    //                     // console.log(alpha)
    //                     return `rgba(255, 255, 255, ${alpha})`
    //                 }
    //             }
    //         },

    //         {
    //             name: 'Emitters',
    //             view: 'emitters',
    //             options: {}
    //         },

    //         {
    //             name: 'Attractors',
    //             view: 'attractors',
    //             options: {}
    //         },

    //         {
    //             name: 'Agents',
    //             view: 'agents',
    //             options: {
    //                 size: (agent, options) => options.agentSize,
    //                 fill: (agent, options) => {
    //                     // return `rgba(255, 255, 255, ${options.agentAlpha})`

    //                     return options.agentColor
    //                 },
    //             },
    //         },
    //     ]
    // }

    // export function createControls() {
    //     return [
    //         // {
    //         //     type: 'string',
    //         //     field: '',
    //         //     label: '',
    //         // },
    //         {
    //             type: 'number',
    //             field: 'agentTtl',
    //             label: 'Agent ttl',
    //             min: 1,
    //             max: 1500,
    //             step: 1,
    //             defaultValue: 500,
    //         },
    //         {
    //             type: 'number',
    //             field: 'agentSize',
    //             label: 'Agent size',
    //             min: 1,
    //             max: 10,
    //             step: 0.5,
    //             defaultValue: 2,
    //         },
    //         {
    //             type: 'color',
    //             field: 'agentColor',
    //             label: 'Agent color',
    //             defaultValue: '#ffffff',
    //         },
    //         //                     {/* <DatString path='package' label='Package' />
    //         //         <DatNumber path='power' label='Power' min={9000} max={9999} step={1} />
    //         //         <DatBoolean path='isAwesome' label='Awesome?' />
    //         //         <DatColor path='feelsLike' label='Feels Like' /> */}

    //     ]
    // }

    // export function getSettings(data: SwarmData) {
    //     return {
    //         backgroundColor: '#333f4d',
    //         ...data.options,
    //     }
    // }

    // export function getCameraCenter(data: SwarmData): Vector {
    //     const target = data.objects.find(x => x.type === 'emitter')
    //     if (!target) {
    //         return new Vector(0, 0)
    //     }

    //     return createGeometry(target.geometry)
    // }

    function createGeometry(geom) {
        const mult = 0.01
        const coordinates = geom.geometry
        switch (geom.type) {
            case 'point': {
                const v = new SWARM.Vector(coordinates[0], coordinates[1])
                v.mult(mult)
                return v
            }
            case 'polyline':
                return coordinates.map(([x, y]) => {
                    const v = new SWARM.Vector(x, y)
                    v.mult(mult)
                    return v
                })

            default:
                return null
        }
    }

    function createAgent(loc, vars) {
        const ttl = vars.agentTtl ?? 1000
        const initialVelocity = new SWARM.Vector(0, 0)
        const behavior = SWARM.ComposableBehavior.compose(
            new SWARM.TtlBehavior({
                ttl,
            }),

            // BOID

            // new AlignAgentsBehavior({
            //     accelerate: .21,
            //     radius: 250,
            // }),

            new SWARM.SeparateAgentsBehavior({
                accelerate: 0.2,
                // radius: 250,
                radius: 500,
            }),

            // new CohesionAgentsBehavior({
            //     accelerate: .5,
            //     radius: 250,
            // }),

            // OTHER

            // new ConditionalBehavior({
            //     predicate: new IfTargetReachedBehavior({
            //         minDistance: 5,
            //     }),
            //     trueBranch: AgentBehavior.SEEK_LOCATION,
            //     falseBranch: new RandomWalkBehavior({
            //         accelerate: 0.25,
            //     }),
            // }),

            // new WalkToNearestAttractorBehavior({}),

            new SWARM.SeekNearestAttractorBehavior({
                accelerate: 1,
                thresholdDistQuad: 1000 ** 2,
                attractorTypes: [SWARM.AttractorType.UNKNOWN],
            }),

            // new InteractAgentsBehavior({
            //     accelerate: 0.4,
            //     radius: 25,
            //     initialInterest: 200,
            // }),

            // new RandomWalkBehavior({
            //     accelerate: 0.01,
            // }),

            // new InteractEnvironmentBehavior({
            //     accelerate: 0.1
            // }),

            new SWARM.InteractPheromonesBehavior({
                accelerate: .5,
                pheromonesName: 'kek',
            }),

            new SWARM.SpreadPheromonesBehavior({
                // pheromones,
                pheromonesName: 'kek',
            }),

            // AVOID OBSTACLE

            // new AvoidPointObstaclesBehavior({
            //     accelerate: 0.1,
            //     predictionDistance: 50,
            //     radius: 50,
            // }),

            new SWARM.AvoidObstaclesBehavior({
                accelerate: 1,

                // predictionDistance: 10,
                // radius: 50,

                predictionDistance: 50,
                radius: 5000,
            }),

            // OTHER

            // new SWARM.LimitAccelerationBehavior({
            //     limit: 0.5,
            // })
        )

        const noise = SWARM.Vector.fromAngle(Math.random() * Math.PI * 2)
        noise.mult(0.1)

        const a = new SWARM.Agent({
            behavior,
        })
        a.damp = 0.75
        a.location.setFrom(SWARM.Vector.add(loc, noise))
        a.velocity.setFrom(initialVelocity)
        a.addBehavior(SWARM.AgentBehavior.SEEK_LOCATION, new SWARM.SeekLocationBehavior({
            accelerate: 0.1,
            threshold: 2,
        }))

        return a
    }

    return s
}
