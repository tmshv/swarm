export default class ObstacleType {
    static THING = 'thing'
    static BUILDING = 'building'
    static ROAD = 'road'

    constructor() {
        throw new Error('Cannot create instance of ObstacleType')
    }
}