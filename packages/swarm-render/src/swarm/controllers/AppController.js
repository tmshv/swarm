import { Id, Tag, Attractor, AttractorType, Vector } from '@tmshv/swarm'
import NavigateTool from '../tools/NavigateTool'
import ObstacleView from '../views/ObstacleView'
import { findNearestInLocation } from '../lib/utils'
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
import AddTool from '../tools/AddTool'
import Viewport from '../Viewport'
import ToolType from '../ToolType'
import SceneController from './SceneController'
import DeleteTool from '../tools/DeleteTool'
import FnTool from '../tools/FnTool'
import SimulationControlSwitchTool from '../tools/SimulationControlSwitchTool'
import SimulationControlStepTool from '../tools/SimulationControlStepTool'
import BuildingsView from '../views/BuildingsView'

const Layer = {
    AGENTS: 'agents',
    EMITTERS: 'emitters',
    OBSTACLES: 'obstacles',
    ATTRACTORS: 'attractors',
    PHEROMONES: 'pheromones',
    BUILDINGS: 'buildings',
}

export default class AppController {
    constructor(window, document) {
        this._window = window
        this._document = document
    }

    getSimulation() {
        return this.simulation
    }

    init({ simulation, cameraCoord, scaleX, scaleY }) {
        this.__scaleX = scaleX
        this.__scaleY = scaleY

        const viewport = Viewport.fromWindow(this._window)

        this.homeCameraPosition = Vector.zero()

        this.simulation = simulation
        this.camera = new Camera(this._window)

        if (cameraCoord) {
            this.camera.location.setFrom(cameraCoord)
            this.homeCameraPosition.setFrom(cameraCoord)
        }

        this.viewController = new ViewController(simulation, viewport)
        this.screenController = new ScreenController(this._window, this.viewController)
        this.initTools()
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
        this.selectionController = new SelectionController(selectUpdateSignal)
        this.tools.getToolUpdateSignal(ToolType.NAVIGATE).on(this.updateCamera.bind(this))

        //Init render on simulation tick
        this.viewController.subscribe(simulation.channels.update)

        this.initShortcuts()
    }

    setVariables(x) {
        this.simulation.setVariables(x)
        this.viewController.setOptions(x)
    }

    createLayout(layers) {
        const mouseCallbacks = this.screenController.getMouseCallbacks()

        for (const layer of layers) {
            const view = this.createView(layer)

            if (!view) {
                throw new Error(`View with name ${layer.view} not defined`)
            }

            this.viewController.addLayout(view, {
                name: layer.name,
                controlable: true,
            })
        }

        const selectedView = new SelectedView({
            simulation: this.simulation,
            radius: 10,
            updateSignal: this.selectionController.channels.update,
        })
        this.viewController.addLayout(selectedView, {
            name: '[selected]',
            controlable: false,
        })

        return this.viewController
            .scale(this.__scaleX, this.__scaleY)
            .translateFromCamera(this.camera)
            .applyTransform()
            .getLayers(mouseCallbacks)
    }

    createView(layer) {
        switch (layer.view) {
            case Layer.BUILDINGS: {
                return new BuildingsView({
                    ...layer.options,
                    clear: true,
                    simulation: this.simulation,
                })
            }

            case Layer.PHEROMONES: {
                return new PheromonesView({
                    ...layer.options,
                    clear: true,
                    simulation: this.simulation,
                })
            }

            case Layer.AGENTS: {
                return new AgentsView({
                    ...layer.options,
                    clear: true,
                    simulation: this.simulation,
                })
            }

            case Layer.EMITTERS: {
                return new EmittersView({
                    ...layer.options,
                    clear: true,
                    simulation: this.simulation,
                })
            }

            case Layer.OBSTACLES: {
                return new ObstacleView({
                    ...layer.options,
                    clear: true,
                    simulation: this.simulation,
                })
            }

            case Layer.ATTRACTORS: {
                return new AttractorsView({
                    ...layer.options,
                    clear: true,
                    simulation: this.simulation,
                })
            }
        }

        return null
    }

