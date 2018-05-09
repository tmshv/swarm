import SwarmObject from './SwarmObject'
import {getCentroid} from './lib/geometry'

export default class Polygon extends SwarmObject {
    get coords() {
        return this._coords
    }

    constructor({coords}) {
        super()
        this._coords = coords
    }

    getCentroid() {
        return getCentroid(this._coords)
    }
}