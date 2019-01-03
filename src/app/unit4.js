import Simulation from '../swarm/Simulation'
import {max} from 'lodash'
import AgentPool from '../swarm/AgentPool'
import Agent from '../swarm/Agent'
import Environment from '../swarm/Environment'

import Vector from '../swarm/Vector'
import SeekNearestAttractorBehaviour from '../swarm/behaviours/SeekNearestAttractorBehaviour'
import SpreadPheromonesBehaviour from '../swarm/behaviours/SpreadPheromonesBehaviour'
import Pheromones from '../swarm/Pheromones'
import PathObstacle from '../swarm/PathObstacle'
import AvoidObstaclesBehavior from '../swarm/behaviours/AvoidObstaclesBehavior'
import InteractPheromonesBehaviour from '../swarm/behaviours/InteractPheromonesBehaviour'
import TtlBehavior from '../swarm/behaviours/TtlBehavior'
import ComposableBehavior from '../swarm/behaviours/ComposableBehavior'
import LimitAccelerationBehaviour from '../swarm/behaviours/LimitAccelerationBehaviour'
import SeekLocationBehaviour from '../swarm/behaviours/SeekLocationBehaviour'
import AgentBehaviour from '../swarm/AgentBehaviour'
import Emitter from '../swarm/Emitter'
import Attractor from '../swarm/Attractor'
import Id from '../swarm/Id'
import SeparateAgentsBehaviour from '../swarm/behaviours/SeparateAgentsBehaviour'
import RandomWalkBehaviour from '../swarm/behaviours/RandomWalkBehaviour'
import Unit4AgentBehaviour from '../swarm/behaviours/Unit4AgentBehaviour'
import Tag from '../swarm/Tag'
import ObstacleType from '../swarm/ObstacleType'
import AttractorType from '../swarm/AttractorType'
import Polygon from '../swarm/Polygon'
import {getCentroid} from '../swarm/lib/geometry'

let DATA

export function getLayers() {
    return [
        {
            name: 'Buildings',
            view: 'buildings',
            options: {
                fill: () => `#9099a3`,
            },
        },

        {
            name: 'Obstacles',
            view: 'obstacles',
            options: {}
        },

        {
            name: 'Emitters',
            view: 'emitters',
            options: {}
        },

        {
            name: 'Attractors',
            view: 'attractors',
            options: {}
        },

        {
            name: 'Agents',
            view: 'agents',
            options: {
                size: agent => {
                    const deviant = agent.getTag('deviant')
                    return deviant
                        ? 3
                        : 2
                },
                fill: agent => {
                    const deviant = agent.getTag('deviant')
                    return deviant
                        ? `rgb(200, 0, 200)`
                        : `rgb(200, 200, 0)`
                },
            },
        },

        {
            name: 'Pheromones: bus stop',
            view: 'pheromones',
            options: {
                pheromonesName: 'bus-stop',
                pheromoneVelocityMultiplier: 0.5,
                maxValue: 10,
                fill: alpha => `rgba(250, 250, 0, ${alpha})`,
            }
        },

        {
            name: 'Pheromones: metro',
            view: 'pheromones',
            options: {
                pheromonesName: 'metro',
                pheromoneVelocityMultiplier: 0.5,
                maxValue: 10,
                fill: alpha => `rgba(250, 0, 250, ${alpha})`,
            }
        },
    ]
}

export function getSettings() {
    return {
        backgroundColor: '#333f4d',
    }
}

export async function createSimulation() {
    const url = 'https://dl.dropboxusercontent.com/s/oxr12uwkjopc14n/SWARM.json'

    const res = await fetch(url)
    DATA = await res.json()

    console.log(DATA)

    const s = new Simulation()
    s.setAgents(new AgentPool())
    s.setEnvironment(createEnvironment())
    initBuildings(s)
    initEmitters(s)

    return s
}

export function getCameraCenter(simulation) {
    // const layer = simulation.layer('houses')
    // const cs = layer.data.map(x => x.getCentroid())

    // return getCentroid(cs)

    // return new Vector(-37.4301, -11163.837642)
    return new Vector(-100.608767, -11717.541285)
}

export function getInitialTransform() {
    return [0.5568374181775592, 0, 0, -0.5568374181775592, 1357.195464682499, -5731.555626626379]
}

function createAgent(loc) {
    const seekMetro = Math.random() < 0.3
    const radius = seekMetro
        ? 15000
        : 1500
    const ttl = seekMetro
        ? 5000
        : 1000
    const pheromonesName = seekMetro
        ? 'metro'
        : 'bus-stop'
    const attractorTypes = seekMetro
        ? [AttractorType.METRO_STATION, AttractorType.UNKNOWN]
        : [AttractorType.BUS_STOP, AttractorType.UNKNOWN]
    const dieAttractorTypes = seekMetro
        ? [AttractorType.METRO_STATION]
        : [AttractorType.BUS_STOP]

    const a = new Agent({
        behaviour: ComposableBehavior.compose(
            new TtlBehavior({
                ttl,
            }),
            new Unit4AgentBehaviour({
                radius,
                attractorTypes,
                dieAttractorTypes,
                pheromonesName,
            }),
            new AvoidObstaclesBehavior({
                accelerate: 0.5,
                predictionDistance: 20,
                radius: 150,
            }),
            new LimitAccelerationBehaviour({
                limit: .15,
            })
        )
    })
    a.damp = 0.85
    a.location.set(loc.x, loc.y)

    // a.velocity.set(-3, -5)

    a.addBehaviour(AgentBehaviour.SEEK_LOCATION, new SeekLocationBehaviour({
        threshold: 5,
    }))
    a.addTag('deviant', seekMetro)

    return a
}

function createEmitter(coord, period, amount) {
    return new Emitter({
        x: coord.x,
        y: coord.y,
        period,
        amount,
        factory: createAgent,
    })
}

function createEnvironment() {
    const env = new Environment()
    env.addPheromones('bus-stop', new Pheromones({
        cellSize: 5,
        damp: 0.99,
    }))
    env.addPheromones('metro', new Pheromones({
        cellSize: 5,
        damp: 0.99,
    }))

    initAttractors(env)
    initObstacles(env)

    return env
}

function createAttractor({x, y, power}) {
    const id = Id.get('attractor')
    return new Attractor({id, x, y, power})
}

function initAttractors(env) {
    const busStops = getBusStops()
    const metroStations = getMetroStations()

    const f = (as, type) => {
        as.forEach((coord) => {
            const a = createAttractor({
                x: coord.x,
                y: coord.y,
                power: 100,
            })
            a.addTag(Tag.TYPE, type)
            env.addAttractor(a)
        })
    }

    f(busStops, AttractorType.BUS_STOP)
    f(metroStations, AttractorType.METRO_STATION)
}

function getMetroStations() {
    const as = [
          // createPointFromArray([719.391233, -12553.041285, 0.0])   
    ]

    return [
        ...as,
        ...getLayer('METRO').objects.map(importPoint),
    ]
}

function getBusStops() {
    return [
        new Vector(-1642.782785, -12079.318041),
        new Vector(-1730.530358, -12172.137168),
        new Vector(-1353.044149, -12426.632504),
        new Vector(-1359.409833, -12554.889648),
        new Vector(-652.588642, -12677.756951),
        new Vector(-547.430618, -12803.310201),
        new Vector(-704.318864, -11773.650068),
        new Vector(-680.773157, -11691.490047),
        new Vector(-1137.785989, -11036.877481),
        new Vector(-1112.681908, -11101.005916),
        new Vector(-905.356142, -11140.755821),
        new Vector(-1313.544724, -11391.836526),
        new Vector(-1136.02036, -11402.846856),
        new Vector(-867.461708, -11368.509832),
        new Vector(-809.148262, -11292.68816),
        new Vector(-100.608767, -11717.541285),
        new Vector(-21.557283, -12655.844973),
        new Vector(-11.888078, -12771.366302),
        new Vector(490.723941, -12806.597514),
        new Vector(499.27184, -12703.384365),
        new Vector(948.701144, -12697.880717),
        new Vector(934.003344, -12783.978951),
        new Vector(313.581146, -11378.017533),
        new Vector(357.557512, -11499.070763),
        new Vector(-81.646752, -11612.490407),
        new Vector(-666.381546, -11407.386939),
        new Vector(-659.957733, -10389.397718),
        new Vector(-298.527641, -10544.399481),
        new Vector(39.718302, -11013.959078),
        new Vector(55.416866, -10952.752156),
        new Vector(-682.994473, -10971.070441),
        new Vector(-553.325813, -10939.202835),
        new Vector(285.86815, -11376.843058),
        new Vector(25.461913, -10949.069798),
        new Vector(-311.594923, -10531.244999),
        new Vector(-675.804336, -10384.219142),
        new Vector(-2034.014543, -10182.379589),
        new Vector(-2323.050289, -10590.999095),
        new Vector(-2585.877463, -11125.236453),
        new Vector(-2438.300314, -12021.424138),
        new Vector(-2191.142785, -12821.556831),
        new Vector(-1249.249898, -13747.902649),
        new Vector(-743.763619, -13557.421399),
        new Vector(-434.942828, -13336.644475),
        new Vector(-237.098569, -12723.529051),
        new Vector(-1380.091221, -12473.187669),
        new Vector(-1956.747187, -11805.156208),
        new Vector(962.275553, -12727.659706),
        new Vector(2151.490511, -12741.011999),
        new Vector(526.203482, -11743.99815),
        new Vector(226.590261, -12060.018937),
        new Vector(201.958142, -12106.437177),
        new Vector(-161.388614, -12859.922853),
    ]
}

function initEmitters(simulation) {
    const emitters = [
        [new Vector(1048.620151, -11742.622169), 0.150639],
        [new Vector(-402.401349, -11011.768235), 0.088097],
        [new Vector(177.636893, -12551.458418), 0.172831],
        [new Vector(106.298666, -12557.989932), 0.172831],
        [new Vector(-116.764964, -11168.292825), 0.421654],
        [new Vector(1106.06022, -12226.936133), 0.173504],
        [new Vector(1073.061226, -12329.527494), 0.173504],
        [new Vector(1138.622595, -12292.042482), 0.173504],
        [new Vector(1169.138411, -12296.862044), 0.412239],
        [new Vector(-526.796558, -11117.458576), 0.089442],
        [new Vector(-241.849483, -11158.973057), 0.148621],
        [new Vector(341.070726, -12877.771571), 0.458642],
        [new Vector(713.408951, -12380.07909), 0.183591],
        [new Vector(690.429433, -12328.904202), 0.183591],
        [new Vector(627.048402, -12350.660331), 0.183591],
        [new Vector(467.740465, -12632.476207), 0.260256],
        [new Vector(425.476437, -12585.106331), 0.260256],
        [new Vector(502.349629, -12511.482236), 0.260256],
        [new Vector(548.75966, -12559.926524), 0.260256],
        [new Vector(455.639278, -12883.083874), 0.501009],
        [new Vector(-734.45207, -11097.925478), 0.410894],
        [new Vector(-581.574153, -11104.746253), 0.410894],
        [new Vector(-721.296341, -11279.24014), 0.410894],
        [new Vector(1026.340718, -11764.693326), 0.486886],
        [new Vector(938.662626, -11827.953677), 0.486886],
        [new Vector(284.137224, -12125.005721), 0.335575],
        [new Vector(-307.954516, -11184.686158), 0.148621],
        [new Vector(914.619569, -11845.876565), 0.585071],
        [new Vector(826.522583, -11909.259926), 0.585071],
        [new Vector(144.600484, -12160.301281), 0.301278],
        [new Vector(100.816014, -12233.035641), 0.301278],
        [new Vector(183.197365, -12266.089641), 0.301278],
        [new Vector(966.707184, -12255.101521), 0.496301],
        [new Vector(589.672737, -11942.925754), 0.364492],
        [new Vector(262.962441, -11466.443751), 0.400807],
        [new Vector(316.707394, -11562.30596), 0.400807],
        [new Vector(168.525519, -11358.419472), 0.359112],
        [new Vector(239.69268, -11440.871168), 0.359112],
        [new Vector(-362.982711, -11278.287604), 0.148621],
        [new Vector(-369.232336, -11331.165435), 0.148621],
        [new Vector(-353.661039, -11204.174484), 0.148621],
        [new Vector(-357.703188, -11234.00621), 0.148621],
        [new Vector(-75.080578, -12182.686937), 0.193679],
        [new Vector(-1.235094, -12134.663106), 0.193679],
        [new Vector(-64.911022, -12115.825958), 0.193679],
        [new Vector(99.576357, -12069.579169), 0.193679],
        [new Vector(25.799236, -12117.688414), 0.193679],
        [new Vector(35.755873, -12050.554616), 0.193679],
        [new Vector(-58.736486, -11504.149659), 0.420982],
        [new Vector(33.818765, -11574.371856), 0.420982],
        [new Vector(186.358763, -11676.040244), 0.806994],
        [new Vector(-140.98355, -12081.01642), 0.193679],
        [new Vector(-66.834995, -12033.479606), 0.193679],
        [new Vector(-76.20528, -12099.816805), 0.193679],
        [new Vector(-39.232213, -12017.430121), 0.166779],
        [new Vector(33.724464, -11968.005086), 0.166779],
        [new Vector(17.973788, -12038.662378), 0.166779],
        [new Vector(266.574083, -11818.061307), 0.178884],
        [new Vector(340.02366, -11769.421901), 0.178884],
        [new Vector(333.782295, -11834.004949), 0.178884],
        [new Vector(331.124941, -11917.646879), 0.199731],
        [new Vector(406.42208, -11871.872293), 0.199731],
        [new Vector(340.575749, -11852.954908), 0.199731],
        [new Vector(-21.337158, -11311.960571), 0.691997],
        [new Vector(107.928664, -11226.382534), 0.400807],
        [new Vector(159.591144, -11323.594542), 0.400807],
        [new Vector(13.321971, -11121.175355), 0.361802],
        [new Vector(81.560909, -11205.528463), 0.361802],
        [new Vector(78.767401, -12258.450922), 0.310693],
        [new Vector(72.06894, -12338.072274), 0.310693],
        [new Vector(715.896524, -12988.398065), 0.759247],
        [new Vector(569.91621, -12404.806563), 0.209818],
        [new Vector(607.181607, -12455.571103), 0.209818],
        [new Vector(647.353075, -12181.786732), 0.199059],
        [new Vector(723.452399, -12179.234092), 0.199059],
        [new Vector(719.989739, -12295.53573), 0.29388],
        [new Vector(819.904017, -12286.541957), 0.29388],
        [new Vector(82.505902, -11856.593035), 0.387357],
        [new Vector(95.422437, -11886.000406), 0.365165],
        [new Vector(257.187362, -11862.217189), 0.674512],
        [new Vector(554.567691, -12339.454447), 0.381305],
        [new Vector(506.522622, -12287.825649), 0.381305],
        [new Vector(-24.727835, -11272.53156), 0.478144],
        [new Vector(-82.547237, -11185.059308), 0.478144],
        [new Vector(-155.487125, -11231.783331), 0.478144],
        [new Vector(-118.254478, -11895.234989), 0.264963],
        [new Vector(-45.648319, -11846.012448), 0.264963],
        [new Vector(-38.983272, -11934.561418), 0.264963],
        [new Vector(-300.989356, -10903.100522), 0.667115],
        [new Vector(-415.643289, -10951.610083), 0.667115],
        [new Vector(-135.779452, -11925.730794), 0.533961],
        [new Vector(-2.855836, -11094.854717), 0.244788],
        [new Vector(30.606988, -11004.367331), 0.244788],
        [new Vector(-52.825101, -11011.8583), 0.244788],
        [new Vector(-485.005922, -11014.470524), 1],
        [new Vector(-371.363223, -10716.487128), 0.67115],
        [new Vector(-595.410981, -10792.494143), 0.67115],
        [new Vector(-450.118927, -10811.739862), 0.67115],
        [new Vector(-360.137319, -10672.220649), 0.710155],
        [new Vector(-99.266264, -10820.479021), 0.32078],
        [new Vector(-79.748031, -10930.477851), 0.32078],
        [new Vector(-193.617171, -10899.656084), 0.32078],
        [new Vector(976.154672, -12448.602841), 0.997983],
        [new Vector(1027.644179, -12410.441256), 0.383322],
        [new Vector(493.981718, -12007.461592), 0.188299],
        [new Vector(427.532058, -12065.76714), 0.188299],
        [new Vector(491.187311, -12066.16083), 0.188299],
        [new Vector(-287.92744, -11402.86659), 0.148621],
        [new Vector(-330.335703, -11361.407644), 0.148621],
        [new Vector(-250.910766, -11329.248696), 0.148621],
        [new Vector(644.626803, -12262.754461), 0.447209],
        [new Vector(572.48227, -12190.645414), 0.447209],
        [new Vector(800.332925, -12190.095952), 0.216543],
        [new Vector(854.374344, -12232.300864), 0.216543],
        [new Vector(625.367508, -12955.050374), 0.764627],
        [new Vector(-575.12036, -10839.21288), 0.368527],
        [new Vector(-601.828083, -10940.947335), 0.368527],
        [new Vector(813.673723, -12143.440945), 0.237391],
        [new Vector(698.055544, -12103.241275), 0.237391],
        [new Vector(738.013708, -12170.09325), 0.237391],
        [new Vector(438.664028, -12440.568188), 0.215871],
        [new Vector(359.443492, -12514.21028), 0.215871],
        [new Vector(369.922454, -12435.150637), 0.215871],
        [new Vector(257.774504, -12608.271609), 0.215871],
        [new Vector(336.618171, -12534.228095), 0.215871],
        [new Vector(260.089647, -12535.891561), 0.215871],
        [new Vector(-817.761704, -10948.851498), 0.538668],
        [new Vector(-678.930322, -10958.857974), 0.538668],
        [new Vector(1077.882595, -11794.882201), 0.150639],
        [new Vector(-434.117677, -11038.714308), 0.221251],
        [new Vector(-495.08023, -11090.512503), 0.220578],
        [new Vector(-61.489783, -12467.284325), 0.156691],
        [new Vector(-32.716326, -12502.960209), 0.156691],
        [new Vector(50.724672, -12402.610408), 0.156691],
        [new Vector(40.343639, -12468.110769), 0.156691],
        [new Vector(399.31948, -12082.530391), 0.188299],
        [new Vector(319.361398, -12120.149679), 0.188299],
        [new Vector(374.319794, -12142.093037), 0.188299],
    ]

    const maxPeriod = max(
        emitters.map(x => x[1])
    )

    emitters.forEach(([coord, period]) => {
        const p = (maxPeriod / period) * 300
        simulation.addEmitter(createEmitter(coord, p, 1))
    })
}

