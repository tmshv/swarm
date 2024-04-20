export function getLayers() {
    return [
        {
            name: 'Buildings',
            view: 'buildings',
            options: {}
        },

        {
            name: 'Obstacles',
            view: 'obstacles',
            options: {}
        },

        {
            name: 'Ph',
            view: 'pheromones',
            options: {
                pheromonesName: 'kek',
                pheromoneVelocityMultiplier: 0.1,
                fill: (alpha) => {
                    // console.log(alpha)
                    return `rgba(255, 255, 255, ${alpha})`
                }
            }
        },

        {
            name: 'Emitters',
            view: 'emitters',
            options: {}
        },

        {
            name: 'Attractors',
            view: 'attractors',
            options: {}
        },

        {
            name: 'Agents',
            view: 'agents',
            options: {
                size: (agent, options) => options.agentSize ?? 1,
                fill: (agent, options) => {
                    // return `rgba(255, 255, 255, ${options.agentAlpha})`

                    return options.agentColor ?? 'white'
                },
            },
        },
    ]
}

export function createControls() {
    return [
        // {
        //     type: 'string',
        //     field: '',
        //     label: '',
        // },
        {
            type: 'number',
            field: 'agentTtl',
            label: 'Agent ttl',
            min: 1,
            max: 1500,
            step: 1,
            defaultValue: 500,
        },
        {
            type: 'number',
            field: 'agentSize',
            label: 'Agent size',
            min: 1,
            max: 10,
            step: 0.5,
            defaultValue: 2,
        },
        {
            type: 'color',
            field: 'agentColor',
            label: 'Agent color',
            defaultValue: '#ffffff',
        },
        //                     {/* <DatString path='package' label='Package' />
        //         <DatNumber path='power' label='Power' min={9000} max={9999} step={1} />
        //         <DatBoolean path='isAwesome' label='Awesome?' />
        //         <DatColor path='feelsLike' label='Feels Like' /> */}

    ]
}
