import NavigateTool from '../tools/NavigateTool'
import ObstacleView from '../views/ObstacleView'
import {findNearestInLocation} from '../lib/utils'
import ToolController from './ToolController'
import SelectTool from '../tools/SelectTool'
import PheromonesView from '../views/PheromonesView'
import ViewController from './ViewController'
import SelectedView from '../views/SelectedView'
import EmittersView from '../views/EmittersView'
import ComposedSignal from '../../lib/ComposedSignal'
import ScreenController from './ScreenController'
import ShortcutController from './ShortcutController'
import AgentsView from '../views/AgentsView'
import AttractorsView from '../views/AttractorsView'
import KeyboardController from './KeyboardController'
import Camera from '../render/Camera'
import SelectionController from './SelectionController'
import MoveTool from '../tools/MoveTool'

const Layer = {
    AGENTS: 'agents',
    EMITTERS: 'emitters',
    OBSTACLES: 'obstacles',
    ATTRACTORS: 'attractors',
    PHEROMONES: 'pheromones',
    SELECTED: 'selected',
}

const ToolType = {
    NAVIGATE: 'navigate',
    SELECT_AGENT: 'selectAgent',
    SELECT_OBSTACLE: 'selectObstacle',
    SELECT_EMITTER: 'selectEmitter',
    SELECT_ATTRACTOR: 'selectAttractor',
    MOVE: 'move',
}

export default class AppController {
    constructor(window, document) {
        this._window = window
        this._document = document
    }

    init({simulation, cameraCoord, scale}) {
        this.__scale = scale

        this.simulation = simulation
        this.camera = new Camera(this._window)
        this.camera.location.setFrom(cameraCoord)

        this.viewController = new ViewController(simulation)
        this.screenController = new ScreenController(this._window, this.viewController)

        this.initTools()
        this.initShortcuts()

        this.selectUpdateSignal = new ComposedSignal(null, [
            this.tools.getToolUpdateSignal(ToolType.SELECT_AGENT),
            this.tools.getToolUpdateSignal(ToolType.SELECT_OBSTACLE),
            this.tools.getToolUpdateSignal(ToolType.SELECT_EMITTER),
            this.tools.getToolUpdateSignal(ToolType.SELECT_ATTRACTOR),
        ])

        this.selectionController = new SelectionController(this.selectUpdateSignal)

        const update = simulation.channels.update
        // new ComposedSignal(null, [
        //     simulation.channels.update,
        //     this.selectUpdateSignal,
        // ])

        this.viewController.subscribe(update)
    }

    createLayout() {
        const layerRegistry = this.createLayers()
        const mouseCallbacks = this.screenController.getMouseCallbacks()

        return this.viewController
            .registerViewFactory(Layer.AGENTS, layerRegistry[Layer.AGENTS])
            .registerViewFactory(Layer.EMITTERS, layerRegistry[Layer.EMITTERS])
            .registerViewFactory(Layer.OBSTACLES, layerRegistry[Layer.OBSTACLES])
            .registerViewFactory(Layer.ATTRACTORS, layerRegistry[Layer.ATTRACTORS])
            .registerViewFactory(Layer.PHEROMONES, layerRegistry[Layer.PHEROMONES])
            .registerViewFactory(Layer.SELECTED, layerRegistry[Layer.SELECTED])
            .addLayout(Layer.OBSTACLES)
            .addLayout(Layer.PHEROMONES)
            .addLayout(Layer.EMITTERS)
            .addLayout(Layer.ATTRACTORS)
            .addLayout(Layer.AGENTS)
            .addLayout(Layer.SELECTED)
            .scaleViews(this.__scale, this.__scale)
            .translateFromCamera(this.camera)
            .getLayers({
                ...mouseCallbacks,
            })
    }

