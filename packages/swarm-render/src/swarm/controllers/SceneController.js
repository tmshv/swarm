import { Attractor } from '@tmshv/swarm'

const tags = tagsMap => {
    const result = []
    for (const [k, v] of tagsMap.entries()) {
        result.push({ name: k, value: v })
    }

    return result
}

export default class SceneController {
    constructor(storage) {
        this._storage = storage
    }

    initAttractorsSave(addSignal, deleteSignal) {
        addSignal.on(attractor => {
            const encoded = {
                location: attractor.location.toArray(),
                power: attractor.power,
                id: attractor.id,
                tags: tags(attractor.tags),
            }

            let attractors = this._storage.getItem('attractors')
            if (!Array.isArray(attractors)) {
                attractors = []
            }

            attractors.push(encoded)
            this._storage.setItem('attractors', attractors)
        })

        deleteSignal.on(attractor => {
            let attractors = this._storage.getItem('attractors')
            if (!Array.isArray(attractors)) {
                attractors = []
            }

            const id = attractor.id
            attractors = attractors.filter(x => x.id !== id)

            this._storage.setItem('attractors', attractors)
        })

        return this
    }

    loadAttractors(simulation) {
        const attractors = this._storage.getItem('attractors')
        if (Array.isArray(attractors)) {
            for (let e of attractors) {
                const attractor = new Attractor({
                    id: e.id,
                    x: e.location[0],
                    y: e.location[1],
                    power: e.power,
                })

                for (let { name, value } of e.tags) {
                    attractor.addTag(name, value)
                }

                simulation.environment.addAttractor(attractor)
            }
        }

        return this
    }
}
