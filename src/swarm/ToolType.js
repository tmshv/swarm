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
    static CONSOLE_EXPORT = 'consoleExport'
    static CONSOLE_DEBUG_EXPORT = 'consoleDebugExport'
    static SIMULATION_CONTROL_SWITCH = 'simulationControlSwitch'
    static SIMULATION_CONTROL_STEP = 'simulationControlStep'
    static RESET_VIEW = 'resetView'

    constructor() {
        throw new Error('Cannot create instance of ToolType')
    }
}