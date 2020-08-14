import Vector from './Vector'

export default class Vehicle {
    get accelerated() {
        return this.acceleration.lengthSquared > 0
    }

    private location: Vector
    private velocity: Vector
    private acceleration: Vector
    private damp: number

    constructor() {
        this.location = new Vector(0, 0)
        this.velocity = new Vector(0, 0)
        this.acceleration = new Vector(0, 0)
        this.damp = 1
    }

    move() {
        this.velocity.add(this.acceleration)
        this.location.add(this.velocity)
        this.acceleration.set(0, 0)

        this.velocity.mult(this.damp)
    }

    force(vector: Vector) {
        this.acceleration.add(vector)
        return this
    }

    // seek(target, accelerate = 1) {
    //     const desire = Vector.sub(target, this.location)
    //     const distanceToTargetSquared = desire.lengthSquared
    //
    //     if (distanceToTargetSquared < accelerate ** 2) desire.setLength(accelerate)
    //
    //     return this.force(desire)
    // }

    seek(target: Vector, accelerate = 1) {
        const desire = Vector.sub(target, this.location)
        const distanceToTargetSquared = desire.lengthSquared
        const a = distanceToTargetSquared < accelerate
            ? Math.sqrt(distanceToTargetSquared)
            : accelerate
        desire
            .normalize()
            .mult(a)
        if (!desire.isNaN()) {
            return this.force(desire)
        }

        return this
    }

    flee(target: Vector, accelerate: number) {
        const desire = Vector
            .sub(this.location, target)
            .setLength(accelerate)
        return this.force(desire)
    }
}