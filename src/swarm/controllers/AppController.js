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
import Storage from '../../lib/Storage'
import ScreenController from './ScreenController'
import ShortcutController from './ShortcutController'
import AgentsView from '../views/AgentsView'
import AttractorsView from '../views/AttractorsView'
import KeyboardController from './KeyboardController'
import Camera from '../render/Camera'
import SelectionController from './SelectionController'
import MoveTool from '../tools/MoveTool'
import Vector from '../Vector'
import AddTool from '../tools/AddTool'
import Attractor from '../Attractor'
import Id from '../Id'
import Viewport from '../Viewport'
import AttractorType from '../AttractorType'
import ToolType from '../ToolType'
import Tag from '../Tag'
import SceneController from './SceneController'
import DeleteTool from '../tools/DeleteTool'
import FnTool from '../tools/FnTool'

const Layer = {
    AGENTS: 'agents',
    EMITTERS: 'emitters',
    OBSTACLES: 'obstacles',
    ATTRACTORS: 'attractors',
    PHEROMONES: 'pheromones',
    SELECTED: 'selected',
}

export default class AppController {
    constructor(window, document) {
        this._window = window
        this._document = document
    }

    init({simulation, cameraCoord, scaleX, scaleY}) {
        this.__scaleX = scaleX
        this.__scaleY = scaleY

        const viewport = Viewport.fromWindow(this._window)

        this.simulation = simulation
        this.camera = new Camera(this._window)
        this.camera.location.setFrom(cameraCoord)

        this.viewController = new ViewController(simulation, viewport)
        this.screenController = new ScreenController(this._window, this.viewController)

        this.initTools()
        this.initShortcuts()

        this.sceneController = (new SceneController(new Storage(localStorage)))
            .initAttractorsSave(
                this.tools.getToolUpdateSignal(ToolType.ADD_ATTRACTOR),
                this.tools.getToolUpdateSignal(ToolType.DELETE),
            )
            .loadAttractors(this.simulation)

        const selectUpdateSignal = new ComposedSignal(null, [
            this.tools.getToolUpdateSignal(ToolType.SELECT_AGENT),
            this.tools.getToolUpdateSignal(ToolType.SELECT_OBSTACLE),
            this.tools.getToolUpdateSignal(ToolType.SELECT_EMITTER),
            this.tools.getToolUpdateSignal(ToolType.SELECT_ATTRACTOR),
        ])

        this.tools.getToolUpdateSignal(ToolType.NAVIGATE).on(this.updateCamera.bind(this))

        this.selectionController = new SelectionController(selectUpdateSignal)

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
            .scale(this.__scaleX, this.__scaleY)
            .translateFromCamera(this.camera)
            .applyTransform()
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
                updateSignal: this.selectionController.channels.update,
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
        this.tools.register(ToolType.CONSOLE_EXPORT, new FnTool(({simulation}) => {
            const exporter = fn => iter => {
                const items = []

                for (const x of iter) {
                    items.push(fn(x))
                }

                return items
            }

            const exportPheromones = exporter(pheromone => [
                pheromone.location.x,
                pheromone.location.y,
                pheromone.velocity.length,
            ])

            const exportAttractors = exporter(attractor => [
                attractor.location.x,
                attractor.location.y,
                attractor.agents.length,
            ])

            return {
                attractors: exportAttractors(simulation.environment.attractors),
                pheromones: exportPheromones(simulation.environment.pheromones.values.values()),
            }
        }))
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
        this.tools.register(ToolType.ADD_ATTRACTOR, new AddTool({
            channel: mouseWorldCoordChannels,
            simulation: this.simulation,
            add: (simulation, coord) => {
                const id = Id.get('attractor')
                const attractor = new Attractor({
                    id,
                    x: coord.x,
                    y: coord.y,
                    power: 50,
                })
                attractor.addTag(Tag.TYPE, AttractorType.UNKNOWN)
                simulation.environment.addAttractor(attractor)
                return attractor
            },
        }))
        this.tools.register(ToolType.MOVE, new MoveTool({
            channel: mouseWorldCoordChannels,
            simulation: this.simulation,
        }))
        this.tools.register(ToolType.DELETE, new DeleteTool({
            simulation: this.simulation,
        }))
        this.tools.register(ToolType.NAVIGATE, new NavigateTool({
            viewController: this.viewController,
            channel: this.screenController.channels
        }))
    }

    updateCamera() {
        this.viewController.applyTransform()
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
        shortcut.register('ctrl+l', () => {
            console.log('Pool:', this.simulation.agents.size)
            console.log('Viewport:', this.viewController.getTransform().toArray())
        })
        shortcut.register('backspace', () => {
            this.tools.run(ToolType.DELETE, {
                selectionController: this.selectionController,
            })
        })
        shortcut.register('ctrl+p', () => {
            this.tools.run(ToolType.CONSOLE_EXPORT, {
                simulation: this.simulation,
            })
        })

        shortcut.register('ctrl+a', () => {
            this.tools.activate(ToolType.ADD_ATTRACTOR)
        })
    }
}
