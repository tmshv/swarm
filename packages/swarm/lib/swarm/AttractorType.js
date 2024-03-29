export default class AttractorType {
    static BUS_STOP = 'bus-stop'
    static METRO_STATION = 'metro-station'
    static UNKNOWN = 'unknown'

    constructor() {
        throw new Error('Cannot create instance of AttractorType')
    }
}