export default class ToolType {
    static NAVIGATE = 'navigate'
    static SELECT_AGENT = 'selectAgent'
    static SELECT_OBSTACLE = 'selectObstacle'
    static SELECT_EMITTER = 'selectEmitter'
    static SELECT_ATTRACTOR = 'selectAttractor'
    static ADD_ATTRACTOR = 'addAttractor'
    static ADD_EMITTER = 'addEmitter'
    static MOVE = 'move'
    static DELETE = 'delete'

    constructor() {
        throw new Error('Cannot create instance of ToolType')
    }
}