    initTools() {
        const mouseWorldCoordChannels = this.viewController.createScreenToWorldChannel(this.screenController.channels)

        const radius = 100
        this.tools = new ToolController()
        this.tools.register(ToolType.CONSOLE_EXPORT, new FnTool(({ simulation }) => {
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

            const attractors = simulation.environment.attractors.filter(
                x => x.getTag(Tag.TYPE) !== AttractorType.UNKNOWN
            )
            const customAttractors = simulation.environment.attractors.filter(
                x => x.getTag(Tag.TYPE) === AttractorType.UNKNOWN
            )

            const pheromonesNames = Array.from(simulation.environment.getPheromonesNamesIter())

            return {
                attractors: exportAttractors(attractors),
                customAttractors: exportAttractors(customAttractors),
                pheromones: pheromonesNames.map(name => ({
                    name,
                    values: exportPheromones(Array.from(
                        simulation.environment.getPheromones(name).getValuesIter()
                    ))
                })),
            }
        }))
        this.tools.register(ToolType.CONSOLE_DEBUG_EXPORT, new FnTool(({ simulation, viewController }) => ({
            agentsPoolSize: simulation.agents.size,
            viewportTransform: viewController.getTransform().toArray(),
        })))
        this.tools.register(ToolType.RESET_VIEW, new FnTool(({ viewController }) => {
            this.camera.location.setFrom(this.homeCameraPosition)

            viewController
                .resetTransform()
                .scale(this.__scaleX, this.__scaleY)
                .translateFromCamera(this.camera)
                .applyTransform()
        }))
        this.tools.register(ToolType.TOGGLE_UI, new FnTool(() => { }))
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
        this.tools.register(ToolType.SIMULATION_CONTROL_SWITCH, new SimulationControlSwitchTool())
        this.tools.register(ToolType.SIMULATION_CONTROL_STEP, new SimulationControlStepTool())
    }

    updateCamera() {
        this.viewController.applyTransform()
        this.viewController.render()
    }

    initShortcuts() {
        const options = {
            simulation: this.simulation,
            selectionController: this.selectionController,
            viewController: this.viewController,
        }
        const keyboard = new KeyboardController(this._document)
        const shortcut = new ShortcutController(keyboard.channels)
        shortcut.register('space', () => {
            this.tools.activate(ToolType.NAVIGATE, options)
        })
        shortcut.register('v', () => {
            this.tools.activate(ToolType.SELECT_AGENT, options)
        })
        shortcut.register('o', () => {
            this.tools.activate(ToolType.SELECT_OBSTACLE, options)
        })
        shortcut.register('e', () => {
            this.tools.activate(ToolType.SELECT_EMITTER, options)
        })
        shortcut.register('a', () => {
            this.tools.activate(ToolType.SELECT_ATTRACTOR, options)
        })
        shortcut.register('r', () => {
            this.tools.run(ToolType.SIMULATION_CONTROL_SWITCH, options)
        })
        shortcut.register('s', () => {
            this.tools.run(ToolType.SIMULATION_CONTROL_STEP, options)
        })
        shortcut.register('m', () => {
            this.tools.activate(ToolType.MOVE, options)
        })
        shortcut.register('h', () => {
            this.tools.activate(ToolType.RESET_VIEW, options)
        })
        shortcut.register('ctrl+l', () => {
            this.tools.run(ToolType.CONSOLE_DEBUG_EXPORT, options)
        })
        shortcut.register('backspace', () => {
            this.tools.run(ToolType.DELETE, options)
        })
        shortcut.register('ctrl+p', () => {
            this.tools.run(ToolType.CONSOLE_EXPORT, options)
        })
        shortcut.register('ctrl+a', () => {
            this.tools.activate(ToolType.ADD_ATTRACTOR)
        })
        shortcut.register('ctrl+b', () => {
            this.tools.activate(ToolType.TOGGLE_UI)
        })
    }
}
