import Simulation from '../swarm/Simulation'
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

export function createUnit4Simulation() {
    const s = new Simulation()
    s.setAgents(new AgentPool())
    s.setEnvironment(createEnvironment())
    initEmitters(s)

    return s
}

export function getUnit4CameraCenter() {
    return new Vector(-37.4301, -11163.837642)
    // return new Vector(212.466835, -11873.982292)
}

function createAgent(loc) {
    const radius = 500// + Math.random() * 100

    const a = new Agent({
        behaviour: ComposableBehavior.compose(
            new TtlBehavior({
                ttl: 1000,
            }),
            new SeekNearestAttractorBehaviour({
                accelerate: 0.5,
                thresholdDistSquared: 10,
            }),
            // new Unit4AgentBehaviour({
            //     radius,
            // }),
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
    const pheromones = new Pheromones({
        cellSize: 2,
        damp: 0.99,
    })

    const env = new Environment({
        pheromones,
    })

    initAttractors(env)
    initObstacles(env)

    return env
}

function createAttractor({x, y, power}) {
    const id = Id.get('attractor')
    return new Attractor({id, x, y, power})
}

function initAttractors(env) {
    const attractors = [
        [new Vector(-553.696162, -10939.202835), 100],
        [new Vector(-683.364822, -10971.070441), 100],
        [new Vector(55.046517, -10952.752156), 100],
        [new Vector(39.347953, -11013.959078), 100],
        [new Vector(-298.89799, -10544.399481), 100],
        [new Vector(-660.328081, -10389.397718), 100],
        [new Vector(-666.751895, -11407.386939), 100],
        [new Vector(-82.017101, -11612.490407), 100],
        [new Vector(357.187163, -11499.070763), 100],
        [new Vector(313.210797, -11378.017533), 100],
        [new Vector(-161.388614, -12859.922853), 100],
        [new Vector(201.958142, -12106.437177), 100],
        [new Vector(226.590261, -12060.018937), 100],
        [new Vector(526.203482, -11743.99815), 100],
        [new Vector(2151.490511, -12741.011999), 100],
        [new Vector(962.275553, -12727.659706), 100],
        [new Vector(-1956.747187, -11805.156208), 100],
        [new Vector(-1380.091221, -12473.187669), 100],
        [new Vector(-237.098569, -12723.529051), 100],
        [new Vector(-434.942828, -13336.644475), 100],
        [new Vector(-743.763619, -13557.421399), 100],
        [new Vector(-1249.249898, -13747.902649), 100],
        [new Vector(-2191.142785, -12821.556831), 100],
        [new Vector(-2438.300314, -12021.424138), 100],
        [new Vector(-2585.877463, -11125.236453), 100],
        [new Vector(-2323.050289, -10590.999095), 100],
        [new Vector(-2034.014543, -10182.379589), 100],
        [new Vector(-675.804336, -10384.219142), 100],
        [new Vector(-311.594923, -10531.244999), 100],
        [new Vector(25.461913, -10949.069798), 100],
        [new Vector(285.86815, -11376.843058), 100],
    ]

    attractors.forEach(([coord, power]) => {
        env.addAttractor(createAttractor({
            x: coord.x,
            y: coord.y,
            power,
        }))
    })
}

function initEmitters(simulation) {
    const emitters = [
        [new Vector(-520.526075, -11307.682458), 458, 1],
        [new Vector(-369.232336, -11331.165435), 435, 1],
        [new Vector(-362.982711, -11278.287604), 604, 1],
        [new Vector(-357.703188, -11234.00621), 621, 1],
        [new Vector(-353.661039, -11204.174484), 484, 1],
        [new Vector(-307.954516, -11184.686158), 158, 1],
        [new Vector(-241.849483, -11158.973057), 157, 1],
        [new Vector(-159.741238, -11120.57264), 264, 1],
        [new Vector(455.639278, -12883.083874), 874, 1],
        [new Vector(284.137224, -12125.005721), 721, 1],
        [new Vector(938.662626, -11827.953677), 677, 1],
        [new Vector(826.522583, -11909.259926), 926, 1],
        [new Vector(966.707184, -12255.101521), 521, 1],
        [new Vector(715.896524, -12988.398065), 165, 1],
        [new Vector(625.367508, -12955.050374), 374, 1],
        [new Vector(854.374344, -12232.300864), 864, 1],
        [new Vector(819.904017, -12286.541957), 957, 1],
        [new Vector(723.452399, -12179.234092), 192, 1],
        [new Vector(607.181607, -12455.571103), 103, 1],
        [new Vector(-155.487125, -11231.783331), 331, 1],
        [new Vector(-736.398971, -11100.299127), 127, 1],
        [new Vector(506.522622, -12287.825649), 649, 1],
        [new Vector(1169.138411, -12296.862044), 144, 1],
        [new Vector(1138.622595, -12292.042482), 482, 1],
        [new Vector(1027.644179, -12410.441256), 256, 1],
        [new Vector(976.154672, -12448.602841), 841, 1],
        [new Vector(738.013708, -12170.09325), 325, 1],
        [new Vector(548.75966, -12559.926524), 524, 1],
        [new Vector(369.922454, -12435.150637), 637, 1],
        [new Vector(260.089647, -12535.891561), 561, 1],
        [new Vector(106.298666, -12557.989932), 932, 1],
        [new Vector(589.672737, -11942.925754), 754, 1],
        [new Vector(374.319794, -12142.093037), 137, 1],
        [new Vector(40.343639, -12468.110769), 769, 1],
        [new Vector(183.197365, -12266.089641), 641, 1],
        [new Vector(72.06894, -12338.072274), 274, 1],
        [new Vector(81.560909, -11205.528463), 463, 1],
        [new Vector(-21.337158, -11311.960571), 100, 1],
        [new Vector(159.591144, -11323.594542), 542, 1],
        [new Vector(239.69268, -11440.871168), 168, 1],
        [new Vector(316.707394, -11562.30596), 596, 1],
        [new Vector(186.358763, -11676.040244), 244, 1],
        [new Vector(33.818765, -11574.371856), 856, 1],
        [new Vector(35.755873, -12050.554616), 616, 1],
        [new Vector(-64.911022, -12115.825958), 958, 1],
        [new Vector(17.973788, -12038.662378), 378, 1],
        [new Vector(-76.20528, -12099.816805), 805, 1],
        [new Vector(340.575749, -11852.954908), 908, 1],
        [new Vector(333.782295, -11834.004949), 949, 1],
        [new Vector(257.187362, -11862.217189), 189, 1],
        [new Vector(95.422437, -11886.000406), 406, 1],
        [new Vector(82.505902, -11856.593035), 135, 1],
        [new Vector(-38.983272, -11934.561418), 418, 1],
        [new Vector(-135.779452, -11925.730794), 794, 1],
        [new Vector(-415.643289, -10951.610083), 183, 1],
        [new Vector(-485.005922, -11014.470524), 524, 1],
        [new Vector(-52.825101, -11011.8583), 583, 1],
        [new Vector(-193.617171, -10899.656084), 184, 1],
        [new Vector(-360.137319, -10672.220649), 649, 1],
        [new Vector(-450.118927, -10811.739862), 862, 1],
        [new Vector(-601.828083, -10940.947335), 335, 1],
        [new Vector(572.48227, -12190.645414), 414, 1],
        [new Vector(627.048402, -12350.660331), 331, 1],
        [new Vector(341.070726, -12877.771571), 571, 1],
        [new Vector(-250.910766, -11329.248696), 696, 1],
        [new Vector(491.187311, -12066.16083), 183, 1],
        [new Vector(-678.930322, -10958.857974), 974, 1],
    ]
    emitters.forEach(([coord, period, amount]) => {
        simulation.addEmitter(createEmitter(coord, period, amount))
    })
}

function initObstacles(env) {
    const roads = [
        [
            new Vector(147.0, -11181.50345),
            new Vector(35.73154, -11253.170343),
        ],

        [
            new Vector(112.081733, -11371.709991),
            new Vector(225.0, -11298.980474),
        ],

        [
            new Vector(32.621801, -11422.889332),
            new Vector(89.996948, -11385.934578),
        ],

        [
            new Vector(13.646756, -11267.39493),
            new Vector(-91.0, -11334.796851),
        ],

        [
            new Vector(169.916539, -11485.759525),
            new Vector(108.151634, -11389.864677),
        ],

        [
            new Vector(29.401687, -11267.599222),
            new Vector(93.927047, -11367.779892),
        ],

        [
            new Vector(-37.4301, -11163.837642),
            new Vector(19.976609, -11252.966051),
        ],
    ]
    const buildings = [
        [
            new Vector(813.620555, -12406.739325),
            new Vector(845.115555, -12406.710984),
            new Vector(845.13624, -12431.686195),
            new Vector(813.641239, -12431.714535),
        ],

        [
            new Vector(-561.331198, -11290.907972),
            new Vector(-524.049205, -11294.984255),
            new Vector(-527.071873, -11320.428967),
            new Vector(-564.495934, -11316.727119),
        ],

        [
            new Vector(-390.184575, -12590.498532),
            new Vector(-329.414817, -12596.385249),
            new Vector(-332.686625, -12631.367997),
            new Vector(-393.694189, -12625.662184),
        ],

        [
            new Vector(-384.839428, -12535.319508),
            new Vector(-323.967292, -12541.216143),
            new Vector(-327.444866, -12576.179646),
            new Vector(-388.227157, -12570.291715),
        ],

        [
            new Vector(-235.584646, -12457.769525),
            new Vector(-172.186416, -12463.184105),
            new Vector(-182.093809, -12587.739479),
            new Vector(-246.151525, -12582.644196),
        ],

        [
            new Vector(-368.033165, -12369.982292),
            new Vector(-278.805951, -12379.141442),
            new Vector(-294.372372, -12530.787436),
            new Vector(-383.504584, -12521.698059),
        ],

        [
            new Vector(-427.098186, -12149.75693),
            new Vector(-396.755649, -12156.788122),
            new Vector(-407.234846, -12202.010243),
            new Vector(-437.577383, -12194.979051),
        ],

        [
            new Vector(-369.543946, -12142.249827),
            new Vector(-149.177889, -12192.759946),
            new Vector(-167.272731, -12271.704302),
            new Vector(-242.704576, -12309.480186),
            new Vector(-399.476006, -12273.546596),
        ],

        [
            new Vector(1124.985026, -11719.877765),
            new Vector(1141.848258, -11708.104354),
            new Vector(1113.139879, -11666.984916),
            new Vector(1096.276646, -11678.758328),
        ],

        [
            new Vector(1105.890094, -11791.837121),
            new Vector(1090.364208, -11769.625483),
            new Vector(1074.217741, -11780.911827),
            new Vector(1089.743626, -11803.123466),
        ],

        [
            new Vector(1078.210994, -11742.005812),
            new Vector(1062.685109, -11719.794173),
            new Vector(1046.538641, -11731.080518),
            new Vector(1062.064527, -11753.292157),
        ],

        [
            new Vector(747.69891, -12820.761893),
            new Vector(749.35713, -12848.58856),
            new Vector(693.350375, -12851.660109),
            new Vector(690.912286, -12823.720681),
        ],

        [
            new Vector(765.699235, -12819.700202),
            new Vector(828.665792, -12813.69824),
            new Vector(828.648259, -12843.148715),
            new Vector(767.244052, -12848.507054),
        ],

        [
            new Vector(858.8208, -12810.315254),
            new Vector(883.8208, -12807.496023),
            new Vector(883.8208, -12851.996385),
            new Vector(858.8208, -12855.175494),
        ],

        [
            new Vector(906.818224, -12804.350101),
            new Vector(1031.220257, -12783.620963),
            new Vector(1031.220257, -12794.337003),
            new Vector(1004.139383, -12817.179908),
            new Vector(906.818224, -12832.251736),
        ],

        [
            new Vector(587.576478, -12666.603572),
            new Vector(615.703738, -12640.610204),
            new Vector(640.237171, -12667.157678),
            new Vector(632.861377, -12674.527967),
            new Vector(593.909631, -12673.022649),
        ],

        [
            new Vector(1445.602011, -12343.396633),
            new Vector(1505.715441, -12362.211742),
            new Vector(1499.543393, -12381.93116),
            new Vector(1432.558645, -12385.069602),
        ],

        [
            new Vector(1295.04282, -12296.272594),
            new Vector(1430.218281, -12338.581626),
            new Vector(1417.651667, -12378.731393),
            new Vector(1281.90553, -12385.091517),
            new Vector(1279.080628, -12342.730594),
        ],

        [
            new Vector(765.022736, -12656.137577),
            new Vector(829.313337, -12649.854368),
            new Vector(828.745608, -12679.625503),
            new Vector(767.174029, -12682.065088),
        ],

        [
            new Vector(883.8208, -12649.548027),
            new Vector(883.8208, -12677.260403),
            new Vector(858.8208, -12679.016288),
            new Vector(858.8208, -12651.299461),
        ],

        [
            new Vector(988.264478, -12666.328544),
            new Vector(984.126789, -12639.454455),
            new Vector(1057.815956, -12626.227466),
            new Vector(1074.666907, -12649.673095),
        ],

        [
            new Vector(909.653545, -12647.121434),
            new Vector(966.424222, -12641.789603),
            new Vector(970.20254, -12668.965202),
            new Vector(906.298406, -12675.999101),
        ],

        [
            new Vector(1246.183052, -12353.970988),
            new Vector(1263.311904, -12359.502932),
            new Vector(1246.737201, -12410.824068),
            new Vector(1229.608348, -12405.292124),
        ],

        [
            new Vector(986.02661, -12561.990905),
            new Vector(1010.314351, -12532.765819),
            new Vector(1041.077599, -12558.331862),
            new Vector(1016.789859, -12587.556948),
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
            new Vector(657.83117, -11965.841588),
            new Vector(674.740698, -11954.89501),
            new Vector(691.573369, -11980.896972),
            new Vector(674.663841, -11991.84355),
        ],

        [
            new Vector(186.512706, -12620.311178),
            new Vector(213.5441, -12595.27214),
            new Vector(240.71446, -12624.63735),
            new Vector(232.108098, -12632.600445),
            new Vector(194.376592, -12628.844408),
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
            new Vector(-28.874272, -12339.373014),
            new Vector(-20.857656, -12334.174157),
            new Vector(-3.716573, -12360.516796),
            new Vector(-35.587815, -12381.185618),
            new Vector(-41.79345, -12371.616553),
        ],

        [
            new Vector(-158.874859, -12334.17549),
            new Vector(-106.435513, -12225.697088),
            new Vector(-83.238291, -12254.247507),
            new Vector(-125.60704, -12341.893417),
        ],

        [
            new Vector(-221.388606, -12069.733725),
            new Vector(-199.78142, -12074.26412),
            new Vector(-202.647225, -12087.646934),
            new Vector(-190.488591, -12090.252788),
            new Vector(-178.847146, -12107.97098),
            new Vector(-181.338711, -12119.290625),
            new Vector(-229.867909, -12108.608873),
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
            new Vector(390.972939, -11649.469593),
            new Vector(407.350666, -11638.812123),
            new Vector(416.064727, -11652.203344),
            new Vector(399.687001, -11662.860813),
        ],

        [
            new Vector(361.807348, -11750.745938),
            new Vector(378.185075, -11740.088468),
            new Vector(386.899137, -11753.479688),
            new Vector(370.52141, -11764.137158),
        ],

        [
            new Vector(137.346128, -12053.388362),
            new Vector(172.107383, -12030.970132),
            new Vector(184.064593, -12049.510741),
            new Vector(156.539791, -12067.262036),
            new Vector(144.636404, -12064.692517),
        ],

        [
            new Vector(-375.191802, -11339.049814),
            new Vector(-402.083428, -11335.861265),
            new Vector(-399.793337, -11316.547069),
            new Vector(-372.901711, -11319.735618),
        ],

        [
            new Vector(-368.821768, -11285.326144),
            new Vector(-395.713395, -11282.137595),
            new Vector(-393.423304, -11262.823399),
            new Vector(-366.531678, -11266.011948),
        ],

        [
            new Vector(-363.864682, -11243.519),
            new Vector(-390.756308, -11240.330451),
            new Vector(-388.466217, -11221.016255),
            new Vector(-361.574591, -11224.204804),
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
            new Vector(-138.488611, -10737.087091),
            new Vector(-119.061789, -10720.145831),
            new Vector(-102.352074, -10747.439544),
            new Vector(-85.642359, -10774.733256),
            new Vector(-102.521994, -10789.229962),
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
            new Vector(-308.161895, -10750.906287),
            new Vector(-220.228513, -10855.701063),
            new Vector(-247.423123, -10878.520082),
            new Vector(-335.356504, -10773.725306),
        ],

        [
            new Vector(-341.724573, -11193.555651),
            new Vector(-366.551833, -11204.369232),
            new Vector(-374.318401, -11186.537711),
            new Vector(-349.49114, -11175.72413),
        ],

        [
            new Vector(-293.834734, -11173.917504),
            new Vector(-319.038847, -11183.820994),
            new Vector(-326.151765, -11165.718809),
            new Vector(-300.947652, -11155.81532),
        ],

        [
            new Vector(-228.145656, -11148.333566),
            new Vector(-253.349769, -11158.237055),
            new Vector(-260.462687, -11140.134871),
            new Vector(-235.258574, -11130.231381),
        ],

        [
            new Vector(-460.995104, -11054.988374),
            new Vector(-471.911444, -11042.139518),
            new Vector(-408.478788, -10988.247372),
            new Vector(-397.562448, -11001.096229),
        ],

        [
            new Vector(-538.207335, -11120.592234),
            new Vector(-549.123675, -11107.743377),
            new Vector(-485.691019, -11053.851231),
            new Vector(-474.774679, -11066.700088),
        ],

        [
            new Vector(-81.77119, -11139.767231),
            new Vector(-163.655169, -11192.823091),
            new Vector(-192.801339, -11147.84023),
            new Vector(-110.917359, -11094.784371),
        ],

        [
            new Vector(436.308446, -12824.138622),
            new Vector(525.408332, -12833.400581),
            new Vector(517.96572, -12904.998377),
            new Vector(500.853125, -12910.455317),
            new Vector(432.576101, -12860.045264),
        ],

        [
            new Vector(257.319915, -12092.672962),
            new Vector(311.517804, -12176.29421),
            new Vector(286.449537, -12192.990496),
            new Vector(217.543162, -12118.472873),
        ],

        [
            new Vector(919.630648, -11792.251387),
            new Vector(1000.533448, -11736.027318),
            new Vector(1063.353895, -11826.150782),
            new Vector(982.571, -11882.460397),
        ],

        [
            new Vector(792.49633, -11851.77751),
            new Vector(869.115462, -11961.544389),
            new Vector(949.937709, -11905.204614),
            new Vector(873.39943, -11795.553232),
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
            new Vector(-1512.114837, -12629.609479),
            new Vector(-1355.361313, -12647.851449),
            new Vector(-1362.783319, -12711.628864),
            new Vector(-1488.673611, -12697.190332),
            new Vector(-1489.118392, -12701.068408),
            new Vector(-1519.978986, -12697.528964),
        ],

        [
            new Vector(-1522.738834, -12720.889389),
            new Vector(-1365.775999, -12739.155506),
            new Vector(-1376.058538, -12827.514544),
            new Vector(-1532.880084, -12809.309076),
        ],

        [
            new Vector(-1313.833256, -13040.451395),
            new Vector(-1280.263681, -13017.103512),
            new Vector(-1303.817108, -12983.238405),
            new Vector(-1338.675515, -13007.482679),
            new Vector(-1316.370481, -13039.552846),
        ],

        [
            new Vector(-1517.26661, -13084.507679),
            new Vector(-1443.834408, -13033.431922),
            new Vector(-1398.809651, -13098.164533),
            new Vector(-1472.244929, -13149.239535),
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
            new Vector(-1324.153497, -12873.523359),
            new Vector(-1210.609054, -12886.739011),
            new Vector(-1220.93614, -12975.061896),
            new Vector(-1334.443374, -12961.926518),
        ],

        [
            new Vector(-1309.228811, -12745.286015),
            new Vector(-1195.672932, -12758.400358),
            new Vector(-1205.968451, -12846.855942),
            new Vector(-1319.511644, -12833.640427),
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
            new Vector(1093.211999, -12346.275692),
            new Vector(1083.94881, -12374.957799),
            new Vector(1133.82, -12413.36),
            new Vector(1187.23631, -12430.670452),
            new Vector(1203.037321, -12381.74494),
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
            new Vector(220.605828, -12556.511473),
            new Vector(175.224494, -12506.461044),
            new Vector(233.110504, -12453.890588),
            new Vector(278.602642, -12502.834355),
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
            new Vector(766.434472, -12933.647379),
            new Vector(816.887925, -12991.990784),
            new Vector(727.926549, -13068.920221),
            new Vector(685.839726, -13020.250924),
            new Vector(742.80881, -12970.986778),
            new Vector(734.468344, -12961.289942),
        ],

        [
            new Vector(647.250992, -12875.668671),
            new Vector(723.386816, -12965.097403),
            new Vector(674.668328, -13007.170717),
            new Vector(599.024303, -12915.78631),
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
            new Vector(758.305209, -12353.489309),
            new Vector(821.943576, -12294.615349),
            new Vector(763.100026, -12231.009853),
            new Vector(711.209783, -12278.90257),
            new Vector(729.010843, -12299.904526),
            new Vector(717.989698, -12309.926921),
        ],

        [
            new Vector(689.08009, -12149.306382),
            new Vector(644.394803, -12190.64622),
            new Vector(653.906248, -12205.823712),
            new Vector(693.46351, -12248.582167),
            new Vector(740.589567, -12204.984292),
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
            new Vector(-182.114627, -11315.279094),
            new Vector(-168.2837, -11245.19477),
            new Vector(-59.455786, -11174.192564),
            new Vector(-6.18064, -11256.375301),
            new Vector(-118.113787, -11328.936599),
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
            new Vector(-664.447474, -11045.288731),
            new Vector(-626.098077, -11047.557929),
        ],

        [
            new Vector(425.100546, -12332.491695),
            new Vector(488.205946, -12273.770225),
            new Vector(570.312086, -12362.513619),
            new Vector(506.900242, -12420.837449),
        ],

        [
            new Vector(1156.586777, -12351.866492),
            new Vector(1186.808363, -12257.761686),
            new Vector(1232.873655, -12272.72743),
            new Vector(1202.930759, -12366.595675),
        ],

        [
            new Vector(1073.88115, -12221.977486),
            new Vector(1148.112665, -12245.4183),
            new Vector(1118.633036, -12338.727944),
            new Vector(1044.40647, -12315.279253),
        ],

        [
            new Vector(966.882453, -12408.879153),
            new Vector(1012.994286, -12351.886902),
            new Vector(1046.593565, -12379.071727),
            new Vector(1000.482377, -12436.063956),
        ],

        [
            new Vector(867.286684, -12531.89829),
            new Vector(948.074137, -12432.206444),
            new Vector(1014.709771, -12486.20575),
            new Vector(934.006489, -12585.842164),
        ],

        [
            new Vector(820.960571, -12130.630415),
            new Vector(753.594383, -12057.812582),
            new Vector(692.564408, -12114.273432),
            new Vector(759.887501, -12187.131133),
        ],

        [
            new Vector(407.667397, -12559.982868),
            new Vector(508.891095, -12670.3842),
            new Vector(582.116418, -12602.504632),
            new Vector(479.926186, -12493.001549),
        ],

        [
            new Vector(332.147402, -12476.886837),
            new Vector(403.912398, -12410.371563),
            new Vector(456.821687, -12467.45672),
            new Vector(384.567362, -12534.437133),
        ],

        [
            new Vector(230.074644, -12570.516523),
            new Vector(301.833978, -12503.99177),
            new Vector(354.748928, -12561.086406),
            new Vector(282.2105, -12627.757715),
        ],

        [
            new Vector(111.346767, -12551.177921),
            new Vector(108.164246, -12612.253722),
            new Vector(157.451789, -12614.718659),
            new Vector(195.999461, -12578.566379),
            new Vector(143.08451, -12521.471742),
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
            new Vector(404.421441, -12098.682883),
            new Vector(374.458747, -12118.06249),
            new Vector(382.685227, -12130.789748),
            new Vector(347.019035, -12153.843199),
            new Vector(292.604209, -12069.939572),
            new Vector(358.217229, -12027.407833),
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
            new Vector(87.095687, -12203.162987),
            new Vector(165.675485, -12152.250305),
            new Vector(234.69036, -12226.811266),
            new Vector(141.532695, -12287.138052),
        ],

        [
            new Vector(-1.16466, -12287.390238),
            new Vector(40.942837, -12352.345656),
            new Vector(106.457156, -12309.87585),
            new Vector(53.326505, -12227.916012),
        ],

        [
            new Vector(-20.082967, -11148.670933),
            new Vector(70.327424, -11090.062192),
            new Vector(123.635208, -11172.295276),
            new Vector(33.224817, -11230.904018),
        ],

        [
            new Vector(-49.771566, -11344.023342),
            new Vector(33.908837, -11399.331176),
            new Vector(70.881727, -11375.250725),
            new Vector(17.377941, -11292.716075),
            new Vector(-41.057292, -11330.597208),
        ],

        [
            new Vector(55.927566, -11265.927721),
            new Vector(146.360693, -11207.306433),
            new Vector(200.634291, -11291.032521),
            new Vector(110.203593, -11349.654427),
        ],

        [
            new Vector(134.135219, -11386.577378),
            new Vector(224.567346, -11327.954547),
            new Vector(277.87529, -11410.187528),
            new Vector(187.443003, -11468.810463),
        ],

        [
            new Vector(211.374747, -11505.731847),
            new Vector(301.807239, -11447.109579),
            new Vector(356.081472, -11530.836647),
            new Vector(265.650774, -11589.458552),
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
            new Vector(-100.696008, -11537.048736),
            new Vector(4.372396, -11468.704916),
            new Vector(90.173267, -11525.187616),
            new Vector(82.089787, -11537.466514),
            new Vector(-46.444495, -11620.791882),
        ],

        [
            new Vector(4.962497, -12076.478639),
            new Vector(70.577055, -12033.9349),
            new Vector(112.816134, -12099.079584),
            new Vector(47.202512, -12141.624768),
        ],

        [
            new Vector(-95.724805, -12141.76315),
            new Vector(-30.110246, -12099.219411),
            new Vector(12.130266, -12164.363165),
            new Vector(-53.485726, -12206.907834),
        ],

        [
            new Vector(-53.36195, -11986.511296),
            new Vector(12.253084, -11943.968291),
            new Vector(54.492868, -12009.112519),
            new Vector(-11.12123, -12051.656968),
        ],

        [
            new Vector(-154.048545, -12051.796896),
            new Vector(-88.433511, -12009.253892),
            new Vector(-46.193727, -12074.398119),
            new Vector(-111.807825, -12116.942568),
        ],

        [
            new Vector(311.28025, -11877.907458),
            new Vector(376.887511, -11835.36845),
            new Vector(419.12659, -11900.513135),
            new Vector(353.512031, -11943.056874),
        ],

        [
            new Vector(252.948506, -11787.944847),
            new Vector(318.562604, -11745.400397),
            new Vector(360.803324, -11810.546069),
            new Vector(295.189226, -11853.090518),
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
            new Vector(118.250918, -11876.779451),
            new Vector(55.288321, -11917.44808),
            new Vector(86.130577, -11964.978939),
            new Vector(149.108283, -11924.552388),
        ],

        [
            new Vector(96.104544, -11842.559551),
            new Vector(33.2079, -11883.330106),
            new Vector(1.835107, -11834.713233),
            new Vector(64.517118, -11793.829703),
        ],

        [
            new Vector(-140.948045, -11851.258865),
            new Vector(-75.535765, -11952.287558),
            new Vector(-10.0097, -11909.832536),
            new Vector(-75.412547, -11808.909272),
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
            new Vector(104.176535, -12449.890548),
            new Vector(174.398641, -12388.579643),
            new Vector(182.498739, -12368.544672),
            new Vector(255.302688, -12296.608723),
            new Vector(225.452192, -12250.254737),
            new Vector(48.592807, -12364.14657),
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
            new Vector(-549.933306, -11063.126578),
            new Vector(-436.560538, -10966.814765),
            new Vector(-493.002869, -10900.380051),
            new Vector(-606.375609, -10996.691897),
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
            new Vector(-32.914265, -10962.771866),
            new Vector(-60.012996, -11052.280535),
            new Vector(-76.24142, -11061.986711),
            new Vector(-41.768102, -11115.070966),
            new Vector(50.05718, -11054.301892),
            new Vector(-3.174886, -10947.901258),
        ],

        [
            new Vector(-233.885416, -10939.391305),
            new Vector(-74.084988, -10802.151047),
            new Vector(-46.748802, -10861.702621),
            new Vector(-129.359066, -11008.653569),
            new Vector(-215.528613, -10960.21231),
        ],

        [
            new Vector(-285.288165, -10645.102817),
            new Vector(-364.877909, -10555.380648),
            new Vector(-417.285781, -10601.87004),
            new Vector(-337.696036, -10691.592209),
        ],

        [
            new Vector(-363.350182, -10732.929932),
            new Vector(-450.61581, -10630.205921),
            new Vector(-612.934522, -10764.528752),
            new Vector(-525.146756, -10867.883422),
        ],

        [
            new Vector(-621.477252, -10951.510481),
            new Vector(-716.044242, -10842.393997),
            new Vector(-639.077862, -10777.009855),
            new Vector(-540.994854, -10883.138796),
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
            new Vector(366.981268, -12896.494625),
            new Vector(384.106899, -12891.078909),
            new Vector(391.516342, -12819.477078),
            new Vector(321.547528, -12812.204112),
            new Vector(317.815182, -12848.110754),
            new Vector(366.994304, -12896.535849),
        ],

        [
            new Vector(-1417.930505, -13015.418329),
            new Vector(-1372.907973, -13080.151408),
            new Vector(-1336.190334, -13054.613907),
            new Vector(-1381.213893, -12989.881186),
        ],

        [
            new Vector(-320.999015, -11324.987191),
            new Vector(-329.048297, -11392.958259),
            new Vector(-248.035783, -11402.563939),
            new Vector(-239.970334, -11334.54145),
            new Vector(-320.992778, -11324.934592),
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
            new Vector(-659.306802, -10936.904201),
            new Vector(-749.648134, -11012.549343),
            new Vector(-753.934083, -11007.36259),
            new Vector(-759.415511, -11011.892037),
            new Vector(-817.114635, -10943.131823),
            new Vector(-721.445924, -10862.852829),
            new Vector(-659.387292, -10936.808282),
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

        return obstacle
    })

    obstacles.forEach(obstacle => {
        env.addObstacle(obstacle)
    })

    // roads.forEach(cs => {
    //     const obstacle = PathObstacle.fromCoords(cs)
    //     obstacle.addTag(Tag.TYPE, ObstacleType.ROAD)
    //
    //     env.addObstacle(obstacle)
    // })
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