    createLayers() {
        return {
            [Layer.AGENTS]: (params) => new AgentsView({
                clear: true,
                ...params,
            }),
            [Layer.ATTRACTORS]: (params) => new AttractorsView({
                clear: true,
                ...params,
            }),
            // pathAttractors: (params) => new AttractorsPathView({
            //     clear: false,
            //     ...params,
            // }),
            [Layer.OBSTACLES]: (params) => new ObstacleView({
                clear: true,
                ...params,
            }),
            [Layer.EMITTERS]: (params) => new EmittersView({
                clear: true,
                ...params,
            }),
            [Layer.SELECTED]: (params) => new SelectedView({
                ...params,
                radius: 10,
                updateSignal: this.selectUpdateSignal,
            }),
            [Layer.PHEROMONES]: (params) => new PheromonesView({
                clear: true,
                maxValue: 10,
                ...params,
            }),
        }

    }

    initTools() {
        const mouseWorldCoordChannels = this.viewController.createScreenToWorldChannel(this.screenController.channels)

        const radius = 100
        this.tools = new ToolController()
        this.tools.register(ToolType.SELECT_AGENT, new SelectTool({
            channel: mouseWorldCoordChannels,
            radius,
            simulation: this.simulation,
            select: (simulation, coord, radius) => simulation.agents.getNearest(coord, radius),
        }))
        this.tools.register(ToolType.SELECT_OBSTACLE, new SelectTool({
            channel: mouseWorldCoordChannels,
            radius,
            simulation: this.simulation,
            select: (simulation, coord, radius) => simulation.environment.findObstacle(coord, radius),
        }))
        this.tools.register(ToolType.SELECT_EMITTER, new SelectTool({
            channel: mouseWorldCoordChannels,
            radius,
            simulation: this.simulation,
            select: (simulation, coord, radius) => findNearestInLocation(simulation.emitters, coord, radius),
        }))
        this.tools.register(ToolType.SELECT_ATTRACTOR, new SelectTool({
            channel: mouseWorldCoordChannels,
            radius,
            simulation: this.simulation,
            select: (simulation, coord, radius) => findNearestInLocation(simulation.environment.attractors, coord, radius),
        }))
        this.tools.register(ToolType.MOVE, new MoveTool({
            channel: mouseWorldCoordChannels,
            simulation: this.simulation,
        }))

        const navigateTool = new NavigateTool({
            camera: this.camera,
            channel: this.screenController.channels
        })
        navigateTool.mouseDirectionMultiplyX = 1 / this.__scale
        navigateTool.mouseDirectionMultiplyY = 1 / this.__scale
        this.tools.register(ToolType.NAVIGATE, navigateTool)

        let updateCameraRequestAnimationFrameId
        navigateTool.channels.update.on(() => {
            cancelAnimationFrame(updateCameraRequestAnimationFrameId)
            updateCameraRequestAnimationFrameId = requestAnimationFrame(this.updateCamera.bind(this))
        })
    }

    updateCamera() {
        this.viewController.translateFromCamera(this.camera)
        this.viewController.render()
    }

    initShortcuts() {
        const simulation = this.simulation

        const keyboard = new KeyboardController(this._document)
        const shortcut = new ShortcutController(keyboard.channels)
        shortcut.register('space', () => {
            this.tools.activate(ToolType.NAVIGATE)
        })
        shortcut.register('v', () => {
            this.tools.activate(ToolType.SELECT_AGENT)
        })
        shortcut.register('o', () => {
            this.tools.activate(ToolType.SELECT_OBSTACLE)
        })
        shortcut.register('e', () => {
            this.tools.activate(ToolType.SELECT_EMITTER)
        })
        shortcut.register('a', () => {
            this.tools.activate(ToolType.SELECT_ATTRACTOR)
        })
        shortcut.register('r', () => {
            if (simulation.isRunning) {
                simulation.stop()
            } else {
                simulation.run()
            }
        })
        shortcut.register('s', () => {
            if (simulation.isRunning) {
                simulation.stop()
            }

            simulation.step()
        })
        shortcut.register('m', () => {
            this.tools.activate(ToolType.MOVE, {
                selectionController: this.selectionController,
            })
        })
        shortcut.register('p', () => {
            console.log('Translate:', this.viewController._translation)
            console.log('Scale:', this.viewController._scale)
        })
    }
}