function initObstacles(env) {
    const roads = getRoads()
    const buildings = [
        [
            new Vector(-561.331198, -11290.907972),
            new Vector(-524.049205, -11294.984255),
            new Vector(-527.071873, -11320.428967),
            new Vector(-564.495934, -11316.727119),
        ],

        [
            new Vector(325.366329, -11214.131585),
            new Vector(348.924798, -11214.099582),
            new Vector(348.924798, -11237.047191),
            new Vector(325.366329, -11237.047191),
        ],

        [
            new Vector(-118.241779, -12326.657305),
            new Vector(-125.60704, -12341.893417),
            new Vector(-158.874859, -12334.17549),
            new Vector(-148.232234, -12312.159675),
        ],

        [
            new Vector(-148.232234, -12312.159675),
            new Vector(-141.703884, -12298.654836),
            new Vector(-111.71343, -12313.152467),
            new Vector(-118.241779, -12326.657305),
        ],

        [
            new Vector(-141.703884, -12298.654836),
            new Vector(-129.042181, -12272.462263),
            new Vector(-99.051726, -12286.959894),
            new Vector(-111.71343, -12313.152467),
        ],

        [
            new Vector(-129.042181, -12272.462263),
            new Vector(-122.513832, -12258.957425),
            new Vector(-92.523377, -12273.455056),
            new Vector(-99.051726, -12286.959894),
        ],

        [
            new Vector(-122.513832, -12258.957425),
            new Vector(-106.435513, -12225.697088),
            new Vector(-83.238291, -12254.247507),
            new Vector(-92.523377, -12273.455056),
        ],

        [
            new Vector(-202.715306, -12087.631992),
            new Vector(-190.488591, -12090.252788),
            new Vector(-178.847146, -12107.97098),
            new Vector(-181.338711, -12119.290625),
            new Vector(-229.867909, -12108.608873),
            new Vector(-228.216506, -12101.106242),
            new Vector(-206.726126, -12105.906783),
        ],

        [
            new Vector(-206.726126, -12105.906783),
            new Vector(-199.78142, -12074.26412),
            new Vector(-221.388606, -12069.733725),
            new Vector(-228.216506, -12101.106242),
        ],

        [
            new Vector(-413.714947, -11014.819331),
            new Vector(-460.995104, -11054.988374),
            new Vector(-471.911444, -11042.139518),
            new Vector(-424.631287, -11001.970474),
        ],

        [
            new Vector(-424.631287, -11001.970474),
            new Vector(-408.478788, -10988.247372),
            new Vector(-397.562448, -11001.096229),
            new Vector(-413.714947, -11014.819331),
        ],

        [
            new Vector(-532.77682, -11093.855151),
            new Vector(-485.691019, -11053.851231),
            new Vector(-474.774679, -11066.700088),
            new Vector(-521.86048, -11106.704007),
        ],

        [
            new Vector(-521.86048, -11106.704007),
            new Vector(-538.207335, -11120.592234),
            new Vector(-549.123675, -11107.743377),
            new Vector(-532.77682, -11093.855151),
        ],

        [
            new Vector(-228.145656, -11148.333566),
            new Vector(-253.349769, -11158.237055),
            new Vector(-260.462687, -11140.134871),
            new Vector(-235.258574, -11130.231381),
        ],

        [
            new Vector(-293.834734, -11173.917504),
            new Vector(-319.038847, -11183.820994),
            new Vector(-326.151765, -11165.718809),
            new Vector(-300.947652, -11155.81532),
        ],

        [
            new Vector(-341.724573, -11193.555651),
            new Vector(-366.551833, -11204.369232),
            new Vector(-374.318401, -11186.537711),
            new Vector(-349.49114, -11175.72413),
        ],

        [
            new Vector(-308.161895, -10750.906287),
            new Vector(-220.228513, -10855.701063),
            new Vector(-247.423123, -10878.520082),
            new Vector(-335.356504, -10773.725306),
        ],

        [
            new Vector(-195.252429, -10654.781096),
            new Vector(-149.954047, -10720.46499),
            new Vector(-131.598039, -10704.257445),
            new Vector(-135.670104, -10699.645589),
            new Vector(-142.463066, -10693.071814),
            new Vector(-154.449178, -10682.884796),
            new Vector(-168.207688, -10672.14724),
            new Vector(-181.966198, -10661.409685),
        ],

        [
            new Vector(-138.488611, -10737.087091),
            new Vector(-119.061789, -10720.145831),
            new Vector(-102.352074, -10747.439544),
            new Vector(-85.642359, -10774.733256),
            new Vector(-102.521994, -10789.229962),
        ],

        [
            new Vector(-218.277693, -11217.344974),
            new Vector(-198.233376, -11229.0709),
            new Vector(-210.617465, -11250.240284),
            new Vector(-213.068717, -11257.602766),
            new Vector(-215.804583, -11282.159476),
            new Vector(-238.88408, -11279.595087),
            new Vector(-236.162978, -11255.105169),
            new Vector(-230.678811, -11238.499823),
        ],

        [
            new Vector(-363.864682, -11243.519),
            new Vector(-390.756308, -11240.330451),
            new Vector(-388.466217, -11221.016255),
            new Vector(-361.574591, -11224.204804),
        ],

        [
            new Vector(-368.821768, -11285.326144),
            new Vector(-395.713395, -11282.137595),
            new Vector(-393.423304, -11262.823399),
            new Vector(-366.531678, -11266.011948),
        ],

        [
            new Vector(-375.191802, -11339.049814),
            new Vector(-402.083428, -11335.861265),
            new Vector(-399.793337, -11316.547069),
            new Vector(-372.901711, -11319.735618),
        ],

        [
            new Vector(137.346128, -12053.388362),
            new Vector(172.107383, -12030.970132),
            new Vector(184.064593, -12049.510741),
            new Vector(156.539791, -12067.262036),
            new Vector(144.636404, -12064.692517),
        ],

        [
            new Vector(361.807348, -11750.745938),
            new Vector(378.185075, -11740.088468),
            new Vector(386.899137, -11753.479688),
            new Vector(370.52141, -11764.137158),
        ],

        [
            new Vector(390.972939, -11649.469593),
            new Vector(407.350666, -11638.812123),
            new Vector(416.064727, -11652.203344),
            new Vector(399.687001, -11662.860813),
        ],

        [
            new Vector(451.922824, -11821.208823),
            new Vector(489.661803, -11796.744444),
            new Vector(507.333924, -11824.005622),
            new Vector(494.808432, -11832.125301),
            new Vector(497.755052, -11836.670786),
            new Vector(484.531376, -11845.243064),
            new Vector(481.584756, -11840.697579),
            new Vector(469.594945, -11848.470002),
        ],

        [
            new Vector(-28.874272, -12339.373014),
            new Vector(-20.857656, -12334.174157),
            new Vector(-3.716573, -12360.516796),
            new Vector(-35.587815, -12381.185618),
            new Vector(-41.79345, -12371.616553),
        ],

        [
            new Vector(18.401072, -12613.193976),
            new Vector(18.889132, -12600.621036),
            new Vector(26.274876, -12600.907738),
            new Vector(26.561577, -12593.521994),
            new Vector(33.947321, -12593.808696),
            new Vector(34.234023, -12586.422952),
            new Vector(68.418311, -12587.749927),
            new Vector(67.356847, -12615.094355),
        ],

        [
            new Vector(186.512706, -12620.311178),
            new Vector(213.5441, -12595.27214),
            new Vector(240.71446, -12624.63735),
            new Vector(232.108098, -12632.600445),
            new Vector(194.376592, -12628.844408),
        ],

        [
            new Vector(657.83117, -11965.841588),
            new Vector(674.740698, -11954.89501),
            new Vector(691.573369, -11980.896972),
            new Vector(674.663841, -11991.84355),
        ],

        [
            new Vector(338.167528, -12637.607332),
            new Vector(387.418628, -12592.044305),
            new Vector(436.316964, -12644.892698),
            new Vector(422.106654, -12658.040885),
            new Vector(409.866896, -12644.812386),
            new Vector(398.174374, -12655.630971),
            new Vector(385.964965, -12642.435273),
            new Vector(374.301435, -12653.227032),
            new Vector(362.076851, -12640.014934),
            new Vector(350.397356, -12650.819958),
        ],

        [
            new Vector(887.920768, -12132.925552),
            new Vector(921.879332, -12169.624814),
            new Vector(903.714341, -12186.433245),
            new Vector(869.755777, -12149.733983),
        ],

        [
            new Vector(986.02661, -12561.990905),
            new Vector(1010.314351, -12532.765819),
            new Vector(1041.077599, -12558.331862),
            new Vector(1016.789859, -12587.556948),
        ],

        [
            new Vector(1246.183052, -12353.970988),
            new Vector(1263.311904, -12359.502932),
            new Vector(1246.737201, -12410.824068),
            new Vector(1229.608348, -12405.292124),
        ],

        [
            new Vector(909.653545, -12647.121434),
            new Vector(966.424222, -12641.789603),
            new Vector(970.20254, -12668.965202),
            new Vector(906.298406, -12675.999101),
        ],

        [
            new Vector(988.264478, -12666.328544),
            new Vector(984.126789, -12639.454455),
            new Vector(1057.815956, -12626.227466),
            new Vector(1074.666907, -12649.673095),
        ],

        [
            new Vector(883.8208, -12649.548027),
            new Vector(883.8208, -12677.260403),
            new Vector(858.8208, -12679.016288),
            new Vector(858.8208, -12651.299461),
        ],

        [
            new Vector(765.022736, -12656.137577),
            new Vector(829.313337, -12649.854368),
            new Vector(828.745608, -12679.625503),
            new Vector(767.174029, -12682.065088),
        ],

        [
            new Vector(1295.04282, -12296.272594),
            new Vector(1430.218281, -12338.581626),
            new Vector(1417.651667, -12378.731393),
            new Vector(1281.90553, -12385.091517),
            new Vector(1279.080628, -12342.730594),
        ],

        [
            new Vector(1445.602011, -12343.396633),
            new Vector(1505.715441, -12362.211742),
            new Vector(1499.543393, -12381.93116),
            new Vector(1432.558645, -12385.069602),
        ],

        [
            new Vector(587.576478, -12666.603572),
            new Vector(615.703738, -12640.610204),
            new Vector(640.237171, -12667.157678),
            new Vector(632.861377, -12674.527967),
            new Vector(593.909631, -12673.022649),
        ],

        [
            new Vector(906.818224, -12804.350101),
            new Vector(1031.220257, -12783.620963),
            new Vector(1031.220257, -12794.337003),
            new Vector(1004.139383, -12817.179908),
            new Vector(906.818224, -12832.251736),
        ],

        [
            new Vector(858.8208, -12810.315254),
            new Vector(883.8208, -12807.496023),
            new Vector(883.8208, -12851.996385),
            new Vector(858.8208, -12855.175494),
        ],

        [
            new Vector(765.699235, -12819.700202),
            new Vector(828.665792, -12813.69824),
            new Vector(828.648259, -12843.148715),
            new Vector(767.244052, -12848.507054),
        ],

        [
            new Vector(747.69891, -12820.761893),
            new Vector(749.35713, -12848.58856),
            new Vector(693.350375, -12851.660109),
            new Vector(690.912286, -12823.720681),
        ],

        [
            new Vector(1078.210994, -11742.005812),
            new Vector(1062.685109, -11719.794173),
            new Vector(1046.538641, -11731.080518),
            new Vector(1062.064527, -11753.292157),
        ],

        [
            new Vector(1105.890094, -11791.837121),
            new Vector(1090.364208, -11769.625483),
            new Vector(1074.217741, -11780.911827),
            new Vector(1089.743626, -11803.123466),
        ],

        [
            new Vector(1124.985026, -11719.877765),
            new Vector(1141.848258, -11708.104354),
            new Vector(1113.139879, -11666.984916),
            new Vector(1096.276646, -11678.758328),
        ],

        [
            new Vector(-369.543946, -12142.249827),
            new Vector(-149.177889, -12192.759946),
            new Vector(-167.272731, -12271.704302),
            new Vector(-242.704576, -12309.480186),
            new Vector(-399.476006, -12273.546596),
        ],

        [
            new Vector(-427.098186, -12149.75693),
            new Vector(-396.755649, -12156.788122),
            new Vector(-407.234846, -12202.010243),
            new Vector(-437.577383, -12194.979051),
        ],

        [
            new Vector(-368.033165, -12369.982292),
            new Vector(-278.805951, -12379.141442),
            new Vector(-294.372372, -12530.787436),
            new Vector(-383.504584, -12521.698059),
        ],

        [
            new Vector(-235.584646, -12457.769525),
            new Vector(-172.186416, -12463.184105),
            new Vector(-182.093809, -12587.739479),
            new Vector(-246.151525, -12582.644196),
        ],

        [
            new Vector(-384.839428, -12535.319508),
            new Vector(-323.967292, -12541.216143),
            new Vector(-327.444866, -12576.179646),
            new Vector(-388.227157, -12570.291715),
        ],

        [
            new Vector(-390.184575, -12590.498532),
            new Vector(-329.414817, -12596.385249),
            new Vector(-332.686625, -12631.367997),
            new Vector(-393.694189, -12625.662184),
        ],

        [
            new Vector(813.620555, -12406.739325),
            new Vector(845.115555, -12406.710984),
            new Vector(845.13624, -12431.686195),
            new Vector(813.641239, -12431.714535),
        ],

        [
            new Vector(92.323187, -11408.326676),
            new Vector(117.162144, -11446.643482),
            new Vector(110.753836, -11450.797683),
            new Vector(72.021318, -11421.410876),
        ],

        [
            new Vector(18.721469, -11692.707441),
            new Vector(43.846617, -11701.248437),
            new Vector(102.805812, -11706.866517),
            new Vector(136.565064, -11706.396462),
            new Vector(68.196515, -11600.931119),
            new Vector(-8.243606, -11650.012106),
        ],

        [
            new Vector(-508.385581, -11296.696861),
            new Vector(-576.631767, -11289.235061),
            new Vector(-587.049108, -11361.406275),
            new Vector(-517.777681, -11369.504131),
        ],

        [
            new Vector(-659.306802, -10936.904201),
            new Vector(-749.648134, -11012.549343),
            new Vector(-753.934083, -11007.36259),
            new Vector(-759.415511, -11011.892037),
            new Vector(-817.114635, -10943.131823),
            new Vector(-721.445924, -10862.852829),
            new Vector(-659.387292, -10936.808282),
        ],

        [
            new Vector(474.812363, -12070.875687),
            new Vector(466.925417, -12058.25586),
            new Vector(439.472199, -12076.01236),
            new Vector(393.327942, -12004.672169),
            new Vector(458.982916, -11962.205223),
            new Vector(513.092897, -12046.060245),
            new Vector(474.805861, -12070.879902),
        ],

        [
            new Vector(-320.999015, -11324.987191),
            new Vector(-329.048297, -11392.958259),
            new Vector(-248.035783, -11402.563939),
            new Vector(-239.970334, -11334.54145),
            new Vector(-320.992778, -11324.934592),
        ],

        [
            new Vector(-1417.930505, -13015.418329),
            new Vector(-1372.907973, -13080.151408),
            new Vector(-1336.190334, -13054.613907),
            new Vector(-1381.213893, -12989.881186),
        ],

        [
            new Vector(366.981268, -12896.494625),
            new Vector(384.106899, -12891.078909),
            new Vector(391.516342, -12819.477078),
            new Vector(321.547528, -12812.204112),
            new Vector(317.815182, -12848.110754),
            new Vector(366.994304, -12896.535849),
        ],

        [
            new Vector(616.992358, -12366.524776),
            new Vector(678.182577, -12432.659239),
            new Vector(721.085567, -12392.963697),
            new Vector(712.664271, -12383.861951),
            new Vector(702.821534, -12373.085347),
            new Vector(714.730074, -12361.902502),
            new Vector(680.821061, -12325.189785),
            new Vector(684.270007, -12321.985568),
            new Vector(675.352942, -12312.347993),
            new Vector(616.902996, -12366.428194),
        ],

        [
            new Vector(511.514395, -12252.876724),
            new Vector(582.853859, -12186.878225),
            new Vector(588.763787, -12184.615977),
            new Vector(642.890797, -12243.139428),
            new Vector(631.409993, -12253.792124),
            new Vector(657.542306, -12282.146882),
            new Vector(593.020897, -12341.49215),
            new Vector(511.533218, -12252.897053),
        ],

        [
            new Vector(-621.477252, -10951.510481),
            new Vector(-716.044242, -10842.393997),
            new Vector(-639.077862, -10777.009855),
            new Vector(-540.994854, -10883.138796),
        ],

        [
            new Vector(-363.350182, -10732.929932),
            new Vector(-450.61581, -10630.205921),
            new Vector(-612.934522, -10764.528752),
            new Vector(-525.146756, -10867.883422),
        ],

        [
            new Vector(-285.288165, -10645.102817),
            new Vector(-364.877909, -10555.380648),
            new Vector(-417.285781, -10601.87004),
            new Vector(-337.696036, -10691.592209),
        ],

        [
            new Vector(-32.914265, -10962.771866),
            new Vector(-60.012996, -11052.280535),
            new Vector(-76.24142, -11061.986711),
            new Vector(-41.768102, -11115.070966),
            new Vector(50.05718, -11054.301892),
            new Vector(-3.174886, -10947.901258),
        ],

        [
            new Vector(-245.663965, -10964.162607),
            new Vector(-276.45, -10927.964285),
            new Vector(-417.83, -11048.18),
            new Vector(-408.31, -11059.37),
            new Vector(-436.15, -11083.04),
            new Vector(-390.27, -11137.03),
            new Vector(-384.258016, -11151.412425),
            new Vector(-167.18, -11084.75),
            new Vector(-137.381481, -11050.314824),
            new Vector(-176.962151, -11021.549965),
        ],

        [
            new Vector(-549.933306, -11063.126578),
            new Vector(-436.560538, -10966.814765),
            new Vector(-493.002869, -10900.380051),
            new Vector(-606.375609, -10996.691897),
        ],

        [
            new Vector(-295.828006, -10914.684552),
            new Vector(-380.099345, -10986.279925),
            new Vector(-453.527242, -10899.265474),
            new Vector(-448.584122, -10861.90026),
            new Vector(-407.779742, -10826.698915),
            new Vector(-368.075301, -10830.937579),
        ],

        [
            new Vector(104.176535, -12449.890548),
            new Vector(174.398641, -12388.579643),
            new Vector(182.498739, -12368.544672),
            new Vector(255.302688, -12296.608723),
            new Vector(225.452192, -12250.254737),
            new Vector(48.592807, -12364.14657),
        ],

        [
            new Vector(-176.51135, -11874.436184),
            new Vector(-168.348723, -11886.957038),
            new Vector(-116.599393, -11962.611701),
            new Vector(-109.03713, -11974.276607),
            new Vector(-175.992087, -12017.643074),
            new Vector(-211.831463, -11962.144347),
            new Vector(-195.223572, -11886.691594),
        ],

        [
            new Vector(-140.948045, -11851.258865),
            new Vector(-75.535765, -11952.287558),
            new Vector(-10.0097, -11909.832536),
            new Vector(-75.412547, -11808.909272),
        ],

        [
            new Vector(96.104544, -11842.559551),
            new Vector(33.2079, -11883.330106),
            new Vector(1.835107, -11834.713233),
            new Vector(64.517118, -11793.829703),
        ],

        [
            new Vector(118.250918, -11876.779451),
            new Vector(55.288321, -11917.44808),
            new Vector(86.130577, -11964.978939),
            new Vector(149.108283, -11924.552388),
        ],

        [
            new Vector(152.30494, -11853.296808),
            new Vector(217.919974, -11810.753803),
            new Vector(292.238978, -11925.398991),
            new Vector(282.011406, -11932.029037),
            new Vector(281.358658, -11931.022101),
            new Vector(275.06531, -11935.101779),
            new Vector(273.270252, -11932.332706),
            new Vector(268.343771, -11935.525537),
            new Vector(195.294738, -11919.409082),
        ],

        [
            new Vector(252.948506, -11787.944847),
            new Vector(318.562604, -11745.400397),
            new Vector(360.803324, -11810.546069),
            new Vector(295.189226, -11853.090518),
        ],

        [
            new Vector(311.28025, -11877.907458),
            new Vector(376.887511, -11835.36845),
            new Vector(419.12659, -11900.513135),
            new Vector(353.512031, -11943.056874),
        ],

        [
            new Vector(-154.048545, -12051.796896),
            new Vector(-88.433511, -12009.253892),
            new Vector(-46.193727, -12074.398119),
            new Vector(-111.807825, -12116.942568),
        ],

        [
            new Vector(-53.36195, -11986.511296),
            new Vector(12.253084, -11943.968291),
            new Vector(54.492868, -12009.112519),
            new Vector(-11.12123, -12051.656968),
        ],

        [
            new Vector(-95.724805, -12141.76315),
            new Vector(-30.110246, -12099.219411),
            new Vector(12.130266, -12164.363165),
            new Vector(-53.485726, -12206.907834),
        ],

        [
            new Vector(4.962497, -12076.478639),
            new Vector(70.577055, -12033.9349),
            new Vector(112.816134, -12099.079584),
            new Vector(47.202512, -12141.624768),
        ],

        [
            new Vector(-100.696008, -11537.048736),
            new Vector(4.372396, -11468.704916),
            new Vector(90.173267, -11525.187616),
            new Vector(82.089787, -11537.466514),
            new Vector(-46.444495, -11620.791882),
        ],

        [
            new Vector(142.175303, -11687.539171),
            new Vector(234.492492, -11652.410237),
            new Vector(245.799028, -11645.080822),
            new Vector(226.071257, -11614.648276),
            new Vector(132.680739, -11553.208228),
            new Vector(78.039141, -11588.600845),
        ],

        [
            new Vector(211.374747, -11505.731847),
            new Vector(301.807239, -11447.109579),
            new Vector(356.081472, -11530.836647),
            new Vector(265.650774, -11589.458552),
        ],

        [
            new Vector(134.135219, -11386.577378),
            new Vector(224.567346, -11327.954547),
            new Vector(277.87529, -11410.187528),
            new Vector(187.443003, -11468.810463),
        ],

        [
            new Vector(55.927566, -11265.927721),
            new Vector(146.360693, -11207.306433),
            new Vector(200.634291, -11291.032521),
            new Vector(110.203593, -11349.654427),
        ],

        [
            new Vector(-49.771566, -11344.023342),
            new Vector(33.908837, -11399.331176),
            new Vector(70.881727, -11375.250725),
            new Vector(17.377941, -11292.716075),
            new Vector(-41.057292, -11330.597208),
        ],

        [
            new Vector(-20.082967, -11148.670933),
            new Vector(70.327424, -11090.062192),
            new Vector(123.635208, -11172.295276),
            new Vector(33.224817, -11230.904018),
        ],

        [
            new Vector(-1.16466, -12287.390238),
            new Vector(40.942837, -12352.345656),
            new Vector(106.457156, -12309.87585),
            new Vector(53.326505, -12227.916012),
        ],

        [
            new Vector(87.095687, -12203.162987),
            new Vector(165.675485, -12152.250305),
            new Vector(234.69036, -12226.811266),
            new Vector(141.532695, -12287.138052),
        ],

        [
            new Vector(-59.751298, -12498.101518),
            new Vector(-53.733294, -12431.339439),
            new Vector(28.758383, -12377.864022),
            new Vector(70.894898, -12442.8642),
            new Vector(-12.544086, -12497.221843),
            new Vector(-43.618669, -12499.59576),
        ],

        [
            new Vector(404.421441, -12098.682883),
            new Vector(374.458747, -12118.06249),
            new Vector(382.685227, -12130.789748),
            new Vector(347.019035, -12153.843199),
            new Vector(292.604209, -12069.939572),
            new Vector(358.217229, -12027.407833),
        ],

        [
            new Vector(593.287876, -11935.44614),
            new Vector(531.653718, -11975.312341),
            new Vector(504.286044, -11932.970951),
            new Vector(587.059805, -11878.76165),
            new Vector(610.465049, -11914.785486),
            new Vector(595.844713, -11931.046379),
        ],

        [
            new Vector(111.346767, -12551.177921),
            new Vector(108.164246, -12612.253722),
            new Vector(157.451789, -12614.718659),
            new Vector(195.999461, -12578.566379),
            new Vector(143.08451, -12521.471742),
        ],

        [
            new Vector(230.074644, -12570.516523),
            new Vector(301.833978, -12503.99177),
            new Vector(354.748928, -12561.086406),
            new Vector(282.2105, -12627.757715),
        ],

        [
            new Vector(332.147402, -12476.886837),
            new Vector(403.912398, -12410.371563),
            new Vector(456.821687, -12467.45672),
            new Vector(384.567362, -12534.437133),
        ],

        [
            new Vector(407.667397, -12559.982868),
            new Vector(508.891095, -12670.3842),
            new Vector(582.116418, -12602.504632),
            new Vector(479.926186, -12493.001549),
        ],

        [
            new Vector(820.960571, -12130.630415),
            new Vector(753.594383, -12057.812582),
            new Vector(692.564408, -12114.273432),
            new Vector(759.887501, -12187.131133),
        ],

        [
            new Vector(867.286684, -12531.89829),
            new Vector(948.074137, -12432.206444),
            new Vector(1014.709771, -12486.20575),
            new Vector(934.006489, -12585.842164),
        ],

        [
            new Vector(966.882453, -12408.879153),
            new Vector(1012.994286, -12351.886902),
            new Vector(1046.593565, -12379.071727),
            new Vector(1000.482377, -12436.063956),
        ],

        [
            new Vector(1073.88115, -12221.977486),
            new Vector(1148.112665, -12245.4183),
            new Vector(1118.633036, -12338.727944),
            new Vector(1044.40647, -12315.279253),
        ],

        [
            new Vector(1156.586777, -12351.866492),
            new Vector(1186.808363, -12257.761686),
            new Vector(1232.873655, -12272.72743),
            new Vector(1202.930759, -12366.595675),
        ],

        [
            new Vector(425.100546, -12332.491695),
            new Vector(488.205946, -12273.770225),
            new Vector(570.312086, -12362.513619),
            new Vector(506.900242, -12420.837449),
        ],

        [
            new Vector(-733.350862, -11187.676875),
            new Vector(-682.625, -11248.534584),
            new Vector(-544.644226, -11141.853143),
            new Vector(-564.450267, -11116.236194),
            new Vector(-596.140179, -11115.192077),
            new Vector(-627.79, -11142.61),
            new Vector(-649.91, -11116.59),
        ],

        [
            new Vector(-182.114627, -11315.279094),
            new Vector(-168.2837, -11245.19477),
            new Vector(-59.455786, -11174.192564),
            new Vector(-6.18064, -11256.375301),
            new Vector(-118.113787, -11328.936599),
        ],

        [
            new Vector(598.539615, -12457.81849),
            new Vector(629.623985, -12428.398793),
            new Vector(593.767788, -12389.640915),
            new Vector(529.828176, -12446.430741),
            new Vector(591.784563, -12513.40098),
            new Vector(615.809756, -12491.174477),
            new Vector(605.41, -12482.42),
            new Vector(591.927628, -12461.80824),
        ],

        [
            new Vector(689.08009, -12149.306382),
            new Vector(644.394803, -12190.64622),
            new Vector(653.906248, -12205.823712),
            new Vector(693.46351, -12248.582167),
            new Vector(740.589567, -12204.984292),
        ],

        [
            new Vector(758.305209, -12353.489309),
            new Vector(821.943576, -12294.615349),
            new Vector(763.100026, -12231.009853),
            new Vector(711.209783, -12278.90257),
            new Vector(729.010843, -12299.904526),
            new Vector(717.989698, -12309.926921),
        ],

        [
            new Vector(845.433763, -12233.786375),
            new Vector(883.338744, -12198.719223),
            new Vector(844.761459, -12155.326619),
            new Vector(783.213707, -12212.197673),
            new Vector(823.889681, -12256.165373),
            new Vector(841.82, -12234.85),
        ],

        [
            new Vector(647.250992, -12875.668671),
            new Vector(723.386816, -12965.097403),
            new Vector(674.668328, -13007.170717),
            new Vector(599.024303, -12915.78631),
        ],

        [
            new Vector(766.434472, -12933.647379),
            new Vector(816.887925, -12991.990784),
            new Vector(727.926549, -13068.920221),
            new Vector(685.839726, -13020.250924),
            new Vector(742.80881, -12970.986778),
            new Vector(734.468344, -12961.289942),
        ],

        [
            new Vector(374.458747, -12118.06249),
            new Vector(466.925417, -12058.25586),
            new Vector(487.401598, -12091.057584),
            new Vector(477.897753, -12096.834217),
            new Vector(471.869905, -12109.12519),
            new Vector(444.392355, -12128.329666),
            new Vector(434.276408, -12145.008609),
            new Vector(404.749034, -12164.924854),
        ],

        [
            new Vector(233.110504, -12453.890588),
            new Vector(278.602642, -12502.834355),
            new Vector(395.867728, -12394.308927),
            new Vector(316.256433, -12308.300885),
            new Vector(268.972883, -12344.671663),
            new Vector(221.16, -12411.360001),
            new Vector(240.845004, -12446.872676),
        ],

        [
            new Vector(220.605828, -12556.511473),
            new Vector(175.224494, -12506.461044),
            new Vector(233.110504, -12453.890588),
            new Vector(278.602642, -12502.834355),
        ],

        [
            new Vector(932.724649, -12208.932269),
            new Vector(950.606503, -12193.226242),
            new Vector(951.398404, -12194.127848),
            new Vector(953.87782, -12191.950121),
            new Vector(958.827199, -12197.585159),
            new Vector(969.013676, -12188.638151),
            new Vector(1035.934021, -12209.984891),
            new Vector(1018.683494, -12263.915206),
            new Vector(997.420617, -12282.59086),
        ],

        [
            new Vector(1093.211999, -12346.275692),
            new Vector(1083.94881, -12374.957799),
            new Vector(1133.82, -12413.36),
            new Vector(1187.23631, -12430.670452),
            new Vector(1203.037321, -12381.74494),
        ],

        [
            new Vector(-21.445413, -11817.1469),
            new Vector(-43.992575, -11782.893099),
            new Vector(-50.411001, -11768.338198),
            new Vector(-59.355097, -11733.651336),
            new Vector(-18.681982, -11737.073691),
            new Vector(51.157406, -11741.360634),
            new Vector(70.870271, -11742.75831),
            new Vector(77.615863, -11753.173234),
        ],

        [
            new Vector(135.010338, -11841.706696),
            new Vector(70.870271, -11742.75831),
            new Vector(93.645141, -11737.27001),
            new Vector(166.318178, -11712.014653),
            new Vector(200.024524, -11714.807186),
            new Vector(269.513329, -11692.004801),
            new Vector(280.97857, -11685.817355),
            new Vector(308.790699, -11729.052845),
        ],

        [
            new Vector(-224.862702, -11859.383855),
            new Vector(-229.84257, -11710.633843),
            new Vector(-215.020966, -11707.473533),
            new Vector(-107.222553, -11729.593847),
            new Vector(-91.260822, -11731.370828),
            new Vector(-84.278178, -11757.400665),
            new Vector(-83.650233, -11760.814219),
            new Vector(-84.183855, -11764.927779),
            new Vector(-85.251099, -11768.508118),
            new Vector(-87.044411, -11770.668023),
            new Vector(-88.602288, -11772.39797),
            new Vector(-90.54206, -11773.831712),
            new Vector(-217.287271, -11856.934051),
            new Vector(-224.458397, -11859.360515),
        ],

        [
            new Vector(13.419979, -11427.94085),
            new Vector(-121.857566, -11514.188723),
            new Vector(-134.965603, -11493.590652),
            new Vector(-199.89133, -11433.194444),
            new Vector(-214.461484, -11425.52448),
            new Vector(-221.211636, -11410.686816),
            new Vector(-206.612733, -11332.552643),
            new Vector(-78.261485, -11359.942556),
            new Vector(-49.79157, -11376.450889),
            new Vector(-25.718585, -11393.687734),
        ],

        [
            new Vector(-1309.228811, -12745.286015),
            new Vector(-1195.672932, -12758.400358),
            new Vector(-1205.968451, -12846.855942),
            new Vector(-1319.511644, -12833.640427),
        ],

        [
            new Vector(-1324.153497, -12873.523359),
            new Vector(-1210.609054, -12886.739011),
            new Vector(-1220.93614, -12975.061896),
            new Vector(-1334.443374, -12961.926518),
        ],

        [
            new Vector(-1537.487555, -12849.043302),
            new Vector(-1400.144758, -12864.872808),
            new Vector(-1407.292051, -12926.597612),
            new Vector(-1534.882864, -13015.297741),
            new Vector(-1543.844579, -13002.40675),
            new Vector(-1545.353193, -12916.974725),
        ],

        [
            new Vector(-1517.26661, -13084.507679),
            new Vector(-1443.834408, -13033.431922),
            new Vector(-1398.809651, -13098.164533),
            new Vector(-1472.244929, -13149.239535),
        ],

        [
            new Vector(-1313.833256, -13040.451395),
            new Vector(-1280.263681, -13017.103512),
            new Vector(-1303.817108, -12983.238405),
            new Vector(-1338.675515, -13007.482679),
            new Vector(-1316.370481, -13039.552846),
        ],

        [
            new Vector(-1522.738834, -12720.889389),
            new Vector(-1365.775999, -12739.155506),
            new Vector(-1376.058538, -12827.514544),
            new Vector(-1532.880084, -12809.309076),
        ],

        [
            new Vector(-1512.114837, -12629.609479),
            new Vector(-1355.361313, -12647.851449),
            new Vector(-1362.783319, -12711.628864),
            new Vector(-1488.673611, -12697.190332),
            new Vector(-1489.118392, -12701.068408),
            new Vector(-1519.978986, -12697.528964),
        ],

        [
            new Vector(-960.856077, -12407.873708),
            new Vector(-898.985827, -12421.578498),
            new Vector(-926.382634, -12544.260296),
            new Vector(-984.488825, -12531.272541),
            new Vector(-963.89314, -12439.023313),
            new Vector(-967.624583, -12438.190225),
        ],

        [
            new Vector(792.49633, -11851.77751),
            new Vector(869.115462, -11961.544389),
            new Vector(949.937709, -11905.204614),
            new Vector(873.39943, -11795.553232),
        ],

        [
            new Vector(919.630648, -11792.251387),
            new Vector(1000.533448, -11736.027318),
            new Vector(1063.353895, -11826.150782),
            new Vector(982.571, -11882.460397),
        ],

        [
            new Vector(257.319915, -12092.672962),
            new Vector(311.517804, -12176.29421),
            new Vector(286.449537, -12192.990496),
            new Vector(217.543162, -12118.472873),
        ],

        [
            new Vector(436.308446, -12824.138622),
            new Vector(525.408332, -12833.400581),
            new Vector(517.96572, -12904.998377),
            new Vector(500.853125, -12910.455317),
            new Vector(432.576101, -12860.045264),
        ],

        [
            new Vector(-217.943934, -11306.845681),
            new Vector(-205.828854, -11257.435456),
            new Vector(-195.439676, -11239.699097),
            new Vector(-164.912505, -11211.433448),
            new Vector(-190.112862, -11172.540374),
            new Vector(-220.2902, -11183.54846),
            new Vector(-262.732419, -11222.046933),
            new Vector(-276.716962, -11296.742141),
        ],

        [
            new Vector(-129.901045, -11107.084649),
            new Vector(-110.917359, -11094.784371),
            new Vector(-81.77119, -11139.767231),
            new Vector(-163.655169, -11192.823091),
            new Vector(-176.757768, -11172.601141),
            new Vector(-113.837639, -11131.820126),
        ],

        [
            new Vector(-580.299457, -11101.469418),
            new Vector(-627.79, -11142.61),
            new Vector(-649.91, -11116.59),
            new Vector(-733.350862, -11187.676875),
            new Vector(-685.600855, -11244.96434),
            new Vector(-739.552704, -11289.934059),
            new Vector(-749.367561, -11298.27228),
            new Vector(-761.431956, -11284.071372),
            new Vector(-776.324934, -11233.306447),
            new Vector(-801.211955, -11202.157414),
            new Vector(-799.312584, -11160.409106),
            new Vector(-742.692183, -11110.741881),
            new Vector(-721.995209, -11094.176545),
            new Vector(-664.447474, -11045.288731),
            new Vector(-626.098077, -11047.557929),
        ],

        [
            new Vector(-233.23556, -10933.244454),
            new Vector(-193.96633, -10899.518959),
            new Vector(-141.230687, -10859.817307),
            new Vector(-74.084988, -10802.151047),
            new Vector(-46.748802, -10861.702621),
            new Vector(-129.359066, -11008.653569),
            new Vector(-189.462877, -10974.865481),
            new Vector(-215.823635, -10953.881275),
        ],
    ]

    let obstacles = []

    buildings.forEach(cs => {
        const obstacle = PathObstacle.fromCoords(cs)
        obstacle.addTag(Tag.TYPE, ObstacleType.BUILDING)

        obstacles = [
            ...obstacles,
            ...splitObstacle(obstacle),
        ]
    })

    obstacles.forEach(obstacle => {
        env.addObstacle(obstacle)
    })

    roads.forEach(cs => {
        const obstacle = PathObstacle.fromCoords(cs)
        obstacle.addTag(Tag.TYPE, ObstacleType.ROAD)

        env.addObstacle(obstacle)
    })
}

