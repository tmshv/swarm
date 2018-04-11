import Vector from './Vector'
import {interpolateLinear} from './lib/math'

function inRange(v, a, b) {
    return v >= a && v <= b
}

function isEqual(v1, v2, precision) {
    return Math.abs(v1 - v2) < precision
}

function cmp(a, b) {
    if (a < b) return -1
    if (a === b) return 0
    return 1
}

const BETWEEN = 6

function crossLength(a, b) {
    // const crossX = a.y * b.z - b.y * a.z
    // const crossY = a.z * b.x - b.z * a.x
    const crossZ = a.x * b.y - b.x * a.y
    return crossZ
}

/**
 * Computes 2D vector v reflected off a line whose normal is n.
 * Note: n must be normalized!
 * Written to work with gl-matrix conventions.
 *
 * @param {Array} out The receiving vector.
 * @param {Array} v The vector to reflect.
 * @param {Array} n The normal (normalized) of the line to reflect off of.
 * @returns {Array} out
 */
function reflect(out, v, n) {
    const d = v[0] * n[0] + v[1] * n[1] //dot(v, n)
    out[0] = v[0] - 2.0 * d * n[0]
    out[1] = v[1] - 2.0 * d * n[1]
    return out
}

export default class Line {
    get a() {
        return this._a
    }

    get b() {
        return this._b
    }

    get normal() {
        return this._n
    }

    get length() {
        return this.getDirection().length
    }

    constructor(a, b) {
        this._a = a
        this._b = b
        this.calcLeftNormal()
    }

    getCentroid() {
        return Vector
            .add(this._a, this._b)
            .divide(2)
    }

    directNormalFrom(coord) {
        const c = this.getCentroid()
        const d = Vector.sub(c, coord)
        if (d.dot(this._n) > 0) {
            this.calcLeftNormal()
        } else {
            this.calcRightNormal()
        }
    }

    calcLeftNormal() {
        this._n = this
            .getLeftNormal()
            .normalize()
    }

    calcRightNormal() {
        this._n = this
            .getRightNormal()
            .normalize()
    }

    getLeftNormal() {
        return this
            .getDirection()
            .left()
        // const dx = this._b.x - this._a.x
        // const dy = this._b.y - this._a.y
        //
        // return new Vector(
        //     -dx,
        //     dy
        // )

        // return d.set(d.x, -d.y)
    }

    getRightNormal() {
        return this
            .getDirection()
            .right()
    }

    getDirection() {
        return Vector.sub(this._b, this._a)
    }

    distSquared(coord) {
        const p = this.project(coord)
        return coord.distSquared(p)
    }

    interpolate(coef) {
        const x = interpolateLinear(this._a.x, this._b.x, coef)
        const y = interpolateLinear(this._a.y, this._b.y, coef)
        return new Vector(x, y)
    }

    reflect(vector) {
        const n = this.normal.clone()
        const dp = vector.dot(n)
        n.mult(2.0 * dp)

        return Vector.sub(vector, n)
    }

    offset(vector) {
        return new Line(
            this._a.clone().add(vector),
            this._b.clone().add(vector),
        )
    }

    project(coord) {
        const a = Vector.sub(coord, this.a)
        const b = this.getDirection()
        const dp = a.dot(b)

        const p = b
            .clone()
            .mult(dp / b.lengthQuad)

        return Vector.add(this.a, p)
    }

    getRangeX() {
        return [
            Math.min(this._a.x, this._b.x),
            Math.max(this._a.x, this._b.x),
        ]
    }

    getRangeY() {
        return [
            Math.min(this._a.y, this._b.y),
            Math.max(this._a.y, this._b.y),
        ]
    }

    contains(coord) {
        const x = coord.x
        const y = coord.y
        const [x1, x2] = this.getRangeX()
        const [y1, y2] = this.getRangeY()
        const xxx = (x - x1) / (x2 - x1)
        const yyy = (y - y1) / (y2 - y1)

        if (xxx !== yyy) return false

        return inRange(xxx, x1, x2) && inRange(yyy, y1, y2)
    }

    isBetween(coord) {
        const a = this._a
        const b = this._b
        const pa = Vector.sub(coord, a)
        const pb = Vector.sub(coord, b)
        const ps = crossLength(pa, pb)

        return pa.dot(pb) < 0 && isEqual(ps, 0, 5E-5)
    }

    /**
     * Define type of coord relatively to line
     */
    classify(point) {
        const limit = 1.5e-12

        const p0 = this._a
        const p1 = this._b
        const p2 = point

        const a = {
            x: p1.x - p0.x,
            y: p1.y - p0.y,
        }

        const b = {
            x: p2.x - p0.x,
            y: p2.y - p0.y,
        }

        const sa = a.x * b.y - b.x * a.y

        // if (sa > limit) return "left"
        // if (sa < limit) return "right"
        if ((a.x * b.x < 0.0) || (a.y * b.y < 0.0)) return "behind"
        if (a.length < b.length) return "beyond"
        // if (p0.equals(p2)) return "origin"
        // if (p0.equals(p2)) return "destination"
        return BETWEEN
    }

    isIntersect(line) {
        const sameSign = (a, b) => (a * b) > 0

        const x1 = this._a.x
        const y1 = this._a.y
        const x2 = this._b.x
        const y2 = this._b.y
        const x3 = line.a.x
        const y3 = line.a.y
        const x4 = line.b.x
        const y4 = line.b.y

        var a1, a2, b1, b2, c1, c2;
        var r1, r2, r3, r4;
        var denom, offset, num;

        // Compute a1, b1, c1, where line joining points 1 and 2
        // is "a1 x + b1 y + c1 = 0".
        a1 = y2 - y1;
        b1 = x1 - x2;
        c1 = (x2 * y1) - (x1 * y2);

        // Compute r3 and r4.
        r3 = ((a1 * x3) + (b1 * y3) + c1);
        r4 = ((a1 * x4) + (b1 * y4) + c1);

        // Check signs of r3 and r4. If both point 3 and point 4 lie on
        // same side of line 1, the line segments do not intersect.
        if ((r3 !== 0) && (r4 !== 0) && sameSign(r3, r4)) {
            return 0; //return that they do not intersect
        }

        // Compute a2, b2, c2
        a2 = y4 - y3;
        b2 = x3 - x4;
        c2 = (x4 * y3) - (x3 * y4);

        // Compute r1 and r2
        r1 = (a2 * x1) + (b2 * y1) + c2;
        r2 = (a2 * x2) + (b2 * y2) + c2;

        // Check signs of r1 and r2. If both point 1 and point 2 lie
        // on same side of second line segment, the line segments do
        // not intersect.
        if ((r1 !== 0) && (r2 !== 0) && (sameSign(r1, r2))) {
            return 0; //return that they do not intersect
        }

        //Line segments intersect: compute intersection point.
        denom = (a1 * b2) - (a2 * b1);

        if (denom === 0) {
            return 0; //collinear
        }

        // lines_intersect
        return 1; //lines intersect, return true
    }
}