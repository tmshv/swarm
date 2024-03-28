import MovingBehavior from './MovingBehavior'
import Vector from '../../lib/vector'

export default class BoidBehavior extends MovingBehavior {
    init({radius, predictionDistance}) {
        this.radius = radius
        this.predictionDistance = predictionDistance
        this.predictionDistanceSquared = predictionDistance ** 2

        this.lines = null
    }

    run({agentsPool}) {
        const as = agentsPool.getAgents()

        const sep = this.separate(as)
        const ali = this.align(as)
        const coh = this.cohesion(as)

        this.force(sep)
        this.force(ali)
        this.seek(coh)
    }

    // Separation
    // Method checks for nearby boids and steers away
    separate(boids) {
        const desiredSeparation = 25.0
        const steer = new Vector(0, 0, 0)
        let count = 0
        // For every boid in the system, check if it's too close
        for (let other of boids) {
            const d = this.agent.location.dist(other.location)
            // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
            if ((d > 0) && (d < desiredSeparation)) {
                // Calculate vector pointing away from neighbor
                const diff = Vector.sub(this.agent.location, other.location)
                diff.normalize()
                diff.divide(d)        // Weight by distance
                steer.add(diff)
                count++            // Keep track of how many
            }
        }

        // Average -- divide by how many
        if (count > 0) {
            steer.divide(count)
        }

        return steer
    }

    // Alignment
    // For every nearby boid in the system, calculate the average velocity
    align(boids) {
        const neighborDist = 50
        const sum = new Vector(0, 0)
        let count = 0
        for (let other of boids) {
            const d = this.agent.location.dist(other.location)
            if ((d > 0) && (d < neighborDist)) {
                sum.add(other.velocity)
                count++
            }
        }

        if (count > 0) {
            sum.divide(count)
            return sum
        } else {
            return new Vector(0, 0)
        }
    }

    // Cohesion
    // For the average position (i.e. center) of all nearby boids, calculate steering vector towards that position
    cohesion(boids) {
        const neighborDist = 50
        const sum = new Vector(0, 0)   // Start with empty vector to accumulate all positions
        let count = 0
        for (let other of boids) {
            const d = this.agent.location.dist(other.location)
            if ((d > 0) && (d < neighborDist)) {
                sum.add(other.position) // Add position
                count++
            }
        }
        if (count > 0) {
            sum.divide(count)
            return seek(sum)  // Steer towards the position
        }
        else {
            return new Vector(0, 0)
        }
    }
}