function getLayer(name) {
    return DATA.layers.find(x => x.layer === name)
}

function createPointFromArray([x, y, z]) {
    return new Vector(x, y, z)
}

function importPoint(point) {
    const geom = point.geometry

    return createPointFromArray(geom)
}

function importPolyline(polyline) {
    const geom = polyline.geometry

    return geom.map(createPointFromArray)
}

function getRoads() {
    return getLayer('ROAD').objects.map(importPolyline)
}

function initBuildings(simulation) {
    const buildings = [
        [
            new Vector(-561.331198, -11290.907972),
            new Vector(-524.049205, -11294.984255),
            new Vector(-527.071873, -11320.428967),
            new Vector(-564.495934, -11316.727119),
        ],

        [
            new Vector(325.366329, -11214.131585),
            new Vector(348.924798, -11214.099582),
            new Vector(348.924798, -11237.047191),
            new Vector(325.366329, -11237.047191),
        ],

        [
            new Vector(-118.241779, -12326.657305),
            new Vector(-125.60704, -12341.893417),
            new Vector(-158.874859, -12334.17549),
            new Vector(-148.232234, -12312.159675),
        ],

        [
            new Vector(-148.232234, -12312.159675),
            new Vector(-141.703884, -12298.654836),
            new Vector(-111.71343, -12313.152467),
            new Vector(-118.241779, -12326.657305),
        ],

        [
            new Vector(-141.703884, -12298.654836),
            new Vector(-129.042181, -12272.462263),
            new Vector(-99.051726, -12286.959894),
            new Vector(-111.71343, -12313.152467),
        ],

        [
            new Vector(-129.042181, -12272.462263),
            new Vector(-122.513832, -12258.957425),
            new Vector(-92.523377, -12273.455056),
            new Vector(-99.051726, -12286.959894),
        ],

        [
            new Vector(-122.513832, -12258.957425),
            new Vector(-106.435513, -12225.697088),
            new Vector(-83.238291, -12254.247507),
            new Vector(-92.523377, -12273.455056),
        ],

        [
            new Vector(-202.715306, -12087.631992),
            new Vector(-190.488591, -12090.252788),
            new Vector(-178.847146, -12107.97098),
            new Vector(-181.338711, -12119.290625),
            new Vector(-229.867909, -12108.608873),
            new Vector(-228.216506, -12101.106242),
            new Vector(-206.726126, -12105.906783),
        ],

        [
            new Vector(-206.726126, -12105.906783),
            new Vector(-199.78142, -12074.26412),
            new Vector(-221.388606, -12069.733725),
            new Vector(-228.216506, -12101.106242),
        ],

        [
            new Vector(-413.714947, -11014.819331),
            new Vector(-460.995104, -11054.988374),
            new Vector(-471.911444, -11042.139518),
            new Vector(-424.631287, -11001.970474),
        ],

        [
            new Vector(-424.631287, -11001.970474),
            new Vector(-408.478788, -10988.247372),
            new Vector(-397.562448, -11001.096229),
            new Vector(-413.714947, -11014.819331),
        ],

        [
            new Vector(-532.77682, -11093.855151),
            new Vector(-485.691019, -11053.851231),
            new Vector(-474.774679, -11066.700088),
            new Vector(-521.86048, -11106.704007),
        ],

        [
            new Vector(-521.86048, -11106.704007),
            new Vector(-538.207335, -11120.592234),
            new Vector(-549.123675, -11107.743377),
            new Vector(-532.77682, -11093.855151),
        ],

        [
            new Vector(-228.145656, -11148.333566),
            new Vector(-253.349769, -11158.237055),
            new Vector(-260.462687, -11140.134871),
            new Vector(-235.258574, -11130.231381),
        ],

        [
            new Vector(-293.834734, -11173.917504),
            new Vector(-319.038847, -11183.820994),
            new Vector(-326.151765, -11165.718809),
            new Vector(-300.947652, -11155.81532),
        ],

        [
            new Vector(-341.724573, -11193.555651),
            new Vector(-366.551833, -11204.369232),
            new Vector(-374.318401, -11186.537711),
            new Vector(-349.49114, -11175.72413),
        ],

        [
            new Vector(-308.161895, -10750.906287),
            new Vector(-220.228513, -10855.701063),
            new Vector(-247.423123, -10878.520082),
            new Vector(-335.356504, -10773.725306),
        ],

        [
            new Vector(-195.252429, -10654.781096),
            new Vector(-149.954047, -10720.46499),
            new Vector(-131.598039, -10704.257445),
            new Vector(-135.670104, -10699.645589),
            new Vector(-142.463066, -10693.071814),
            new Vector(-154.449178, -10682.884796),
            new Vector(-168.207688, -10672.14724),
            new Vector(-181.966198, -10661.409685),
        ],

        [
            new Vector(-138.488611, -10737.087091),
            new Vector(-119.061789, -10720.145831),
            new Vector(-102.352074, -10747.439544),
            new Vector(-85.642359, -10774.733256),
            new Vector(-102.521994, -10789.229962),
        ],

        [
            new Vector(-218.277693, -11217.344974),
            new Vector(-198.233376, -11229.0709),
            new Vector(-210.617465, -11250.240284),
            new Vector(-213.068717, -11257.602766),
            new Vector(-215.804583, -11282.159476),
            new Vector(-238.88408, -11279.595087),
            new Vector(-236.162978, -11255.105169),
            new Vector(-230.678811, -11238.499823),
        ],

        [
            new Vector(-363.864682, -11243.519),
            new Vector(-390.756308, -11240.330451),
            new Vector(-388.466217, -11221.016255),
            new Vector(-361.574591, -11224.204804),
        ],

        [
            new Vector(-368.821768, -11285.326144),
            new Vector(-395.713395, -11282.137595),
            new Vector(-393.423304, -11262.823399),
            new Vector(-366.531678, -11266.011948),
        ],

        [
            new Vector(-375.191802, -11339.049814),
            new Vector(-402.083428, -11335.861265),
            new Vector(-399.793337, -11316.547069),
            new Vector(-372.901711, -11319.735618),
        ],

        [
            new Vector(137.346128, -12053.388362),
            new Vector(172.107383, -12030.970132),
            new Vector(184.064593, -12049.510741),
            new Vector(156.539791, -12067.262036),
            new Vector(144.636404, -12064.692517),
        ],

        [
            new Vector(361.807348, -11750.745938),
            new Vector(378.185075, -11740.088468),
            new Vector(386.899137, -11753.479688),
            new Vector(370.52141, -11764.137158),
        ],

        [
            new Vector(390.972939, -11649.469593),
            new Vector(407.350666, -11638.812123),
            new Vector(416.064727, -11652.203344),
            new Vector(399.687001, -11662.860813),
        ],

        [
            new Vector(451.922824, -11821.208823),
            new Vector(489.661803, -11796.744444),
            new Vector(507.333924, -11824.005622),
            new Vector(494.808432, -11832.125301),
            new Vector(497.755052, -11836.670786),
            new Vector(484.531376, -11845.243064),
            new Vector(481.584756, -11840.697579),
            new Vector(469.594945, -11848.470002),
        ],

        [
            new Vector(-28.874272, -12339.373014),
            new Vector(-20.857656, -12334.174157),
            new Vector(-3.716573, -12360.516796),
            new Vector(-35.587815, -12381.185618),
            new Vector(-41.79345, -12371.616553),
        ],

        [
            new Vector(18.401072, -12613.193976),
            new Vector(18.889132, -12600.621036),
            new Vector(26.274876, -12600.907738),
            new Vector(26.561577, -12593.521994),
            new Vector(33.947321, -12593.808696),
            new Vector(34.234023, -12586.422952),
            new Vector(68.418311, -12587.749927),
            new Vector(67.356847, -12615.094355),
        ],

        [
            new Vector(186.512706, -12620.311178),
            new Vector(213.5441, -12595.27214),
            new Vector(240.71446, -12624.63735),
            new Vector(232.108098, -12632.600445),
            new Vector(194.376592, -12628.844408),
        ],

        [
            new Vector(657.83117, -11965.841588),
            new Vector(674.740698, -11954.89501),
            new Vector(691.573369, -11980.896972),
            new Vector(674.663841, -11991.84355),
        ],

        [
            new Vector(338.167528, -12637.607332),
            new Vector(387.418628, -12592.044305),
            new Vector(436.316964, -12644.892698),
            new Vector(422.106654, -12658.040885),
            new Vector(409.866896, -12644.812386),
            new Vector(398.174374, -12655.630971),
            new Vector(385.964965, -12642.435273),
            new Vector(374.301435, -12653.227032),
            new Vector(362.076851, -12640.014934),
            new Vector(350.397356, -12650.819958),
        ],

        [
            new Vector(887.920768, -12132.925552),
            new Vector(921.879332, -12169.624814),
            new Vector(903.714341, -12186.433245),
            new Vector(869.755777, -12149.733983),
        ],

        [
            new Vector(986.02661, -12561.990905),
            new Vector(1010.314351, -12532.765819),
            new Vector(1041.077599, -12558.331862),
            new Vector(1016.789859, -12587.556948),
        ],

        [
            new Vector(1246.183052, -12353.970988),
            new Vector(1263.311904, -12359.502932),
            new Vector(1246.737201, -12410.824068),
            new Vector(1229.608348, -12405.292124),
        ],

        [
            new Vector(909.653545, -12647.121434),
            new Vector(966.424222, -12641.789603),
            new Vector(970.20254, -12668.965202),
            new Vector(906.298406, -12675.999101),
        ],

        [
            new Vector(988.264478, -12666.328544),
            new Vector(984.126789, -12639.454455),
            new Vector(1057.815956, -12626.227466),
            new Vector(1074.666907, -12649.673095),
        ],

        [
            new Vector(883.8208, -12649.548027),
            new Vector(883.8208, -12677.260403),
            new Vector(858.8208, -12679.016288),
            new Vector(858.8208, -12651.299461),
        ],

        [
            new Vector(765.022736, -12656.137577),
            new Vector(829.313337, -12649.854368),
            new Vector(828.745608, -12679.625503),
            new Vector(767.174029, -12682.065088),
        ],

        [
            new Vector(1295.04282, -12296.272594),
            new Vector(1430.218281, -12338.581626),
            new Vector(1417.651667, -12378.731393),
            new Vector(1281.90553, -12385.091517),
            new Vector(1279.080628, -12342.730594),
        ],

        [
            new Vector(1445.602011, -12343.396633),
            new Vector(1505.715441, -12362.211742),
            new Vector(1499.543393, -12381.93116),
            new Vector(1432.558645, -12385.069602),
        ],

        [
            new Vector(587.576478, -12666.603572),
            new Vector(615.703738, -12640.610204),
            new Vector(640.237171, -12667.157678),
            new Vector(632.861377, -12674.527967),
            new Vector(593.909631, -12673.022649),
        ],

        [
            new Vector(906.818224, -12804.350101),
            new Vector(1031.220257, -12783.620963),
            new Vector(1031.220257, -12794.337003),
            new Vector(1004.139383, -12817.179908),
            new Vector(906.818224, -12832.251736),
        ],

        [
            new Vector(858.8208, -12810.315254),
            new Vector(883.8208, -12807.496023),
            new Vector(883.8208, -12851.996385),
            new Vector(858.8208, -12855.175494),
        ],

        [
            new Vector(765.699235, -12819.700202),
            new Vector(828.665792, -12813.69824),
            new Vector(828.648259, -12843.148715),
            new Vector(767.244052, -12848.507054),
        ],

        [
            new Vector(747.69891, -12820.761893),
            new Vector(749.35713, -12848.58856),
            new Vector(693.350375, -12851.660109),
            new Vector(690.912286, -12823.720681),
        ],

        [
            new Vector(1078.210994, -11742.005812),
            new Vector(1062.685109, -11719.794173),
            new Vector(1046.538641, -11731.080518),
            new Vector(1062.064527, -11753.292157),
        ],

        [
            new Vector(1105.890094, -11791.837121),
            new Vector(1090.364208, -11769.625483),
            new Vector(1074.217741, -11780.911827),
            new Vector(1089.743626, -11803.123466),
        ],

        [
            new Vector(1124.985026, -11719.877765),
            new Vector(1141.848258, -11708.104354),
            new Vector(1113.139879, -11666.984916),
            new Vector(1096.276646, -11678.758328),
        ],

        [
            new Vector(-369.543946, -12142.249827),
            new Vector(-149.177889, -12192.759946),
            new Vector(-167.272731, -12271.704302),
            new Vector(-242.704576, -12309.480186),
            new Vector(-399.476006, -12273.546596),
        ],

        [
            new Vector(-427.098186, -12149.75693),
            new Vector(-396.755649, -12156.788122),
            new Vector(-407.234846, -12202.010243),
            new Vector(-437.577383, -12194.979051),
        ],

        [
            new Vector(-368.033165, -12369.982292),
            new Vector(-278.805951, -12379.141442),
            new Vector(-294.372372, -12530.787436),
            new Vector(-383.504584, -12521.698059),
        ],

        [
            new Vector(-235.584646, -12457.769525),
            new Vector(-172.186416, -12463.184105),
            new Vector(-182.093809, -12587.739479),
            new Vector(-246.151525, -12582.644196),
        ],

        [
            new Vector(-384.839428, -12535.319508),
            new Vector(-323.967292, -12541.216143),
            new Vector(-327.444866, -12576.179646),
            new Vector(-388.227157, -12570.291715),
        ],

        [
            new Vector(-390.184575, -12590.498532),
            new Vector(-329.414817, -12596.385249),
            new Vector(-332.686625, -12631.367997),
            new Vector(-393.694189, -12625.662184),
        ],

        [
            new Vector(813.620555, -12406.739325),
            new Vector(845.115555, -12406.710984),
            new Vector(845.13624, -12431.686195),
            new Vector(813.641239, -12431.714535),
        ],

        [
            new Vector(92.323187, -11408.326676),
            new Vector(117.162144, -11446.643482),
            new Vector(110.753836, -11450.797683),
            new Vector(72.021318, -11421.410876),
        ],

        [
            new Vector(-1060.196349, -11233.606075),
            new Vector(-1120.755709, -11212.47022),
            new Vector(-1153.824421, -11278.184815),
            new Vector(-1084.647508, -11303.664584),
        ],

        [
            new Vector(-1160.900805, -11292.141732),
            new Vector(-1198.940003, -11367.629294),
            new Vector(-1161.356647, -11378.525389),
            new Vector(-1109.919258, -11376.074288),
            new Vector(-1089.630539, -11317.942178),
        ],

        [
            new Vector(-1013.134943, -11312.281062),
            new Vector(-1056.94275, -11296.991675),
            new Vector(-1060.906515, -11300.406986),
            new Vector(-1086.758855, -11374.480219),
            new Vector(-1033.844032, -11371.951191),
        ],

        [
            new Vector(-1013.980186, -11127.683954),
            new Vector(-1021.215292, -11148.208623),
            new Vector(-1021.215292, -11148.208623),
            new Vector(-1021.215292, -11148.208623),
            new Vector(-1045.42594, -11217.578012),
            new Vector(-1022.656419, -11225.524816),
            new Vector(-1005.482253, -11231.518781),
            new Vector(-966.446511, -11245.686754),
            new Vector(-895.89654, -11186.603454),
            new Vector(-894.866186, -11182.080566),
            new Vector(-901.684449, -11176.995801),
            new Vector(-952.723448, -11149.39027),
        ],

        [
            new Vector(-1033.891969, -11120.664911),
            new Vector(-1068.578818, -11108.437511),
            new Vector(-1111.332755, -11193.686295),
            new Vector(-1065.5756, -11210.545569),
        ],

        [
            new Vector(-859.685401, -11241.227439),
            new Vector(-894.174028, -11270.366525),
            new Vector(-833.100517, -11291.681825),
        ],

        [
            new Vector(-824.676717, -11315.804911),
            new Vector(-914.028978, -11284.588926),
            new Vector(-966.041551, -11328.717153),
            new Vector(-991.23104, -11319.925755),
            new Vector(-1008.816196, -11370.594742),
            new Vector(-910.281548, -11365.254398),
            new Vector(-846.501055, -11352.552565),
        ],

        [
            new Vector(-969.86611, -11306.197025),
            new Vector(-957.29849, -11269.641806),
            new Vector(-999.010308, -11255.157346),
            new Vector(-1011.663967, -11291.616965),
        ],

        [
            new Vector(-618.756152, -11285.192344),
            new Vector(-632.167432, -11303.949194),
            new Vector(-581.215005, -11310.042775),
            new Vector(-578.220372, -11289.212289),
        ],

        [
            new Vector(-632.167432, -11303.949194),
            new Vector(-608.46907, -11306.685668),
            new Vector(-628.182037, -11335.393567),
            new Vector(-651.545781, -11332.695732),
        ],

        [
            new Vector(-588.875715, -11361.308339),
            new Vector(-585.969877, -11340.562554),
            new Vector(-651.880442, -11332.657155),
            new Vector(-665.241697, -11352.115087),
        ],

        [
            new Vector(-503.76442, -11370.610798),
            new Vector(-435.062754, -11378.984164),
            new Vector(-432.644178, -11358.038335),
            new Vector(-501.181856, -11349.839804),
        ],

        [
            new Vector(-493.349099, -11319.994372),
            new Vector(-490.938684, -11298.935249),
            new Vector(-427.636268, -11306.180808),
            new Vector(-430.862593, -11337.957346),
            new Vector(-451.957535, -11335.832068),
            new Vector(-450.837608, -11324.860213),
        ],

        [
            new Vector(-463.269593, -11278.052485),
            new Vector(-459.854855, -11248.681126),
            new Vector(-484.921177, -11245.902062),
            new Vector(-488.335915, -11275.27342),
        ],

        [
            new Vector(-553.268847, -11267.08186),
            new Vector(-549.793775, -11240.563112),
            new Vector(-589.178565, -11250.83567),
            new Vector(-596.661485, -11262.126609),
        ],

        [
            new Vector(899.468024, -12492.186465),
            new Vector(948.074137, -12432.206444),
            new Vector(965.857323, -12446.617435),
            new Vector(957.197226, -12457.304008),
            new Vector(950.215124, -12451.652342),
            new Vector(910.267148, -12500.948209),
        ],

        [
            new Vector(910.267148, -12500.948209),
            new Vector(896.11393, -12518.413302),
            new Vector(941.12115, -12554.88588),
            new Vector(995.222344, -12488.12492),
            new Vector(972.647071, -12469.830557),
            new Vector(981.299396, -12459.137691),
            new Vector(1014.709771, -12486.20575),
            new Vector(933.982797, -12585.822965),
            new Vector(867.286684, -12531.89829),
            new Vector(899.468024, -12492.186465),
        ],

        [
            new Vector(-1316.3612, -12809.16721),
            new Vector(-1300.965003, -12810.958059),
            new Vector(-1302.222958, -12821.766229),
            new Vector(-1298.736493, -12822.172016),
            new Vector(-1300.348082, -12836.018567),
            new Vector(-1319.528605, -12833.786161),
            new Vector(-1316.659085, -12809.131682),
        ],

        [
            new Vector(-1393.514573, -12811.417018),
            new Vector(-1395.126129, -12825.263551),
            new Vector(-1435.195653, -12820.599982),
            new Vector(-1433.584097, -12806.753448),
            new Vector(-1393.491812, -12811.419667),
        ],

        [
            new Vector(-1249.706503, -12882.118221),
            new Vector(-1269.741264, -12879.786436),
            new Vector(-1271.35282, -12893.632969),
            new Vector(-1251.318058, -12895.964754),
        ],

        [
            new Vector(-1229.672383, -12884.449932),
            new Vector(-1249.706503, -12882.118221),
            new Vector(-1251.318058, -12895.964754),
            new Vector(-1231.283938, -12898.296464),
        ],

        [
            new Vector(-1229.672383, -12884.449932),
            new Vector(-1210.597437, -12886.637723),
            new Vector(-1213.401683, -12911.087432),
            new Vector(-1229.098789, -12909.287063),
            new Vector(-1227.884887, -12898.692069),
            new Vector(-1231.283938, -12898.296464),
        ],

        [
            new Vector(-1238.348991, -12958.995781),
            new Vector(-1234.950305, -12959.391344),
            new Vector(-1233.698752, -12948.800642),
            new Vector(-1218.007699, -12950.653025),
            new Vector(-1220.892956, -12975.093307),
            new Vector(-1239.960547, -12972.842314),
        ],

        [
            new Vector(-1258.383753, -12956.663996),
            new Vector(-1238.348991, -12958.995781),
            new Vector(-1239.960547, -12972.842314),
            new Vector(-1259.995309, -12970.510529),
        ],

        [
            new Vector(-1278.418515, -12954.332211),
            new Vector(-1258.383753, -12956.663996),
            new Vector(-1259.995309, -12970.510529),
            new Vector(-1280.030071, -12968.178745),
        ],

        [
            new Vector(-1313.66164, -12950.409307),
            new Vector(-1293.626878, -12952.741092),
            new Vector(-1295.238434, -12966.587625),
            new Vector(-1315.273196, -12964.25584),
        ],

        [
            new Vector(-1331.286347, -12937.404501),
            new Vector(-1334.155764, -12962.058135),
            new Vector(-1315.273196, -12964.25584),
            new Vector(-1313.66164, -12950.409307),
            new Vector(-1317.148105, -12950.00352),
            new Vector(-1315.89015, -12939.19535),
        ],

        [
            new Vector(-1326.982847, -12897.829201),
            new Vector(-1311.288553, -12899.655849),
            new Vector(-1315.89015, -12939.19535),
            new Vector(-1331.286347, -12937.404501),
        ],

        [
            new Vector(-1324.153958, -12873.523306),
            new Vector(-1305.112492, -12875.739484),
            new Vector(-1306.724043, -12889.585982),
            new Vector(-1310.071212, -12889.196416),
            new Vector(-1311.288553, -12899.655849),
            new Vector(-1326.982847, -12897.829201),
        ],

        [
            new Vector(-1234.781998, -12753.880856),
            new Vector(-1254.816759, -12751.549071),
            new Vector(-1256.428315, -12765.395604),
            new Vector(-1236.393553, -12767.727389),
        ],

        [
            new Vector(-1214.747878, -12756.212567),
            new Vector(-1234.781998, -12753.880856),
            new Vector(-1236.393553, -12767.727389),
            new Vector(-1216.359434, -12770.059099),
        ],

        [
            new Vector(-1214.747878, -12756.212567),
            new Vector(-1195.672932, -12758.400358),
            new Vector(-1198.477178, -12782.850067),
            new Vector(-1214.174285, -12781.049698),
            new Vector(-1212.960382, -12770.454704),
            new Vector(-1216.359434, -12770.059099),
        ],

        [
            new Vector(-1223.424486, -12830.758416),
            new Vector(-1220.0258, -12831.153979),
            new Vector(-1218.774247, -12820.563277),
            new Vector(-1203.083194, -12822.41566),
            new Vector(-1205.968451, -12846.855942),
            new Vector(-1225.036042, -12844.604949),
        ],

        [
            new Vector(-1243.459248, -12828.426631),
            new Vector(-1223.424486, -12830.758416),
            new Vector(-1225.036042, -12844.604949),
            new Vector(-1245.070804, -12842.273165),
        ],

        [
            new Vector(-1263.49401, -12826.094846),
            new Vector(-1243.459248, -12828.426631),
            new Vector(-1245.070804, -12842.273165),
            new Vector(-1265.105566, -12839.94138),
        ],

        [
            new Vector(-1296.363614, -12771.418287),
            new Vector(-1312.0577, -12769.59191),
            new Vector(-1316.659085, -12809.131682),
            new Vector(-1300.965003, -12810.958059),
        ],

        [
            new Vector(-1290.187347, -12747.502192),
            new Vector(-1309.228811, -12745.286015),
            new Vector(-1312.0577, -12769.59191),
            new Vector(-1296.363614, -12771.418287),
            new Vector(-1295.146065, -12760.959125),
            new Vector(-1291.798903, -12761.348726),
        ],

        [
            new Vector(-1270.152585, -12749.833977),
            new Vector(-1290.187347, -12747.502192),
            new Vector(-1291.798903, -12761.348726),
            new Vector(-1271.764141, -12763.680511),
        ],

        [
            new Vector(-1372.426813, -13056.42934),
            new Vector(-1370.481464, -13059.216443),
            new Vector(-1361.725683, -13053.128288),
            new Vector(-1352.704124, -13066.099484),
            new Vector(-1372.426813, -13079.816754),
            new Vector(-1383.870872, -13064.388958),
        ],

        [
            new Vector(-1383.943603, -13039.870583),
            new Vector(-1372.426813, -13056.42934),
            new Vector(-1383.870872, -13064.388958),
            new Vector(-1395.387781, -13047.83013),
        ],

        [
            new Vector(-1406.90459, -13031.271347),
            new Vector(-1395.460412, -13023.3118),
            new Vector(-1383.943603, -13039.870583),
            new Vector(-1395.387799, -13047.830104),
        ],

        [
            new Vector(-1397.553334, -13001.246232),
            new Vector(-1381.213672, -12989.881504),
            new Vector(-1372.191919, -13002.852549),
            new Vector(-1388.531582, -13014.217276),
        ],

        [
            new Vector(-1420.946803, -12907.292034),
            new Vector(-1405.252717, -12909.118411),
            new Vector(-1407.292051, -12926.597612),
            new Vector(-1457.04018, -12961.18212),
            new Vector(-1466.001896, -12948.291129),
            new Vector(-1422.115429, -12917.781602),
        ],

        [
            new Vector(-1439.253824, -12860.353306),
            new Vector(-1400.144758, -12864.872808),
            new Vector(-1405.252717, -12909.118411),
            new Vector(-1420.946803, -12907.292034),
            new Vector(-1417.432208, -12876.927155),
            new Vector(-1440.865379, -12874.199839),
        ],

        [
            new Vector(-1388.867378, -12801.247978),
            new Vector(-1373.173281, -12803.074262),
            new Vector(-1376.058538, -12827.514544),
            new Vector(-1395.126129, -12825.263551),
            new Vector(-1393.514573, -12811.417018),
            new Vector(-1390.115887, -12811.81258),
        ],

        [
            new Vector(-1384.265993, -12761.708205),
            new Vector(-1368.568923, -12763.50857),
            new Vector(-1373.173281, -12803.074262),
            new Vector(-1388.867378, -12801.247978),
        ],

        [
            new Vector(-1424.908468, -12732.207578),
            new Vector(-1365.76464, -12739.058865),
            new Vector(-1368.568923, -12763.50857),
            new Vector(-1384.265993, -12761.708205),
            new Vector(-1383.052091, -12751.113212),
            new Vector(-1426.520024, -12746.054112),
        ],

        [
            new Vector(-1373.835509, -12670.267428),
            new Vector(-1358.138402, -12672.067798),
            new Vector(-1362.742807, -12711.633578),
            new Vector(-1378.436894, -12709.807201),
        ],

        [
            new Vector(-1394.443222, -12643.098586),
            new Vector(-1355.334156, -12647.618088),
            new Vector(-1358.138402, -12672.067798),
            new Vector(-1373.835509, -12670.267428),
            new Vector(-1372.621606, -12659.672435),
            new Vector(-1396.054778, -12656.94512),
        ],

        [
            new Vector(-1317.782038, -12992.951115),
            new Vector(-1312.36014, -13000.746717),
            new Vector(-1298.39521, -12991.034007),
            new Vector(-1285.422167, -13009.686643),
            new Vector(-1300.207686, -13019.970079),
            new Vector(-1295.0492, -13027.386948),
            new Vector(-1305.369694, -13034.564926),
            new Vector(-1313.359859, -13023.07667),
            new Vector(-1323.112253, -13029.85953),
            new Vector(-1329.960966, -13020.012453),
            new Vector(-1322.165363, -13014.590555),
            new Vector(-1330.879912, -13002.060781),
        ],

        [
            new Vector(-961.906557, -12522.041953),
            new Vector(-942.057878, -12526.484428),
            new Vector(-945.140968, -12540.067478),
            new Vector(-964.819577, -12535.668963),
        ],

        [
            new Vector(-964.819577, -12535.668963),
            new Vector(-984.488825, -12531.272541),
            new Vector(-981.451344, -12517.667493),
            new Vector(-961.906557, -12522.041953),
        ],

        [
            new Vector(-942.057878, -12526.484428),
            new Vector(-938.780885, -12527.217876),
            new Vector(-936.446936, -12516.785198),
            new Vector(-921.017219, -12520.242323),
            new Vector(-926.382634, -12544.260296),
            new Vector(-945.140968, -12540.067478),
        ],

        [
            new Vector(-936.446936, -12516.785198),
            new Vector(-927.756399, -12477.938785),
            new Vector(-912.338656, -12481.393228),
            new Vector(-921.017219, -12520.242323),
        ],

        [
            new Vector(-937.424001, -12413.064025),
            new Vector(-898.985827, -12421.578498),
            new Vector(-904.355117, -12445.694363),
            new Vector(-919.772737, -12442.280913),
            new Vector(-917.445111, -12431.848896),
            new Vector(-940.517741, -12426.92106),
        ],

        [
            new Vector(-940.517741, -12426.92106),
            new Vector(-944.201259, -12443.419748),
            new Vector(-967.624583, -12438.190225),
            new Vector(-960.937641, -12407.855498),
            new Vector(-937.424001, -12413.064025),
        ],

        [
            new Vector(-904.355117, -12445.694363),
            new Vector(-908.67567, -12465.099889),
            new Vector(-924.093414, -12461.645446),
            new Vector(-919.772737, -12442.280913),
        ],

        [
            new Vector(739.586421, -13058.858422),
            new Vector(727.937763, -13068.933189),
            new Vector(685.839726, -13020.250924),
            new Vector(697.48833, -13010.177767),
            new Vector(730.690609, -13048.572898),
        ],

        [
            new Vector(730.690609, -13048.572898),
            new Vector(763.731222, -13020.0025),
            new Vector(772.627609, -13030.281542),
            new Vector(739.586421, -13058.858422),
        ],

        [
            new Vector(509.100127, -12831.705339),
            new Vector(525.408332, -12833.400581),
            new Vector(521.89624, -12867.186846),
            new Vector(507.266495, -12865.648799),
            new Vector(509.299253, -12846.092856),
            new Vector(507.622719, -12845.918584),
        ],

        [
            new Vector(507.622719, -12845.918584),
            new Vector(447.95335, -12839.716088),
            new Vector(445.698434, -12861.409276),
            new Vector(432.576101, -12860.045264),
            new Vector(436.308446, -12824.138622),
            new Vector(509.100127, -12831.705339),
        ],

        [
            new Vector(521.89624, -12867.186846),
            new Vector(517.96572, -12904.998377),
            new Vector(500.853125, -12910.455317),
            new Vector(497.046553, -12898.418136),
            new Vector(504.091847, -12896.190171),
            new Vector(507.266495, -12865.648799),
        ],

        [
            new Vector(375.444071, -12817.806433),
            new Vector(391.516342, -12819.477078),
            new Vector(387.79878, -12855.402079),
            new Vector(373.179832, -12853.933274),
            new Vector(375.442643, -12832.173362),
            new Vector(373.980721, -12832.021399),
        ],

        [
            new Vector(373.980721, -12832.021399),
            new Vector(333.192432, -12827.781578),
            new Vector(330.937516, -12849.474766),
            new Vector(317.815182, -12848.110754),
            new Vector(321.547528, -12812.204112),
            new Vector(375.444071, -12817.806433),
        ],

        [
            new Vector(387.79878, -12855.402079),
            new Vector(384.106899, -12891.078909),
            new Vector(366.994304, -12896.535849),
            new Vector(363.187733, -12884.498669),
            new Vector(370.233026, -12882.270704),
            new Vector(373.179832, -12853.933274),
        ],

        [
            new Vector(984.74366, -12423.330179),
            new Vector(966.882453, -12408.879153),
            new Vector(1012.994286, -12351.886902),
            new Vector(1030.855351, -12366.338103),
            new Vector(1022.137407, -12377.113109),
            new Vector(1015.284122, -12371.568264),
            new Vector(986.60851, -12407.010574),
            new Vector(993.461559, -12412.555229),
        ],

        [
            new Vector(993.461559, -12412.555229),
            new Vector(1009.200165, -12425.288997),
            new Vector(1000.482377, -12436.063956),
            new Vector(984.74366, -12423.330179),
        ],

        [
            new Vector(1030.855351, -12366.338103),
            new Vector(1046.593565, -12379.071727),
            new Vector(1037.875777, -12389.846686),
            new Vector(1022.137407, -12377.113109),
        ],

        [
            new Vector(1206.103259, -12264.030234),
            new Vector(1232.873655, -12272.72743),
            new Vector(1227.165841, -12290.620906),
            new Vector(1214.492673, -12286.5787),
            new Vector(1215.967089, -12282.005055),
            new Vector(1201.845945, -12277.500572),
        ],

        [
            new Vector(1201.845945, -12277.500572),
            new Vector(1182.482246, -12271.323774),
            new Vector(1186.808363, -12257.761686),
            new Vector(1206.103259, -12264.030234),
        ],

        [
            new Vector(1227.165841, -12290.620906),
            new Vector(1208.635213, -12348.712732),
            new Vector(1195.784027, -12344.612988),
            new Vector(1214.492673, -12286.5787),
        ],

        [
            new Vector(1208.635213, -12348.712732),
            new Vector(1202.930759, -12366.595675),
            new Vector(1175.826415, -12357.981291),
            new Vector(1180.151666, -12344.759972),
            new Vector(1194.283468, -12349.267727),
            new Vector(1195.784027, -12344.612988),
        ],

        [
            new Vector(1175.826415, -12357.981291),
            new Vector(1156.586777, -12351.866492),
            new Vector(1160.806917, -12338.589395),
            new Vector(1180.151666, -12344.759972),
        ],

        [
            new Vector(1080.823455, -12243.917798),
            new Vector(1062.455149, -12302.060776),
            new Vector(1049.855475, -12298.030489),
            new Vector(1068.223303, -12239.887337),
        ],

        [
            new Vector(1068.223303, -12239.887337),
            new Vector(1073.88115, -12221.977486),
            new Vector(1100.635727, -12230.568327),
            new Vector(1095.705501, -12245.993467),
            new Vector(1081.599156, -12241.462398),
            new Vector(1080.823455, -12243.917798),
        ],

        [
            new Vector(1062.455149, -12302.060776),
            new Vector(1061.711808, -12304.413745),
            new Vector(1075.854917, -12308.828671),
            new Vector(1071.032313, -12324.277769),
            new Vector(1044.201143, -12315.929213),
            new Vector(1049.855475, -12298.030489),
        ],

        [
            new Vector(1018.683494, -12263.915206),
            new Vector(1035.934021, -12209.984891),
            new Vector(1006.8393, -12200.704045),
            new Vector(1005.23289, -12218.597461),
            new Vector(1020.253616, -12235.699076),
            new Vector(1005.377115, -12248.765435),
        ],

        [
            new Vector(1005.377115, -12248.765435),
            new Vector(984.114238, -12267.441089),
            new Vector(997.420617, -12282.59086),
            new Vector(1018.683494, -12263.915206),
        ],

        [
            new Vector(1006.8393, -12200.704045),
            new Vector(995.83422, -12197.193564),
            new Vector(975.650854, -12214.921061),
            new Vector(990.235022, -12231.525639),
            new Vector(1005.111522, -12218.45928),
            new Vector(1005.23289, -12218.597461),
        ],

        [
            new Vector(635.59963, -12386.635538),
            new Vector(678.182577, -12432.659239),
            new Vector(703.249667, -12409.466177),
            new Vector(694.828372, -12400.364431),
            new Vector(679.744429, -12414.32069),
            new Vector(645.582397, -12377.399087),
        ],

        [
            new Vector(645.582397, -12377.399087),
            new Vector(626.974918, -12357.288517),
            new Vector(616.992358, -12366.524776),
            new Vector(635.59963, -12386.635538),
        ],

        [
            new Vector(703.249667, -12409.466177),
            new Vector(721.085567, -12392.963697),
            new Vector(712.664271, -12383.861951),
            new Vector(694.828372, -12400.364431),
        ],

        [
            new Vector(749.105539, -12323.378919),
            new Vector(758.748683, -12333.802439),
            new Vector(762.091815, -12330.704117),
            new Vector(771.672175, -12341.123086),
            new Vector(758.301377, -12353.492854),
            new Vector(739.049044, -12332.682515),
        ],

        [
            new Vector(739.049044, -12332.682515),
            new Vector(718.744115, -12310.734398),
            new Vector(728.80061, -12301.430802),
            new Vector(749.105539, -12323.378919),
        ],

        [
            new Vector(762.091815, -12330.704117),
            new Vector(800.298702, -12295.295026),
            new Vector(809.941846, -12305.718546),
            new Vector(771.672175, -12341.123086),
        ],

        [
            new Vector(752.20329, -12241.061829),
            new Vector(763.100026, -12231.009853),
            new Vector(782.623997, -12252.113812),
            new Vector(772.567501, -12261.417408),
            new Vector(762.618765, -12250.663565),
            new Vector(761.792958, -12251.427546),
        ],

        [
            new Vector(761.792958, -12251.427546),
            new Vector(721.475221, -12288.726819),
            new Vector(711.832078, -12278.303298),
            new Vector(752.20329, -12241.061829),
        ],

        [
            new Vector(782.623997, -12252.113812),
            new Vector(802.589379, -12273.694903),
            new Vector(792.532884, -12282.9985),
            new Vector(772.567501, -12261.417408),
        ],

        [
            new Vector(798.945033, -12229.202065),
            new Vector(783.213707, -12212.197673),
            new Vector(793.600525, -12202.588484),
            new Vector(809.328438, -12219.589187),
        ],

        [
            new Vector(809.328438, -12219.589187),
            new Vector(824.974697, -12236.501628),
            new Vector(814.587879, -12246.110817),
            new Vector(798.945033, -12229.202065),
        ],

        [
            new Vector(829.529906, -12169.417832),
            new Vector(844.761459, -12155.326619),
            new Vector(863.541189, -12176.450485),
            new Vector(853.051479, -12186.154863),
            new Vector(843.164402, -12175.467669),
            new Vector(838.833502, -12179.474327),
        ],

        [
            new Vector(838.833502, -12179.474327),
            new Vector(821.87693, -12195.161413),
            new Vector(812.573334, -12185.104918),
            new Vector(829.529906, -12169.417832),
        ],

        [
            new Vector(863.541189, -12176.450485),
            new Vector(883.338744, -12198.719223),
            new Vector(873.282249, -12208.022819),
            new Vector(853.051479, -12186.154863),
        ],

        [
            new Vector(763.661961, -12068.694884),
            new Vector(789.824082, -12096.974189),
            new Vector(779.437264, -12106.583378),
            new Vector(753.275143, -12078.304073),
        ],

        [
            new Vector(753.275143, -12078.304073),
            new Vector(752.477207, -12077.441563),
            new Vector(722.784855, -12104.910941),
            new Vector(713.515213, -12094.891149),
            new Vector(753.594383, -12057.812582),
            new Vector(763.661961, -12068.694884),
        ],

        [
            new Vector(789.824082, -12096.974189),
            new Vector(809.789464, -12118.55528),
            new Vector(799.402646, -12128.164469),
            new Vector(779.437264, -12106.583378),
        ],

        [
            new Vector(717.515119, -12141.255363),
            new Vector(701.96396, -12124.445718),
            new Vector(712.387481, -12114.802575),
            new Vector(727.938639, -12131.612219),
        ],

        [
            new Vector(727.938639, -12131.612219),
            new Vector(743.829562, -12148.789124),
            new Vector(733.406042, -12158.432267),
            new Vector(717.515119, -12141.255363),
        ],

        [
            new Vector(704.510973, -12238.361793),
            new Vector(693.46351, -12248.582167),
            new Vector(653.906248, -12205.823712),
            new Vector(663.962743, -12196.520115),
            new Vector(694.72102, -12228.074091),
            new Vector(694.867967, -12227.938421),
        ],

        [
            new Vector(694.867967, -12227.938421),
            new Vector(730.980378, -12194.597474),
            new Vector(740.589567, -12204.984292),
            new Vector(704.510973, -12238.361793),
        ],

        [
            new Vector(608.784339, -12227.137888),
            new Vector(586.670598, -12203.192442),
            new Vector(597.05874, -12193.584685),
            new Vector(619.190191, -12217.513751),
        ],

        [
            new Vector(619.190191, -12217.513751),
            new Vector(642.890797, -12243.139428),
            new Vector(632.445032, -12252.758422),
            new Vector(608.784339, -12227.137888),
        ],

        [
            new Vector(627.816686, -12290.982148),
            new Vector(595.080922, -12321.26494),
            new Vector(594.148558, -12320.257121),
            new Vector(583.241993, -12330.344356),
            new Vector(593.314091, -12341.222478),
            new Vector(636.969408, -12301.069347),
        ],

        [
            new Vector(636.969408, -12301.069347),
            new Vector(657.542306, -12282.146882),
            new Vector(648.238715, -12272.090392),
            new Vector(627.816686, -12290.982148),
        ],

        [
            new Vector(594.148558, -12320.257121),
            new Vector(573.351327, -12297.776779),
            new Vector(562.435383, -12307.872687),
            new Vector(583.241993, -12330.344356),
        ],

        [
            new Vector(573.351327, -12297.776779),
            new Vector(531.51918, -12252.559176),
            new Vector(548.604055, -12236.842056),
            new Vector(539.395888, -12226.88596),
            new Vector(511.514395, -12252.876724),
            new Vector(562.435383, -12307.872687),
        ],

        [
            new Vector(548.604055, -12236.842056),
            new Vector(569.653047, -12217.478173),
            new Vector(560.315495, -12207.384975),
            new Vector(539.395888, -12226.88596),
        ],

        [
            new Vector(463.095561, -12297.136193),
            new Vector(440.254627, -12318.390367),
            new Vector(449.429215, -12328.307414),
            new Vector(472.347774, -12307.137147),
        ],

        [
            new Vector(472.347774, -12307.137147),
            new Vector(497.543497, -12283.863423),
            new Vector(488.205946, -12273.770225),
            new Vector(463.095561, -12297.136193),
        ],

        [
            new Vector(440.254627, -12318.390367),
            new Vector(425.100546, -12332.491695),
            new Vector(466.099432, -12376.771535),
            new Vector(477.019525, -12366.671268),
            new Vector(445.952684, -12333.090326),
            new Vector(450.210178, -12329.151577),
        ],

        [
            new Vector(466.099432, -12376.771535),
            new Vector(485.091519, -12397.283473),
            new Vector(496.001958, -12387.189865),
            new Vector(477.019525, -12366.671268),
        ],

        [
            new Vector(485.091519, -12397.283473),
            new Vector(506.900242, -12420.837449),
            new Vector(570.312086, -12362.513619),
            new Vector(561.008495, -12352.457129),
            new Vector(508.667073, -12400.879911),
            new Vector(496.001958, -12387.189865),
        ],

        [
            new Vector(539.835848, -12437.221625),
            new Vector(529.828176, -12446.430741),
            new Vector(574.196012, -12494.389066),
            new Vector(584.144868, -12485.18505),
            new Vector(549.069908, -12447.202956),
        ],

        [
            new Vector(549.069908, -12447.202956),
            new Vector(567.730356, -12429.970771),
            new Vector(558.526646, -12420.022246),
            new Vector(539.835848, -12437.221625),
        ],

        [
            new Vector(574.196012, -12494.389066),
            new Vector(591.784563, -12513.40098),
            new Vector(601.716269, -12504.212829),
            new Vector(584.144868, -12485.18505),
        ],

        [
            new Vector(565.218729, -12584.461725),
            new Vector(582.116418, -12602.504632),
            new Vector(567.802446, -12615.773624),
            new Vector(558.336965, -12605.378369),
            new Vector(560.816367, -12603.079974),
            new Vector(553.584265, -12595.357727),
        ],

        [
            new Vector(553.584265, -12595.357727),
            new Vector(539.625899, -12580.453351),
            new Vector(551.260363, -12569.557349),
            new Vector(565.218729, -12584.461725),
        ],

        [
            new Vector(567.802446, -12615.773624),
            new Vector(553.07847, -12629.422688),
            new Vector(543.483773, -12619.147216),
            new Vector(558.336965, -12605.378369),
        ],

        [
            new Vector(553.07847, -12629.422688),
            new Vector(538.172628, -12643.240341),
            new Vector(528.577931, -12632.964869),
            new Vector(543.483773, -12619.147216),
        ],

        [
            new Vector(538.172628, -12643.240341),
            new Vector(523.266786, -12657.057994),
            new Vector(513.672089, -12646.782522),
            new Vector(528.577931, -12632.964869),
        ],

        [
            new Vector(523.266786, -12657.057994),
            new Vector(508.891095, -12670.3842),
            new Vector(492.178408, -12652.169795),
            new Vector(503.923457, -12641.393088),
            new Vector(511.076379, -12649.188735),
            new Vector(513.672089, -12646.782522),
        ],

        [
            new Vector(492.178408, -12652.169795),
            new Vector(478.372864, -12637.123755),
            new Vector(490.117913, -12626.347047),
            new Vector(503.923457, -12641.393088),
        ],

        [
            new Vector(475.118723, -12515.513301),
            new Vector(430.600354, -12557.1832),
            new Vector(421.4334, -12547.222275),
            new Vector(466.15668, -12505.765391),
        ],

        [
            new Vector(466.15668, -12505.765391),
            new Vector(479.926186, -12493.001549),
            new Vector(498.959382, -12513.673918),
            new Vector(487.018357, -12524.668105),
            new Vector(476.998453, -12513.753844),
            new Vector(475.118723, -12515.513301),
        ],

        [
            new Vector(430.600354, -12557.1832),
            new Vector(428.800742, -12558.867665),
            new Vector(438.706579, -12569.450645),
            new Vector(426.859334, -12580.507966),
            new Vector(407.667397, -12559.982868),
            new Vector(421.4334, -12547.222275),
        ],

        [
            new Vector(419.191772, -12484.301457),
            new Vector(387.495425, -12513.684756),
            new Vector(377.47701, -12502.780779),
            new Vector(365.54616, -12513.742052),
            new Vector(384.567362, -12534.437133),
            new Vector(428.150247, -12494.035403),
        ],

        [
            new Vector(428.150247, -12494.035403),
            new Vector(456.821687, -12467.45672),
            new Vector(437.627439, -12446.933782),
            new Vector(425.782935, -12457.988316),
            new Vector(435.907226, -12468.805818),
            new Vector(419.191772, -12484.301457),
        ],

        [
            new Vector(302.142667, -12591.814588),
            new Vector(285.422581, -12607.314521),
            new Vector(275.404252, -12596.410466),
            new Vector(263.473402, -12607.371739),
            new Vector(282.494603, -12628.066819),
            new Vector(311.325424, -12601.340387),
        ],

        [
            new Vector(311.325424, -12601.340387),
            new Vector(354.748928, -12561.086406),
            new Vector(335.554681, -12540.563469),
            new Vector(323.710177, -12551.618002),
            new Vector(333.834468, -12562.435505),
            new Vector(302.142667, -12591.814588),
        ],

        [
            new Vector(157.784336, -12595.076196),
            new Vector(152.062268, -12600.352286),
            new Vector(132.363155, -12598.945928),
            new Vector(131.585106, -12613.425031),
            new Vector(157.451789, -12614.718659),
            new Vector(167.481346, -12605.312349),
        ],

        [
            new Vector(167.481346, -12605.312349),
            new Vector(195.999461, -12578.566379),
            new Vector(176.804877, -12558.043759),
            new Vector(164.960373, -12569.098293),
            new Vector(174.609173, -12579.562688),
            new Vector(157.784336, -12595.076196),
        ],

        [
            new Vector(132.363155, -12598.945928),
            new Vector(108.944803, -12597.274045),
            new Vector(108.164246, -12612.253722),
            new Vector(131.585106, -12613.425031),
        ],

        [
            new Vector(992.706813, -11757.66462),
            new Vector(959.325951, -11780.862559),
            new Vector(951.734665, -11769.940435),
            new Vector(985.115939, -11746.741843),
        ],

        [
            new Vector(985.115939, -11746.741843),
            new Vector(1000.533448, -11736.027318),
            new Vector(1016.570404, -11759.103459),
            new Vector(1003.267414, -11768.348482),
            new Vector(994.821343, -11756.195133),
            new Vector(992.706813, -11757.66462),
        ],

        [
            new Vector(959.325951, -11780.862559),
            new Vector(940.521037, -11793.930983),
            new Vector(948.963449, -11806.106564),
            new Vector(935.663562, -11815.328557),
            new Vector(919.630648, -11792.251387),
            new Vector(951.734665, -11769.940435),
        ],

        [
            new Vector(1047.992145, -11836.85867),
            new Vector(982.571, -11882.460397),
            new Vector(966.489124, -11859.38894),
            new Vector(979.398651, -11850.396868),
            new Vector(988.251316, -11862.287063),
            new Vector(1040.384986, -11825.945593),
        ],

        [
            new Vector(1040.384986, -11825.945593),
            new Vector(1042.497272, -11824.473155),
            new Vector(1021.609099, -11792.409584),
            new Vector(1033.91442, -11783.83176),
            new Vector(1063.394528, -11826.122459),
            new Vector(1047.992145, -11836.85867),
        ],

        [
            new Vector(966.489124, -11859.38894),
            new Vector(953.092902, -11840.170389),
            new Vector(965.398682, -11831.593222),
            new Vector(979.398651, -11850.396868),
        ],

        [
            new Vector(934.536472, -11915.942757),
            new Vector(869.115462, -11961.544389),
            new Vector(853.026562, -11938.462855),
            new Vector(865.922314, -11929.452924),
            new Vector(874.795778, -11941.371056),
            new Vector(926.929316, -11905.029678),
        ],

        [
            new Vector(926.929316, -11905.029678),
            new Vector(929.041735, -11903.557148),
            new Vector(908.153561, -11871.493576),
            new Vector(920.458883, -11862.915752),
            new Vector(949.93899, -11905.206452),
            new Vector(934.536472, -11915.942757),
        ],

        [
            new Vector(853.026562, -11938.462855),
            new Vector(839.637364, -11919.254381),
            new Vector(851.943144, -11910.677214),
            new Vector(865.922314, -11929.452924),
        ],

        [
            new Vector(876.527385, -11827.554133),
            new Vector(867.665553, -11815.689719),
            new Vector(813.386719, -11853.457105),
            new Vector(821.408616, -11865.925522),
            new Vector(808.474371, -11874.931053),
            new Vector(792.49633, -11851.77751),
            new Vector(873.39943, -11795.553232),
            new Vector(889.414623, -11818.598059),
        ],

        [
            new Vector(889.414623, -11818.598059),
            new Vector(902.816974, -11837.883175),
            new Vector(890.632045, -11846.43776),
            new Vector(876.527385, -11827.554133),
        ],

        [
            new Vector(821.408616, -11865.925522),
            new Vector(834.133362, -11885.703567),
            new Vector(821.7755, -11894.205522),
            new Vector(808.474371, -11874.931053),
        ],

        [
            new Vector(561.522799, -11912.03109),
            new Vector(544.383013, -11923.007756),
            new Vector(536.978271, -11911.560509),
            new Vector(553.981922, -11900.424661),
        ],

        [
            new Vector(553.981922, -11900.424661),
            new Vector(587.059805, -11878.76165),
            new Vector(600.702113, -11899.759007),
            new Vector(587.335585, -11908.443448),
            new Vector(581.39704, -11899.303224),
            new Vector(561.522799, -11912.03109),
        ],

        [
            new Vector(544.383013, -11923.007756),
            new Vector(527.267475, -11933.968893),
            new Vector(519.975112, -11922.696036),
            new Vector(536.978271, -11911.560509),
        ],

        [
            new Vector(527.267475, -11933.968893),
            new Vector(525.099035, -11935.357606),
            new Vector(533.137843, -11947.78294),
            new Vector(519.543404, -11956.576094),
            new Vector(504.286044, -11932.970951),
            new Vector(519.975112, -11922.696036),
        ],

        [
            new Vector(533.137843, -11947.78294),
            new Vector(545.256236, -11966.513961),
            new Vector(531.653718, -11975.312341),
            new Vector(519.543404, -11956.576094),
        ],

        [
            new Vector(460.641786, -11994.598097),
            new Vector(452.603759, -11982.171104),
            new Vector(414.147785, -12007.046352),
            new Vector(422.195959, -12019.489033),
            new Vector(408.712491, -12028.457076),
            new Vector(393.327942, -12004.672169),
            new Vector(458.981982, -11962.203779),
            new Vector(474.319655, -11985.916211),
        ],

        [
            new Vector(474.319655, -11985.916211),
            new Vector(486.360727, -12004.532013),
            new Vector(472.758208, -12013.330393),
            new Vector(460.641786, -11994.598097),
        ],

        [
            new Vector(422.195959, -12019.489033),
            new Vector(434.311065, -12038.219294),
            new Vector(420.715109, -12047.013429),
            new Vector(408.712491, -12028.457076),
        ],

        [
            new Vector(373.51179, -12051.001362),
            new Vector(358.217229, -12027.407833),
            new Vector(292.604209, -12069.939572),
            new Vector(307.99744, -12093.498899),
            new Vector(321.574501, -12084.713998),
            new Vector(313.433406, -12072.289118),
            new Vector(351.865314, -12047.376704),
            new Vector(359.913353, -12059.797411),
        ],

        [
            new Vector(359.913353, -12059.797411),
            new Vector(372.053485, -12078.533532),
            new Vector(385.647117, -12069.721429),
            new Vector(373.51179, -12051.001362),
        ],

        [
            new Vector(307.99744, -12093.498899),
            new Vector(320.1875, -12112.155775),
            new Vector(333.781132, -12103.343672),
            new Vector(321.574501, -12084.713998),
        ],

        [
            new Vector(255.381507, -12118.980746),
            new Vector(278.158731, -12153.976578),
            new Vector(269.304718, -12159.73926),
            new Vector(294.943573, -12187.33319),
            new Vector(286.449537, -12192.990496),
            new Vector(217.543162, -12118.472873),
            new Vector(226.07281, -12112.989308),
            new Vector(240.523668, -12128.612374),
        ],

        [
            new Vector(291.444738, -12145.32931),
            new Vector(269.304718, -12159.73926),
            new Vector(294.943573, -12187.33319),
            new Vector(311.517804, -12176.29421),
        ],

        [
            new Vector(268.747441, -12110.316249),
            new Vector(240.523668, -12128.612374),
            new Vector(226.07281, -12112.989308),
            new Vector(257.319915, -12092.672962),
        ],

        [
            new Vector(197.134523, -12219.565826),
            new Vector(176.140741, -12187.056673),
            new Vector(171.056796, -12190.34515),
            new Vector(152.11371, -12161.02455),
            new Vector(165.675485, -12152.250305),
            new Vector(216.442565, -12207.097066),
        ],

        [
            new Vector(216.442565, -12207.097066),
            new Vector(234.69036, -12226.811266),
            new Vector(206.396826, -12245.082683),
            new Vector(192.042199, -12222.85435),
        ],

        [
            new Vector(102.848179, -12192.948696),
            new Vector(87.095687, -12203.162987),
            new Vector(102.377601, -12226.744191),
            new Vector(115.985263, -12217.943447),
            new Vector(107.9212, -12205.514029),
            new Vector(110.103806, -12204.141295),
        ],

        [
            new Vector(110.103806, -12204.141295),
            new Vector(144.517072, -12182.497325),
            new Vector(136.955776, -12170.832517),
            new Vector(102.848179, -12192.948696),
        ],

        [
            new Vector(7.7746, -12301.180024),
            new Vector(-1.16466, -12287.390238),
            new Vector(53.326505, -12227.916012),
            new Vector(72.220378, -12257.061877),
            new Vector(58.625817, -12265.872546),
            new Vector(50.050475, -12252.641086),
            new Vector(17.858227, -12287.325036),
            new Vector(21.192347, -12292.448701),
        ],

        [
            new Vector(21.192347, -12292.448701),
            new Vector(32.338378, -12309.577217),
            new Vector(18.890788, -12318.32796),
            new Vector(7.7746, -12301.180024),
        ],

        [
            new Vector(32.338378, -12309.577217),
            new Vector(54.449627, -12343.556389),
            new Vector(40.942837, -12352.345656),
            new Vector(18.890788, -12318.32796),
        ],

        [
            new Vector(302.810384, -11755.615761),
            new Vector(268.702286, -11777.730524),
            new Vector(275.938831, -11788.891044),
            new Vector(310.046118, -11766.77574),
        ],

        [
            new Vector(310.046118, -11766.77574),
            new Vector(312.206671, -11765.374829),
            new Vector(320.258561, -11777.792842),
            new Vector(333.851252, -11768.979286),
            new Vector(318.563541, -11745.401842),
            new Vector(302.810384, -11755.615761),
        ],

        [
            new Vector(268.702286, -11777.730524),
            new Vector(252.948506, -11787.944847),
            new Vector(268.237154, -11811.523736),
            new Vector(281.829844, -11802.71018),
            new Vector(273.777954, -11790.292166),
            new Vector(275.938831, -11788.891044),
        ],

        [
            new Vector(272.263244, -11932.985343),
            new Vector(268.343771, -11935.525537),
            new Vector(227.521381, -11926.51909),
            new Vector(230.602554, -11913.00933),
            new Vector(246.585334, -11916.535532),
            new Vector(245.595887, -11921.020275),
            new Vector(259.95005, -11924.187165),
            new Vector(263.597114, -11921.822947),
        ],

        [
            new Vector(263.597114, -11921.822947),
            new Vector(258.310204, -11913.66731),
            new Vector(276.854604, -11901.645861),
            new Vector(292.248586, -11925.392762),
            new Vector(282.011406, -11932.029037),
            new Vector(281.358658, -11931.022101),
            new Vector(275.06531, -11935.101779),
            new Vector(273.270252, -11932.332706),
            new Vector(272.263244, -11932.985343),
        ],

        [
            new Vector(227.521381, -11926.51909),
            new Vector(207.736084, -11922.153956),
            new Vector(210.735984, -11908.626267),
            new Vector(230.602554, -11913.00933),
        ],

        [
            new Vector(207.736084, -11922.153956),
            new Vector(195.294738, -11919.409082),
            new Vector(183.681137, -11901.627366),
            new Vector(195.78119, -11893.724574),
            new Vector(205.263886, -11907.418985),
            new Vector(210.735984, -11908.626267),
        ],

        [
            new Vector(183.681137, -11901.627366),
            new Vector(172.554003, -11884.590487),
            new Vector(184.205419, -11877.007455),
            new Vector(195.78119, -11893.724574),
        ],

        [
            new Vector(209.402537, -11832.12771),
            new Vector(175.294954, -11854.243207),
            new Vector(168.05872, -11843.082485),
            new Vector(202.166492, -11820.967933),
        ],

        [
            new Vector(202.166492, -11820.967933),
            new Vector(217.919974, -11810.753803),
            new Vector(233.207686, -11834.331247),
            new Vector(219.614995, -11843.144803),
            new Vector(211.563104, -11830.72679),
            new Vector(209.402537, -11832.12771),
        ],

        [
            new Vector(175.294954, -11854.243207),
            new Vector(173.134387, -11855.644127),
            new Vector(181.186278, -11868.062141),
            new Vector(167.593588, -11876.875697),
            new Vector(152.30494, -11853.296808),
            new Vector(168.05872, -11843.082485),
        ],

        [
            new Vector(131.491422, -11935.860976),
            new Vector(86.130577, -11964.978939),
            new Vector(70.710609, -11941.215296),
            new Vector(83.683376, -11932.797409),
            new Vector(87.925643, -11939.390879),
            new Vector(99.81803, -11941.979193),
            new Vector(124.984245, -11925.723899),
        ],

        [
            new Vector(124.984245, -11925.723899),
            new Vector(116.197254, -11912.120004),
            new Vector(133.753405, -11900.780183),
            new Vector(149.108283, -11924.552388),
            new Vector(131.491422, -11935.860976),
        ],

        [
            new Vector(70.710609, -11941.215296),
            new Vector(55.288321, -11917.44808),
            new Vector(73.852481, -11905.457168),
            new Vector(89.207359, -11929.229373),
            new Vector(83.677059, -11932.787592),
            new Vector(83.683376, -11932.797409),
        ],

        [
            new Vector(-3.500398, -11954.182421),
            new Vector(-37.607845, -11976.296763),
            new Vector(-30.371312, -11987.457291),
            new Vector(3.735648, -11965.342199),
        ],

        [
            new Vector(3.735648, -11965.342199),
            new Vector(5.896215, -11963.941279),
            new Vector(13.948105, -11976.359292),
            new Vector(27.540796, -11967.545736),
            new Vector(12.253084, -11943.968291),
            new Vector(-3.500398, -11954.182421),
        ],

        [
            new Vector(-37.607845, -11976.296763),
            new Vector(-53.36195, -11986.511296),
            new Vector(-38.073302, -12010.090185),
            new Vector(-24.480612, -12001.276629),
            new Vector(-32.532502, -11988.858616),
            new Vector(-30.371312, -11987.457291),
        ],

        [
            new Vector(97.062991, -12109.294237),
            new Vector(62.956268, -12131.409718),
            new Vector(55.720631, -12120.248609),
            new Vector(89.828138, -12098.133686),
        ],

        [
            new Vector(89.828138, -12098.133686),
            new Vector(91.987648, -12096.733484),
            new Vector(83.935892, -12084.315384),
            new Vector(97.528677, -12075.501975),
            new Vector(112.816134, -12099.079584),
            new Vector(97.062991, -12109.294237),
        ],

        [
            new Vector(62.956268, -12131.409718),
            new Vector(47.202512, -12141.624768),
            new Vector(31.914119, -12118.045714),
            new Vector(45.506905, -12109.232305),
            new Vector(53.558661, -12121.650406),
            new Vector(55.720631, -12120.248609),
        ],

        [
            new Vector(-3.622977, -12174.577883),
            new Vector(-37.730289, -12196.693746),
            new Vector(-44.966947, -12185.533298),
            new Vector(-10.859147, -12163.418186),
        ],

        [
            new Vector(-10.859147, -12163.418186),
            new Vector(-8.699654, -12162.017995),
            new Vector(-16.75141, -12149.599894),
            new Vector(-3.158624, -12140.786486),
            new Vector(12.128832, -12164.364095),
            new Vector(-3.622977, -12174.577883),
        ],

        [
            new Vector(-37.730289, -12196.693746),
            new Vector(-53.48479, -12206.909279),
            new Vector(-68.773183, -12183.330225),
            new Vector(-55.180397, -12174.516816),
            new Vector(-47.128641, -12186.934916),
            new Vector(-44.966947, -12185.533298),
        ],

        [
            new Vector(-104.186993, -12019.468021),
            new Vector(-138.425358, -12041.667246),
            new Vector(-131.030729, -12052.725269),
            new Vector(-96.950947, -12030.627799),
        ],

        [
            new Vector(-96.950947, -12030.627799),
            new Vector(-94.79038, -12029.226879),
            new Vector(-86.73849, -12041.644892),
            new Vector(-73.1458, -12032.831336),
            new Vector(-88.433511, -12009.253892),
            new Vector(-104.186993, -12019.468021),
        ],

        [
            new Vector(-138.425358, -12041.667246),
            new Vector(-154.048545, -12051.796896),
            new Vector(-138.759897, -12075.375785),
            new Vector(-125.167207, -12066.562229),
            new Vector(-133.219098, -12054.144216),
            new Vector(-131.030729, -12052.725269),
        ],

        [
            new Vector(17.180757, -11858.493632),
            new Vector(1.835107, -11834.713233),
            new Vector(45.977872, -11805.921686),
            new Vector(52.556752, -11816.008326),
            new Vector(28.423851, -11831.651638),
            new Vector(25.912034, -11843.560416),
            new Vector(30.173618, -11850.109253),
        ],

        [
            new Vector(35.699191, -11846.543564),
            new Vector(51.752615, -11871.309141),
            new Vector(33.2079, -11883.330106),
            new Vector(17.180757, -11858.493632),
        ],

        [
            new Vector(45.977872, -11805.921686),
            new Vector(64.517118, -11793.829703),
            new Vector(80.563202, -11818.583959),
            new Vector(61.365766, -11829.59797),
            new Vector(52.556752, -11816.008326),
        ],

        [
            new Vector(-45.363145, -11884.388633),
            new Vector(-56.494936, -11867.26954),
            new Vector(-43.112945, -11858.608943),
            new Vector(-32.020982, -11875.772523),
        ],

        [
            new Vector(-32.020982, -11875.772523),
            new Vector(-10.0097, -11909.832536),
            new Vector(-23.263095, -11918.375332),
            new Vector(-45.363145, -11884.388633),
        ],

        [
            new Vector(-83.24985, -11830.857149),
            new Vector(-117.263294, -11852.914915),
            new Vector(-124.949185, -11840.920266),
            new Vector(-91.041434, -11819.00879),
        ],

        [
            new Vector(-91.041434, -11819.00879),
            new Vector(-75.412547, -11808.909272),
            new Vector(-53.409501, -11842.958726),
            new Vector(-66.350971, -11851.351287),
            new Vector(-80.709713, -11829.209866),
            new Vector(-83.24985, -11830.857149),
        ],

        [
            new Vector(-117.263294, -11852.914915),
            new Vector(-119.972997, -11854.67216),
            new Vector(-105.728765, -11876.805565),
            new Vector(-119.008719, -11885.349296),
            new Vector(-140.948045, -11851.258865),
            new Vector(-124.949185, -11840.920266),
        ],

        [
            new Vector(-188.807222, -11921.983318),
            new Vector(-183.233474, -11896.660742),
            new Vector(-168.358037, -11886.963109),
            new Vector(-176.51135, -11874.436184),
            new Vector(-195.223572, -11886.691594),
            new Vector(-202.331486, -11918.984177),
        ],

        [
            new Vector(-202.331486, -11918.984177),
            new Vector(-211.831463, -11962.144347),
            new Vector(-175.992087, -12017.643074),
            new Vector(-109.03713, -11974.276607),
            new Vector(-116.599393, -11962.611701),
            new Vector(-169.580264, -11997.669228),
            new Vector(-196.350899, -11956.255653),
            new Vector(-188.807222, -11921.983318),
        ],

        [
            new Vector(223.402981, -11635.287662),
            new Vector(217.987657, -11626.926219),
            new Vector(132.681599, -11570.807251),
            new Vector(98.420187, -11593.018211),
            new Vector(134.216566, -11648.23728),
            new Vector(121.881615, -11656.233533),
            new Vector(78.039141, -11588.600845),
            new Vector(132.680739, -11553.208228),
            new Vector(226.071257, -11614.648276),
            new Vector(234.702308, -11627.962748),
        ],

        [
            new Vector(234.702308, -11627.962748),
            new Vector(245.799028, -11645.080822),
            new Vector(234.492492, -11652.410237),
            new Vector(223.402981, -11635.287662),
        ],

        [
            new Vector(249.451638, -11535.165826),
            new Vector(254.325536, -11542.684346),
            new Vector(240.950073, -11551.35502),
            new Vector(236.076175, -11543.836501),
        ],

        [
            new Vector(236.076175, -11543.836501),
            new Vector(211.374747, -11505.731847),
            new Vector(261.191643, -11473.437939),
            new Vector(268.883195, -11485.302999),
            new Vector(232.441763, -11508.926235),
            new Vector(249.451638, -11535.165826),
        ],

        [
            new Vector(254.325536, -11542.684346),
            new Vector(271.334705, -11568.922849),
            new Vector(290.995125, -11556.177937),
            new Vector(298.686677, -11568.042996),
            new Vector(265.650793, -11589.458582),
            new Vector(240.950073, -11551.35502),
        ],

        [
            new Vector(329.087121, -11518.495567),
            new Vector(296.122962, -11467.644748),
            new Vector(276.462542, -11480.38966),
            new Vector(268.770991, -11468.524601),
            new Vector(301.807239, -11447.109579),
            new Vector(342.461513, -11509.825586),
        ],

        [
            new Vector(342.461513, -11509.825586),
            new Vector(356.081472, -11530.836647),
            new Vector(323.047018, -11552.251307),
            new Vector(315.355466, -11540.386248),
            new Vector(335.015886, -11527.641336),
            new Vector(329.087121, -11518.495567),
        ],

        [
            new Vector(242.447651, -11384.84066),
            new Vector(233.586444, -11371.171279),
            new Vector(246.962122, -11362.50079),
            new Vector(255.823208, -11376.169925),
        ],

        [
            new Vector(255.823208, -11376.169925),
            new Vector(277.87529, -11410.187528),
            new Vector(264.499667, -11418.858305),
            new Vector(242.447651, -11384.84066),
        ],

        [
            new Vector(233.586444, -11371.171279),
            new Vector(218.888165, -11348.497578),
            new Vector(216.056234, -11350.332578),
            new Vector(208.594274, -11338.309127),
            new Vector(224.567346, -11327.954547),
            new Vector(246.962122, -11362.50079),
        ],

        [
            new Vector(216.056234, -11350.332578),
            new Vector(182.440752, -11372.114332),
            new Vector(174.749201, -11360.249273),
            new Vector(208.594274, -11338.309127),
        ],

        [
            new Vector(158.080392, -11387.905991),
            new Vector(155.202234, -11389.771764),
            new Vector(169.905243, -11412.452763),
            new Vector(156.52978, -11421.123437),
            new Vector(134.135219, -11386.577378),
            new Vector(150.38884, -11376.040932),
        ],

        [
            new Vector(150.38884, -11376.040932),
            new Vector(167.171102, -11365.161792),
            new Vector(174.862654, -11377.026852),
            new Vector(158.080392, -11387.905991),
        ],

        [
            new Vector(169.905243, -11412.452763),
            new Vector(178.76645, -11426.122143),
            new Vector(165.390987, -11434.792818),
            new Vector(156.52978, -11421.123437),
        ],

        [
            new Vector(178.76645, -11426.122143),
            new Vector(200.818466, -11460.139789),
            new Vector(187.443003, -11468.810463),
            new Vector(165.390987, -11434.792818),
        ],

        [
            new Vector(94.004115, -11295.361173),
            new Vector(98.877989, -11302.879656),
            new Vector(85.502526, -11311.55033),
            new Vector(80.628652, -11304.031847),
        ],

        [
            new Vector(80.628652, -11304.031847),
            new Vector(55.927566, -11265.927721),
            new Vector(105.744462, -11233.633814),
            new Vector(113.436014, -11245.498873),
            new Vector(76.994583, -11269.122109),
            new Vector(94.004115, -11295.361173),
        ],

        [
            new Vector(98.877989, -11302.879656),
            new Vector(115.887524, -11329.118723),
            new Vector(135.547944, -11316.373811),
            new Vector(143.239496, -11328.23887),
            new Vector(110.203613, -11349.654457),
            new Vector(85.502526, -11311.55033),
        ],

        [
            new Vector(187.013967, -11270.020897),
            new Vector(200.634291, -11291.032521),
            new Vector(167.599837, -11312.447181),
            new Vector(159.908285, -11300.582122),
            new Vector(179.568705, -11287.83721),
            new Vector(173.639574, -11278.690877),
        ],

        [
            new Vector(173.639574, -11278.690877),
            new Vector(140.675781, -11227.840623),
            new Vector(121.015361, -11240.585535),
            new Vector(113.32381, -11228.720475),
            new Vector(146.360058, -11207.305453),
            new Vector(187.013967, -11270.020897),
        ],

        [
            new Vector(48.491701, -11366.706547),
            new Vector(14.157131, -11313.742224),
            new Vector(7.779901, -11317.876318),
            new Vector(-0.864327, -11304.541779),
            new Vector(17.377941, -11292.716075),
            new Vector(60.356772, -11359.014988),
        ],

        [
            new Vector(60.356772, -11359.014988),
            new Vector(70.881727, -11375.250725),
            new Vector(33.908837, -11399.331176),
            new Vector(18.992388, -11389.472279),
            new Vector(27.906028, -11376.00169),
            new Vector(34.200481, -11380.145869),
            new Vector(50.357406, -11369.584574),
            new Vector(48.491701, -11366.706547),
        ],

        [
            new Vector(18.992388, -11389.472279),
            new Vector(-10.330227, -11370.091752),
            new Vector(-1.404911, -11356.703779),
            new Vector(27.906028, -11376.00169),
        ],

        [
            new Vector(-10.330227, -11370.091752),
            new Vector(-49.771566, -11344.023342),
            new Vector(-41.057292, -11330.597208),
            new Vector(-1.404911, -11356.703779),
        ],

        [
            new Vector(101.605021, -11138.26348),
            new Vector(123.657103, -11172.281083),
            new Vector(109.862084, -11181.223735),
            new Vector(88.012836, -11147.074645),
        ],

        [
            new Vector(88.012836, -11147.074645),
            new Vector(79.203688, -11133.306465),
            new Vector(92.69466, -11124.518332),
            new Vector(101.605021, -11138.26348),
        ],

        [
            new Vector(79.203688, -11133.306465),
            new Vector(64.669979, -11110.591133),
            new Vector(61.77936, -11112.464161),
            new Vector(54.157556, -11100.544346),
            new Vector(70.34916, -11090.048102),
            new Vector(92.69466, -11124.518332),
        ],

        [
            new Vector(61.77936, -11112.464161),
            new Vector(28.222566, -11134.207887),
            new Vector(20.531014, -11122.342828),
            new Vector(54.157556, -11100.544346),
        ],

        [
            new Vector(-3.829346, -11138.134487),
            new Vector(12.952916, -11127.255347),
            new Vector(20.644468, -11139.120407),
            new Vector(3.862205, -11149.999546),
        ],

        [
            new Vector(3.862205, -11149.999546),
            new Vector(0.984047, -11151.865319),
            new Vector(15.686431, -11174.545352),
            new Vector(2.310968, -11183.216027),
            new Vector(-20.082967, -11148.670933),
            new Vector(-3.829346, -11138.134487),
        ],

        [
            new Vector(11.172801, -11196.886373),
            new Vector(2.310968, -11183.216027),
            new Vector(15.686431, -11174.545352),
            new Vector(24.548264, -11188.215698),
        ],

        [
            new Vector(24.548264, -11188.215698),
            new Vector(46.60028, -11222.233344),
            new Vector(33.224817, -11230.904018),
            new Vector(11.172801, -11196.886373),
        ],

        [
            new Vector(-69.42574, -11297.374285),
            new Vector(-118.113787, -11328.936599),
            new Vector(-130.927133, -11326.202286),
            new Vector(-127.600506, -11310.613279),
            new Vector(-121.244412, -11311.969642),
            new Vector(-78.096399, -11283.998845),
        ],

        [
            new Vector(-78.096399, -11283.998845),
            new Vector(-44.221403, -11262.039302),
            new Vector(-35.5508, -11275.414655),
            new Vector(-69.42574, -11297.374285),
        ],

        [
            new Vector(-130.927133, -11326.202286),
            new Vector(-182.114626, -11315.279094),
            new Vector(-177.768102, -11293.254306),
            new Vector(-163.554796, -11296.059258),
            new Vector(-164.959326, -11302.641066),
            new Vector(-127.600506, -11310.613279),
        ],

        [
            new Vector(-177.768102, -11293.254306),
            new Vector(-168.2837, -11245.19477),
            new Vector(-157.857768, -11238.435984),
            new Vector(-149.067351, -11252.011085),
            new Vector(-154.970865, -11255.833845),
            new Vector(-163.554796, -11296.059258),
        ],

        [
            new Vector(-24.328878, -10958.470641),
            new Vector(-3.177046, -10947.888363),
            new Vector(14.959402, -10984.145236),
            new Vector(0.256319, -10991.500027),
            new Vector(-12.473316, -10966.042328),
            new Vector(-18.922065, -10969.269815),
        ],

        [
            new Vector(12.488003, -11061.617265),
            new Vector(30.761641, -11049.324477),
            new Vector(23.930032, -11035.998452),
            new Vector(37.189221, -11029.201107),
            new Vector(50.05718, -11054.301892),
            new Vector(20.823109, -11073.967832),
        ],

        [
            new Vector(20.823109, -11073.967832),
            new Vector(1.254249, -11087.131925),
            new Vector(-7.062404, -11074.768944),
            new Vector(12.488003, -11061.617265),
        ],

        [
            new Vector(-143.845771, -11179.958717),
            new Vector(-163.655169, -11192.823091),
            new Vector(-173.768668, -11177.249669),
            new Vector(-163.084005, -11170.310968),
            new Vector(-160.486077, -11174.311427),
            new Vector(-151.361341, -11168.385754),
        ],

        [
            new Vector(-151.361341, -11168.385754),
            new Vector(-131.610649, -11155.559505),
            new Vector(-124.095081, -11167.132469),
            new Vector(-143.845771, -11179.958717),
        ],

        [
            new Vector(-316.666338, -10932.388414),
            new Vector(-302.620469, -10920.455303),
            new Vector(-313.536809, -10907.606446),
            new Vector(-327.582569, -10919.539464),
        ],

        [
            new Vector(-327.582569, -10919.539464),
            new Vector(-378.718516, -10962.983621),
            new Vector(-391.015601, -10973.431224),
            new Vector(-380.099345, -10986.279925),
            new Vector(-316.666338, -10932.388414),
        ],

        [
            new Vector(-378.718516, -10962.983621),
            new Vector(-393.353779, -10945.756476),
            new Vector(-405.65151, -10956.2044),
            new Vector(-391.015601, -10973.431224),
        ],

        [
            new Vector(-346.115932, -10877.886184),
            new Vector(-328.327567, -10898.505943),
            new Vector(-317.696773, -10889.334911),
            new Vector(-335.485138, -10868.715153),
        ],

        [
            new Vector(-335.485138, -10868.715153),
            new Vector(-368.075301, -10830.937579),
            new Vector(-407.779742, -10826.698915),
            new Vector(-428.217822, -10844.330549),
            new Vector(-419.046791, -10854.961344),
            new Vector(-403.217596, -10841.305727),
            new Vector(-375.082192, -10844.309334),
            new Vector(-346.115932, -10877.886184),
        ],

        [
            new Vector(-428.217822, -10844.330549),
            new Vector(-448.584122, -10861.90026),
            new Vector(-453.527242, -10899.265474),
            new Vector(-435.431001, -10920.242112),
            new Vector(-424.800207, -10911.071081),
            new Vector(-438.782528, -10894.863179),
            new Vector(-435.366323, -10869.039966),
            new Vector(-419.046791, -10854.961344),
        ],

        [
            new Vector(-435.431001, -10920.242112),
            new Vector(-418.267108, -10940.138),
            new Vector(-407.636314, -10930.966968),
            new Vector(-424.800207, -10911.071081),
        ],

        [
            new Vector(-467.211669, -10930.737248),
            new Vector(-436.560566, -10966.814732),
            new Vector(-448.180561, -10976.686092),
            new Vector(-478.788091, -10940.659895),
        ],

        [
            new Vector(-478.788091, -10940.659895),
            new Vector(-492.157319, -10924.923819),
            new Vector(-480.533733, -10915.056686),
            new Vector(-467.211669, -10930.737248),
        ],

        [
            new Vector(-492.157319, -10924.923819),
            new Vector(-494.742587, -10921.880862),
            new Vector(-500.823244, -10927.046471),
            new Vector(-510.703007, -10915.416584),
            new Vector(-493.002869, -10900.380051),
            new Vector(-480.533733, -10915.056686),
        ],

        [
            new Vector(-500.823244, -10927.046471),
            new Vector(-578.468076, -10993.006923),
            new Vector(-588.347839, -10981.377036),
            new Vector(-510.703007, -10915.416584),
        ],

        [
            new Vector(-578.468076, -10993.006923),
            new Vector(-584.880298, -10998.454202),
            new Vector(-582.313637, -11001.475258),
            new Vector(-593.928236, -11011.342916),
            new Vector(-606.375609, -10996.691897),
            new Vector(-588.347839, -10981.377036),
        ],

        [
            new Vector(-582.313637, -11001.475258),
            new Vector(-568.93981, -11017.216747),
            new Vector(-580.554844, -11027.083893),
            new Vector(-593.928236, -11011.342916),
        ],

        [
            new Vector(-568.93981, -11017.216747),
            new Vector(-538.318706, -11053.25892),
            new Vector(-549.933306, -11063.126578),
            new Vector(-580.554844, -11027.083893),
        ],

        [
            new Vector(-618.093406, -11076.04047),
            new Vector(-600.664265, -11096.557047),
            new Vector(-591.259663, -11088.567697),
            new Vector(-608.688901, -11068.051005),
        ],

        [
            new Vector(-608.688901, -11068.051005),
            new Vector(-626.098077, -11047.557929),
            new Vector(-664.447474, -11045.288731),
            new Vector(-684.96372, -11062.717643),
            new Vector(-676.951493, -11072.10281),
            new Vector(-660.232519, -11057.899747),
            new Vector(-632.089553, -11059.565014),
            new Vector(-618.093406, -11076.04047),
        ],

        [
            new Vector(-684.96372, -11062.717643),
            new Vector(-721.995209, -11094.176545),
            new Vector(-714.005845, -11103.581135),
            new Vector(-676.951493, -11072.10281),
        ],

        [
            new Vector(-763.509969, -11226.639115),
            new Vector(-786.81067, -11197.475547),
            new Vector(-801.211955, -11202.157414),
            new Vector(-776.324934, -11233.306447),
        ],

        [
            new Vector(-776.324934, -11233.306447),
            new Vector(-761.431956, -11284.071372),
            new Vector(-749.367561, -11298.27228),
            new Vector(-738.565731, -11289.095574),
            new Vector(-748.679605, -11277.190609),
            new Vector(-763.509969, -11226.639115),
        ],

        [
            new Vector(-786.81067, -11197.475547),
            new Vector(-785.427962, -11167.083534),
            new Vector(-799.312584, -11160.409106),
            new Vector(-801.211955, -11202.157414),
        ],

        [
            new Vector(-785.427962, -11167.083534),
            new Vector(-749.91207, -11135.929112),
            new Vector(-759.258712, -11125.273984),
            new Vector(-799.312584, -11160.409106),
        ],

        [
            new Vector(-749.91207, -11135.929112),
            new Vector(-733.345541, -11121.397009),
            new Vector(-742.692183, -11110.741881),
            new Vector(-759.258712, -11125.273984),
        ],

        [
            new Vector(-59.010127, -11061.163006),
            new Vector(-71.506319, -11069.278128),
            new Vector(-41.768102, -11115.070966),
            new Vector(-9.814794, -11094.320245),
            new Vector(-17.930841, -11081.822629),
            new Vector(-37.387978, -11094.458241),
        ],

        [
            new Vector(-129.359066, -11008.653569),
            new Vector(-189.462877, -10974.865481),
            new Vector(-181.640651, -10960.950952),
            new Vector(-133.786593, -10987.852693),
            new Vector(-102.685121, -10932.52799),
            new Vector(-90.435373, -10939.414339),
        ],

        [
            new Vector(-612.806236, -10833.235752),
            new Vector(-640.963214, -10800.091007),
            new Vector(-705.445747, -10854.869925),
            new Vector(-716.044242, -10842.393997),
            new Vector(-639.077862, -10777.009855),
            new Vector(-600.322388, -10822.630528),
        ],

        [
            new Vector(-364.877909, -10555.380648),
            new Vector(-299.084469, -10629.55013),
            new Vector(-312.831546, -10641.744734),
            new Vector(-370.489232, -10576.746754),
            new Vector(-398.452475, -10601.552077),
            new Vector(-375.757206, -10627.136638),
            new Vector(-386.454758, -10636.626104),
            new Vector(-417.285781, -10601.87004),
        ],

        [
            new Vector(-424.689731, -10784.89474),
            new Vector(-442.082925, -10799.67052),
            new Vector(-452.953339, -10786.874497),
            new Vector(-435.560145, -10772.098717),
        ],

        [
            new Vector(-435.560145, -10772.098717),
            new Vector(-420.486979, -10759.293836),
            new Vector(-409.616565, -10772.089859),
            new Vector(-424.689731, -10784.89474),
        ],

        [
            new Vector(-420.486979, -10759.293836),
            new Vector(-398.546246, -10740.654854),
            new Vector(-387.675832, -10753.450877),
            new Vector(-409.616565, -10772.089859),
        ],

        [
            new Vector(-398.546246, -10740.654854),
            new Vector(-383.56216, -10727.925648),
            new Vector(-372.691746, -10740.721671),
            new Vector(-387.675832, -10753.450877),
        ],

        [
            new Vector(-418.411366, -10668.114965),
            new Vector(-386.623288, -10705.533888),
            new Vector(-397.765613, -10714.999465),
            new Vector(-429.718674, -10677.837304),
        ],

        [
            new Vector(-429.718674, -10677.837304),
            new Vector(-453.484838, -10650.196695),
            new Vector(-488.529345, -10679.488983),
            new Vector(-497.462825, -10668.973008),
            new Vector(-450.61581, -10630.205921),
            new Vector(-418.411366, -10668.114965),
        ],

        [
            new Vector(-488.529345, -10679.488983),
            new Vector(-504.617448, -10692.936379),
            new Vector(-513.532293, -10682.270898),
            new Vector(-497.462825, -10668.973008),
        ],

        [
            new Vector(-504.617448, -10692.936379),
            new Vector(-520.13451, -10705.906464),
            new Vector(-529.232465, -10695.263187),
            new Vector(-513.532293, -10682.270898),
        ],

        [
            new Vector(-520.13451, -10705.906464),
            new Vector(-529.913939, -10714.080694),
            new Vector(-539.004739, -10703.34999),
            new Vector(-529.232465, -10695.263187),
        ],

        [
            new Vector(-486.454583, -10815.488116),
            new Vector(-500.696916, -10827.55664),
            new Vector(-491.025497, -10838.970096),
            new Vector(-476.783164, -10826.901573),
        ],

        [
            new Vector(-476.783164, -10826.901573),
            new Vector(-462.540832, -10814.83305),
            new Vector(-472.212259, -10803.4196),
            new Vector(-486.454583, -10815.488116),
        ],

        [
            new Vector(-500.696916, -10827.55664),
            new Vector(-524.167707, -10847.44508),
            new Vector(-528.238363, -10842.641208),
            new Vector(-538.88884, -10851.666102),
            new Vector(-525.146756, -10867.883422),
            new Vector(-491.025497, -10838.970096),
        ],

        [
            new Vector(-528.238363, -10842.641208),
            new Vector(-544.255634, -10823.738871),
            new Vector(-554.906122, -10832.763773),
            new Vector(-538.88884, -10851.666102),
        ],

        [
            new Vector(-544.255634, -10823.738871),
            new Vector(-561.708941, -10803.141834),
            new Vector(-572.359436, -10812.166753),
            new Vector(-554.906122, -10832.763773),
        ],

        [
            new Vector(-561.708941, -10803.141834),
            new Vector(-571.65829, -10791.400387),
            new Vector(-582.308796, -10800.425305),
            new Vector(-572.359436, -10812.166753),
        ],

        [
            new Vector(-565.360815, -10725.160309),
            new Vector(-549.719342, -10712.216595),
            new Vector(-539.040666, -10724.968404),
            new Vector(-554.733012, -10737.978859),
        ],

        [
            new Vector(-554.733012, -10737.978859),
            new Vector(-570.166861, -10750.774995),
            new Vector(-580.806582, -10737.94207),
            new Vector(-565.360815, -10725.160309),
        ],

        [
            new Vector(-570.166861, -10750.774995),
            new Vector(-602.115875, -10777.263781),
            new Vector(-612.934522, -10764.528752),
            new Vector(-580.806582, -10737.94207),
        ],

        [
            new Vector(-582.604057, -10897.007191),
            new Vector(-598.913345, -10910.862314),
            new Vector(-588.314792, -10923.338194),
            new Vector(-572.005504, -10909.483071),
        ],

        [
            new Vector(-572.005504, -10909.483071),
            new Vector(-540.994854, -10883.138796),
            new Vector(-551.593407, -10870.662916),
            new Vector(-582.604057, -10897.007191),
        ],

        [
            new Vector(-804.473313, -10932.524043),
            new Vector(-795.255509, -10943.508927),
            new Vector(-731.935388, -10890.374777),
            new Vector(-741.153192, -10879.389893),
        ],

        [
            new Vector(-792.482078, -10950.17799),
            new Vector(-803.466963, -10959.395794),
            new Vector(-763.580996, -11006.928017),
            new Vector(-752.596112, -10997.710212),
        ],

        [
            new Vector(-723.425836, -10882.801885),
            new Vector(-670.291686, -10946.122006),
            new Vector(-659.306802, -10936.904201),
            new Vector(-712.440952, -10873.58408),
        ],

        [
            new Vector(-741.440201, -10986.941907),
            new Vector(-732.222397, -10997.926791),
            new Vector(-694.801784, -10966.525833),
            new Vector(-704.019588, -10955.540948),
        ],

        [
            new Vector(-642.426347, -10846.532402),
            new Vector(-621.300509, -10871.400517),
            new Vector(-611.956897, -10863.462979),
            new Vector(-642.684106, -10827.292684),
            new Vector(-692.382061, -10869.511843),
            new Vector(-684.444522, -10878.855455),
            new Vector(-646.048747, -10846.237667),
        ],

        [
            new Vector(-502.858003, -10735.846964),
            new Vector(-490.443041, -10725.300267),
            new Vector(-464.150753, -10756.250027),
            new Vector(-476.565714, -10766.796725),
        ],

        [
            new Vector(-312.831546, -10641.744734),
            new Vector(-299.035241, -10657.297421),
            new Vector(-313.817401, -10670.410214),
            new Vector(-327.613705, -10654.857527),
        ],

        [
            new Vector(-132.076751, -10870.476011),
            new Vector(-141.230687, -10859.817307),
            new Vector(-107.964912, -10831.247906),
            new Vector(-98.810976, -10841.906609),
        ],

        [
            new Vector(-391.013406, -11071.737195),
            new Vector(-226.14927, -11020.914297),
            new Vector(-216.439544, -11052.411626),
            new Vector(-263.121744, -11066.802413),
            new Vector(-256.49933, -11088.284826),
            new Vector(-231.911142, -11080.70499),
            new Vector(-234.37098, -11072.725536),
            new Vector(-212.276968, -11065.914584),
            new Vector(-205.804797, -11086.909628),
            new Vector(-370.701792, -11137.625689),
            new Vector(-377.130353, -11116.724018),
            new Vector(-355.049951, -11109.917261),
            new Vector(-352.587256, -11117.905985),
            new Vector(-330.464576, -11111.086196),
            new Vector(-337.464497, -11088.956259),
            new Vector(-381.518732, -11102.53692),
        ],

        [
            new Vector(-710.263974, -11181.107422),
            new Vector(-702.139307, -11174.290017),
            new Vector(-699.606724, -11177.308232),
            new Vector(-659.917627, -11143.952909),
            new Vector(-662.424499, -11140.965336),
            new Vector(-654.299832, -11134.14793),
            new Vector(-644.493464, -11145.834704),
            new Vector(-653.723544, -11153.579661),
            new Vector(-653.896267, -11155.553902),
            new Vector(-641.742682, -11156.617203),
            new Vector(-643.107029, -11171.81177),
            new Vector(-652.984428, -11170.947378),
            new Vector(-653.167696, -11173.04214),
            new Vector(-657.009071, -11172.706063),
            new Vector(-656.968634, -11170.599116),
            new Vector(-659.592496, -11172.800798),
            new Vector(-654.868883, -11178.43018),
            new Vector(-666.555657, -11188.236548),
            new Vector(-671.344425, -11182.529517),
            new Vector(-673.890637, -11184.666042),
            new Vector(-673.915622, -11184.951711),
            new Vector(-671.821172, -11185.134891),
            new Vector(-672.157244, -11188.976218),
            new Vector(-674.275032, -11188.795869),
            new Vector(-675.118897, -11198.705114),
            new Vector(-690.339788, -11197.373777),
            new Vector(-689.253571, -11185.222207),
            new Vector(-691.227817, -11185.049483),
            new Vector(-700.457607, -11192.794196),
        ],

        [
            new Vector(-92.792392, -10818.217394),
            new Vector(-74.084988, -10802.151047),
            new Vector(-57.167328, -10839.005979),
            new Vector(-71.629204, -10845.7325),
            new Vector(-80.574804, -10826.244963),
            new Vector(-83.638455, -10828.876096),
        ],

        [
            new Vector(-296.391243, -11347.437337),
            new Vector(-323.282869, -11344.248788),
            new Vector(-320.992778, -11324.934592),
            new Vector(-294.101152, -11328.123141),
        ],

        [
            new Vector(-302.15667, -11396.146808),
            new Vector(-329.048297, -11392.958259),
            new Vector(-326.758206, -11373.644062),
            new Vector(-299.86658, -11376.832611),
        ],

        [
            new Vector(-248.035783, -11402.563939),
            new Vector(-274.927409, -11399.37539),
            new Vector(-272.637319, -11380.061194),
            new Vector(-245.745693, -11383.249743),
        ],

        [
            new Vector(-206.80411, -11417.872178),
            new Vector(-194.094034, -11358.311117),
            new Vector(-102.012484, -11377.960926),
            new Vector(-64.709845, -11402.597853),
            new Vector(-83.998693, -11431.802995),
            new Vector(-115.783702, -11410.810246),
            new Vector(-167.16911, -11399.84482),
            new Vector(-172.574797, -11425.176567),
        ],

        [
            new Vector(-147.629978, -11231.352022),
            new Vector(-88.826009, -11193.231851),
            new Vector(-80.155228, -11206.607351),
            new Vector(-138.959256, -11244.72756),
        ],

        [
            new Vector(-59.455786, -11174.192564),
            new Vector(-6.180352, -11256.375115),
            new Vector(-24.388519, -11268.1786),
            new Vector(-33.059086, -11254.803304),
            new Vector(-26.715987, -11250.691356),
            new Vector(-62.650079, -11195.259592),
            new Vector(-69.027321, -11199.393693),
            new Vector(-77.698054, -11186.018268),
        ],

        [
            new Vector(-100.696008, -11537.048736),
            new Vector(-64.513164, -11513.592912),
            new Vector(-56.63636, -11525.743632),
            new Vector(-80.36483, -11541.387425),
            new Vector(-42.105736, -11600.460719),
            new Vector(-18.232757, -11584.984846),
            new Vector(-10.236526, -11597.319794),
            new Vector(-46.444495, -11620.791882),
        ],

        [
            new Vector(-45.712343, -11501.143465),
            new Vector(4.372396, -11468.704916),
            new Vector(90.173267, -11525.187616),
            new Vector(82.091323, -11537.467526),
            new Vector(4.373255, -11486.303939),
            new Vector(-37.716114, -11513.478427),
        ],

        [
            new Vector(-95.407191, -11892.488108),
            new Vector(-62.158509, -11943.582583),
            new Vector(-75.535765, -11952.287558),
            new Vector(-108.776118, -11901.168855),
        ],

        [
            new Vector(-133.732906, -12083.128653),
            new Vector(-120.140216, -12074.315097),
            new Vector(-98.215135, -12108.129012),
            new Vector(-111.807825, -12116.942568),
        ],

        [
            new Vector(-81.711499, -12049.39776),
            new Vector(-68.118808, -12040.584204),
            new Vector(-46.193727, -12074.398119),
            new Vector(-59.786418, -12083.211675),
        ],

        [
            new Vector(-33.046311, -12017.843053),
            new Vector(-19.45362, -12009.029497),
            new Vector(2.471461, -12042.843412),
            new Vector(-11.12123, -12051.656968),
        ],

        [
            new Vector(18.975097, -11984.11216),
            new Vector(32.567787, -11975.298604),
            new Vector(54.492868, -12009.112519),
            new Vector(40.900178, -12017.926075),
        ],

        [
            new Vector(-73.80009, -12175.577302),
            new Vector(-60.207304, -12166.763893),
            new Vector(-82.132019, -12132.949741),
            new Vector(-95.724805, -12141.76315),
        ],

        [
            new Vector(-21.778317, -12141.846972),
            new Vector(-8.185532, -12133.033563),
            new Vector(-30.110246, -12099.219411),
            new Vector(-43.703032, -12108.03282),
        ],

        [
            new Vector(26.887212, -12110.292792),
            new Vector(40.479997, -12101.479383),
            new Vector(18.555283, -12067.66523),
            new Vector(4.962497, -12076.478639),
        ],

        [
            new Vector(78.908984, -12076.562461),
            new Vector(92.50177, -12067.749053),
            new Vector(70.577055, -12033.9349),
            new Vector(56.984269, -12042.748309),
        ],

        [
            new Vector(-196.933417, -11777.919787),
            new Vector(-181.371005, -11767.739842),
            new Vector(-174.753337, -11777.856486),
            new Vector(-149.88146, -11761.58688),
            new Vector(-156.499128, -11751.470236),
            new Vector(-140.925954, -11741.283251),
            new Vector(-130.724889, -11756.87795),
            new Vector(-135.793974, -11760.193824),
            new Vector(-127.536968, -11772.816577),
            new Vector(-143.105625, -11783.000606),
            new Vector(-146.40642, -11777.954574),
            new Vector(-161.133883, -11787.588348),
            new Vector(-157.832089, -11792.635908),
            new Vector(-173.405263, -11802.822892),
            new Vector(-181.663268, -11790.198612),
            new Vector(-186.732352, -11793.514486),
        ],

        [
            new Vector(-35.566431, -11752.988698),
            new Vector(-22.940245, -11744.881877),
            new Vector(6.775698, -11791.163771),
            new Vector(-5.850498, -11799.270578),
        ],

        [
            new Vector(139.406914, -11812.941305),
            new Vector(112.632684, -11771.783065),
            new Vector(126.658815, -11762.652823),
            new Vector(152.659186, -11745.788429),
            new Vector(150.462956, -11742.414518),
            new Vector(166.971776, -11731.668181),
            new Vector(175.443098, -11744.68206),
            new Vector(166.127165, -11750.746221),
            new Vector(184.163626, -11778.454333),
            new Vector(185.710738, -11777.447248),
            new Vector(191.755629, -11786.733577),
            new Vector(189.795342, -11794.450795),
            new Vector(164.80824, -11810.716028),
            new Vector(154.671098, -11795.14307),
            new Vector(143.016697, -11802.729446),
            new Vector(146.611332, -11808.251624),
        ],

        [
            new Vector(273.264145, -11819.276603),
            new Vector(286.856836, -11810.463047),
            new Vector(308.781917, -11844.276962),
            new Vector(295.189226, -11853.090519),
        ],

        [
            new Vector(325.285553, -11785.54571),
            new Vector(338.878243, -11776.732154),
            new Vector(360.803324, -11810.546069),
            new Vector(347.210634, -11819.359625),
        ],

        [
            new Vector(353.512968, -11943.058319),
            new Vector(338.224575, -11919.479264),
            new Vector(351.817361, -11910.665856),
            new Vector(359.869117, -11923.083956),
            new Vector(398.298104, -11898.167034),
            new Vector(390.246348, -11885.748934),
            new Vector(403.839134, -11876.935525),
            new Vector(419.12659, -11900.513135),
        ],

        [
            new Vector(333.197668, -11911.726342),
            new Vector(346.790454, -11902.912933),
            new Vector(324.865739, -11869.098781),
            new Vector(311.272953, -11877.912189),
        ],

        [
            new Vector(385.21944, -11877.996012),
            new Vector(398.812226, -11869.182603),
            new Vector(376.887511, -11835.36845),
            new Vector(363.294726, -11844.181859),
        ],

        [
            new Vector(65.430357, -12276.376482),
            new Vector(92.860239, -12318.690081),
            new Vector(106.457156, -12309.87585),
            new Vector(79.02727, -12267.562252),
        ],

        [
            new Vector(121.66127, -12227.338601),
            new Vector(154.909952, -12278.433077),
            new Vector(141.532695, -12287.138052),
            new Vector(108.325982, -12235.997505),
        ],

        [
            new Vector(-59.751298, -12498.101518),
            new Vector(-57.189337, -12470.118563),
            new Vector(-41.027642, -12471.621651),
            new Vector(-43.618669, -12499.59576),
        ],

        [
            new Vector(-20.106005, -12485.557439),
            new Vector(14.003033, -12463.444157),
            new Vector(21.565284, -12475.109072),
            new Vector(-12.544086, -12497.221843),
        ],

        [
            new Vector(-56.326829, -12459.305758),
            new Vector(-53.733294, -12431.339439),
            new Vector(28.666101, -12377.721665),
            new Vector(43.951292, -12401.300743),
            new Vector(30.36558, -12410.128168),
            new Vector(22.310902, -12397.692665),
            new Vector(-38.257118, -12436.96906),
            new Vector(-40.455558, -12460.78439),
        ],

        [
            new Vector(35.411338, -12417.8396),
            new Vector(57.332805, -12451.655858),
            new Vector(70.926436, -12442.843755),
            new Vector(49.00497, -12409.027497),
        ],

        [
            new Vector(98.520159, -12412.121446),
            new Vector(71.745929, -12370.963206),
            new Vector(85.772061, -12361.832963),
            new Vector(111.772432, -12344.968569),
            new Vector(109.576201, -12341.594659),
            new Vector(126.085021, -12330.848322),
            new Vector(134.556343, -12343.8622),
            new Vector(125.24041, -12349.926362),
            new Vector(143.276871, -12377.634473),
            new Vector(144.823984, -12376.627388),
            new Vector(150.868875, -12385.913718),
            new Vector(148.908588, -12393.630936),
            new Vector(123.921486, -12409.896169),
            new Vector(113.784344, -12394.32321),
            new Vector(102.129942, -12401.909586),
            new Vector(105.724578, -12407.431765),
        ],

        [
            new Vector(316.004585, -12421.46539),
            new Vector(282.733789, -12385.355637),
            new Vector(295.038472, -12374.011543),
            new Vector(317.857867, -12353.042463),
            new Vector(315.129106, -12350.082638),
            new Vector(329.611773, -12336.730588),
            new Vector(340.137175, -12348.147253),
            new Vector(331.964601, -12355.681819),
            new Vector(354.374445, -12379.989272),
            new Vector(355.731678, -12378.737994),
            new Vector(363.242302, -12386.884598),
            new Vector(362.598128, -12394.820795),
            new Vector(340.677731, -12415.029934),
            new Vector(328.08259, -12401.368268),
            new Vector(317.858551, -12410.794147),
            new Vector(322.324794, -12415.638581),
        ],

        [
            new Vector(158.748531, -12562.337989),
            new Vector(131.045369, -12532.740246),
            new Vector(143.08451, -12521.471742),
            new Vector(170.787672, -12551.069485),
        ],

        [
            new Vector(203.79804, -12488.734181),
            new Vector(214.807123, -12478.539024),
            new Vector(221.721215, -12485.999966),
            new Vector(223.438766, -12484.408303),
            new Vector(246.924612, -12509.769133),
            new Vector(245.203957, -12511.362577),
            new Vector(252.177953, -12518.893355),
            new Vector(241.168867, -12529.088493),
            new Vector(237.055474, -12524.646709),
            new Vector(235.502212, -12526.085135),
            new Vector(226.708779, -12516.589681),
            new Vector(224.139803, -12518.97281),
            new Vector(217.334969, -12511.624715),
            new Vector(219.905981, -12509.243784),
            new Vector(206.329931, -12494.583896),
            new Vector(207.883193, -12493.145471),
        ],

        [
            new Vector(325.097569, -12120.02694),
            new Vector(338.691201, -12111.214837),
            new Vector(360.612667, -12145.031096),
            new Vector(347.019035, -12153.843199),
        ],

        [
            new Vector(477.577798, -12021.056089),
            new Vector(499.499264, -12054.872348),
            new Vector(513.092897, -12046.060245),
            new Vector(491.171431, -12012.243986),
        ],

        [
            new Vector(391.231746, -12124.501004),
            new Vector(437.517367, -12094.782682),
            new Vector(445.624169, -12107.408868),
            new Vector(399.342288, -12137.124802),
        ],

        [
            new Vector(371.707987, -12495.601485),
            new Vector(344.294726, -12465.735038),
            new Vector(332.147402, -12476.886837),
            new Vector(359.560663, -12506.753284),
        ],

        [
            new Vector(431.609898, -12439.959826),
            new Vector(403.906736, -12410.362083),
            new Vector(391.869994, -12421.628341),
            new Vector(419.573156, -12451.226084),
        ],

        [
            new Vector(269.635229, -12589.231172),
            new Vector(242.221968, -12559.364725),
            new Vector(230.074644, -12570.516523),
            new Vector(257.487904, -12600.382971),
        ],

        [
            new Vector(329.537139, -12533.589512),
            new Vector(301.833978, -12503.99177),
            new Vector(289.797236, -12515.258028),
            new Vector(317.500397, -12544.855771),
        ],

        [
            new Vector(433.382422, -12587.010084),
            new Vector(445.421451, -12575.74146),
            new Vector(473.124908, -12605.338926),
            new Vector(461.085879, -12616.60755),
        ],

        [
            new Vector(505.436432, -12520.221777),
            new Vector(532.852978, -12550.085209),
            new Vector(520.705765, -12561.23713),
            new Vector(493.28922, -12531.373698),
        ],

        [
            new Vector(503.480662, -12311.338504),
            new Vector(534.076622, -12344.336832),
            new Vector(544.096415, -12335.06719),
            new Vector(513.573859, -12302.000953),
        ],

        [
            new Vector(593.767788, -12389.640915),
            new Vector(629.623985, -12428.398793),
            new Vector(619.640895, -12437.63448),
            new Vector(583.344268, -12399.284058),
        ],

        [
            new Vector(675.352942, -12312.347993),
            new Vector(684.270007, -12321.985568),
            new Vector(648.444744, -12355.268754),
            new Vector(639.208485, -12345.286194),
        ],

        [
            new Vector(703.739653, -12372.223177),
            new Vector(714.730074, -12361.902502),
            new Vector(696.146971, -12341.782889),
            new Vector(685.063393, -12352.037853),
        ],

        [
            new Vector(664.528018, -12172.020317),
            new Vector(674.578618, -12182.884267),
            new Vector(696.30652, -12162.783066),
            new Vector(686.255919, -12151.919116),
        ],

        [
            new Vector(750.281435, -12176.673311),
            new Vector(783.863881, -12145.605078),
            new Vector(793.507025, -12156.028599),
            new Vector(759.887501, -12187.131133),
        ],

        [
            new Vector(1079.917422, -12326.703272),
            new Vector(1084.808563, -12310.955356),
            new Vector(1123.524177, -12322.980028),
            new Vector(1118.633036, -12338.727944),
        ],

        [
            new Vector(1109.514894, -12233.020573),
            new Vector(1104.47201, -12248.720555),
            new Vector(1143.069781, -12261.118281),
            new Vector(1148.112665, -12245.4183),
        ],

        [
            new Vector(1118.912553, -12366.802101),
            new Vector(1156.273244, -12379.236083),
            new Vector(1151.940395, -12392.2551),
            new Vector(1146.183182, -12390.339047),
            new Vector(1142.443358, -12401.576187),
            new Vector(1116.672901, -12392.999541),
            new Vector(1120.48362, -12381.54938),
            new Vector(1114.773778, -12379.237982),
        ],

        [
            new Vector(647.250992, -12875.668671),
            new Vector(678.647944, -12911.976122),
            new Vector(667.266873, -12921.771791),
            new Vector(644.980148, -12896.127708),
            new Vector(608.96013, -12927.276102),
            new Vector(599.024303, -12915.78631),
        ],

        [
            new Vector(684.480756, -12920.106416),
            new Vector(723.386816, -12965.097403),
            new Vector(702.018367, -12983.575819),
            new Vector(691.356752, -12971.246723),
            new Vector(702.098731, -12961.944352),
            new Vector(673.860826, -12929.290025),
        ],

        [
            new Vector(734.468344, -12961.289942),
            new Vector(766.434472, -12933.647379),
            new Vector(795.587916, -12967.360436),
            new Vector(783.93947, -12977.433456),
            new Vector(763.837019, -12954.186722),
            new Vector(743.444964, -12971.726386),
        ],

        [
            new Vector(800.865374, -12973.462299),
            new Vector(816.887925, -12991.990784),
            new Vector(787.380051, -13017.507769),
            new Vector(778.495425, -13007.233575),
            new Vector(796.410058, -12991.856454),
            new Vector(789.245932, -12983.510112),
        ],

        [
            new Vector(689.690371, -12994.271948),
            new Vector(676.758237, -12979.211048),
            new Vector(661.736195, -12992.109817),
            new Vector(674.668328, -13007.170717),
        ],

        [
            new Vector(-1443.83373, -13033.432898),
            new Vector(-1398.809651, -13098.164533),
            new Vector(-1419.013097, -13112.217037),
            new Vector(-1428.03503, -13099.246164),
            new Vector(-1419.280893, -13093.155643),
            new Vector(-1446.255746, -13054.36369),
            new Vector(-1496.800844, -13089.519329),
            new Vector(-1469.817742, -13128.305545),
            new Vector(-1461.06196, -13122.21739),
            new Vector(-1452.040401, -13135.188586),
            new Vector(-1472.244252, -13149.240508),
            new Vector(-1517.26661, -13084.507679),
        ],

        [
            new Vector(-1543.844579, -13002.40675),
            new Vector(-1494.579645, -12968.158155),
            new Vector(-1485.617929, -12981.049146),
            new Vector(-1534.882864, -13015.297741),
        ],

        [
            new Vector(-1537.487555, -12849.043302),
            new Vector(-1478.376567, -12855.923049),
            new Vector(-1479.988123, -12869.769583),
            new Vector(-1523.404809, -12864.716412),
            new Vector(-1526.924067, -12894.957454),
            new Vector(-1511.757934, -12896.670478),
            new Vector(-1514.4926, -12920.514169),
            new Vector(-1545.353193, -12916.974725),
        ],

        [
            new Vector(-1529.712673, -12784.690084),
            new Vector(-1514.316477, -12786.480934),
            new Vector(-1515.574432, -12797.289104),
            new Vector(-1472.018462, -12802.358621),
            new Vector(-1473.630072, -12816.205149),
            new Vector(-1532.880084, -12809.309076),
        ],

        [
            new Vector(-1522.738834, -12720.889389),
            new Vector(-1463.627849, -12727.769137),
            new Vector(-1465.2394, -12741.615628),
            new Vector(-1508.656088, -12736.5625),
            new Vector(-1509.873427, -12747.021933),
            new Vector(-1525.567723, -12745.195285),
        ],

        [
            new Vector(-1512.114837, -12629.609479),
            new Vector(-1473.038611, -12634.157442),
            new Vector(-1474.650167, -12648.003975),
            new Vector(-1498.032095, -12645.282624),
            new Vector(-1501.496779, -12675.49138),
            new Vector(-1486.383727, -12677.224716),
            new Vector(-1489.118392, -12701.068408),
            new Vector(-1519.978986, -12697.528964),
        ],

        [
            new Vector(-1453.947284, -12636.3139),
            new Vector(-1413.870028, -12640.91054),
            new Vector(-1415.458455, -12654.759746),
            new Vector(-1455.535712, -12650.163106),
        ],

        [
            new Vector(-110.963842, -11094.814489),
            new Vector(-123.459993, -11102.929584),
            new Vector(-101.837823, -11136.224806),
            new Vector(-121.295001, -11148.860444),
            new Vector(-113.724518, -11160.517965),
            new Vector(-81.77119, -11139.767231),
        ],

        [
            new Vector(958.827199, -12197.585159),
            new Vector(953.87782, -12191.950121),
            new Vector(951.398404, -12194.127848),
            new Vector(950.606503, -12193.226242),
            new Vector(932.724649, -12208.932269),
            new Vector(946.516917, -12224.635242),
            new Vector(967.779794, -12205.959587),
        ],

        [
            new Vector(967.779794, -12205.959587),
            new Vector(975.650854, -12214.921061),
            new Vector(995.83422, -12197.193564),
            new Vector(969.013676, -12188.638151),
            new Vector(958.827199, -12197.585159),
        ],

        [
            new Vector(-46.748802, -10861.702621),
            new Vector(-57.167328, -10839.005979),
            new Vector(-71.629204, -10845.7325),
            new Vector(-64.428313, -10861.419889),
            new Vector(-90.264056, -10907.377298),
            new Vector(-76.711776, -10914.996661),
        ],
    ]

    const layer = simulation.layer('houses')

    for (const coords of buildings) {
        const p = new Polygon({coords})
        layer.push(p)
    }
}

function splitObstacle(obstacle) {
    const result = []
    for (const line of obstacle.lines) {
        const o = new PathObstacle({
            lines: [line],
            fixNormals: false,
        })
        o.addTag(Tag.TYPE, obstacle.getTag(Tag.TYPE))

        result.push(o)
    }
    return result
}