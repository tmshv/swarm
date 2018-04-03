import Simulation from '../swarm/Simulation'
import AgentPool from '../swarm/AgentPool'
import Agent from '../swarm/Agent'
import Environment from '../swarm/Environment'

import Vector from '../swarm/Vector'
import SeekNearestAttractorBehaviour from '../swarm/behaviours/SeekNearestAttractorBehaviour'
import SpreadPheromonesBehaviour from '../swarm/behaviours/SpreadPheromonesBehaviour'
import Pheromones from '../swarm/Pheromones'
import Obstacle from '../swarm/Obstacle'
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

const pheromones = new Pheromones({
    cellSize: 2,
    increaseValue: 1,
    decreaseValue: .05,
})

export function createUnit4Simulation({createView}) {
    const s = new Simulation()
    s.setAgents(new AgentPool())
    s.setEnvironment(createEnvironment())
    s.setViewFactory(createView)
    initEmitters(s)

    return s
}

function createAgent(loc) {
    const a = new Agent({
        behaviour: ComposableBehavior.compose(
            new TtlBehavior({
                ttl: 800,
            }),
            new SpreadPheromonesBehaviour({
                pheromones,
            }),
            new SeekNearestAttractorBehaviour({
                accelerate: 0.05,
                thresholdDistQuad: 10,
            }),
            new InteractPheromonesBehaviour({
                accelerate: .05,
            }),
            new AvoidObstaclesBehavior({
                accelerate: 1,
                predictionDistance: 15,
                radius: 100,
            }),
            new LimitAccelerationBehaviour({
                limit: 0.125,
            })
        )
    })
    a.damp = 0.85
    a.location.set(loc.x, loc.y)
    a.addBehaviour(AgentBehaviour.SEEK_LOCATION, new SeekLocationBehaviour({
        threshold: 5,
    }))

    return a
}

function createEmitter(coord) {
    return new Emitter({
        x: coord.x,
        y: coord.y,
        period: 500,
        amount: 1,
        factory: createAgent,
    })
}

function createEnvironment() {
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
        new Vector(546.003183, 431.540435),
        new Vector(823.665344, 71.17033),
        new Vector(267.052991, 434.639438),
        new Vector(460.718058, 712.557743),
        new Vector(170.721102, 81.973802),
    ]

    attractors.forEach(coord => {
        env.addAttractor(createAttractor({
            x: coord.x,
            y: coord.y,
            power: 100,
        }))
    })
}

function initEmitters(simulation) {
    const emitters = [
        new Vector(228.276186, 523.511176),
        new Vector(293.892506, 549.293894),
        new Vector(180.349984, 504.000606),
        new Vector(172.799927, 470.76015),
        new Vector(167.84284, 428.953006),
        new Vector(161.472807, 375.229337),
        new Vector(221.16163, 330.842224),
        new Vector(275.282517, 324.425092),
        new Vector(224.223014, 356.661362),
        new Vector(435.857959, 442.537366),
        new Vector(587.815991, 540.11826),
        new Vector(656.346084, 426.149735),
        new Vector(545.798775, 359.041865),
        new Vector(734.715136, 307.386057),
        new Vector(819.563044, 180.563418),
        new Vector(674.727451, 95.551492),
        new Vector(542.51828, 193.071153),
        new Vector(496.746888, 127.167202),
        new Vector(393.716054, 739.377513),
        new Vector(417.889336, 569.351318),
        new Vector(501.102287, 631.104868),
    ]
    emitters.forEach(x => {
        simulation.addEmitter(createEmitter(x))
    })
}

function initObstacles(env) {
    const os = [
        [
            new Vector(757.597042, 68.403689),
            new Vector(768.693856, 51.285841),
            new Vector(780.000392, 58.615256),
            new Vector(760.272686, 89.047702),
            new Vector(697.170983, 130.593154),
            new Vector(680.182814, 141.733495),
            new Vector(666.882103, 150.48785),
            new Vector(649.187597, 139.046499),
            new Vector(612.240505, 115.095233),
            new Vector(656.082979, 47.462545),
            new Vector(668.41793, 55.458798),
            new Vector(632.571129, 110.755644),
            new Vector(662.596911, 130.22069),
            new Vector(666.882963, 132.888827),
            new Vector(672.100903, 129.454446),
            new Vector(689.087318, 118.315311),
            new Vector(740.203095, 84.660961),
            new Vector(752.189021, 76.769859),
        ],

        [
            new Vector(467.345414, 141.414907),
            new Vector(492.095628, 103.235359),
            new Vector(515.968607, 118.711232),
            new Vector(523.964838, 106.376284),
            new Vector(487.756869, 82.904196),
            new Vector(455.010454, 133.418668),
        ],

        [
            new Vector(509.872486, 745.225437),
            new Vector(531.024318, 755.807715),
            new Vector(549.160766, 719.550842),
            new Vector(534.457683, 712.196051),
            new Vector(521.728048, 737.65375),
            new Vector(515.279299, 734.426263),
        ],

        [
            new Vector(445.375404, 510.464152),
            new Vector(386.571386, 472.344056),
            new Vector(395.24206, 458.968593),
            new Vector(454.046136, 497.088727),
        ],

        [
            new Vector(485.219569, 513.346362),
            new Vector(474.745578, 529.503514),
            new Vector(456.50331, 517.67781),
            new Vector(465.174043, 504.302385),
            new Vector(471.551284, 508.436486),
            new Vector(507.485386, 453.004708),
            new Vector(501.142278, 448.892774),
            new Vector(509.812845, 435.517477),
            new Vector(528.021012, 447.320963),
        ],

        [
            new Vector(575.324706, 490.830699),
            new Vector(535.185411, 551.830759),
            new Vector(554.845831, 564.575671),
            new Vector(547.15428, 576.440731),
            new Vector(514.118397, 555.025144),
            new Vector(567.426181, 472.79206),
            new Vector(583.738539, 483.366584),
            new Vector(577.842046, 492.46257),
        ],

        [
            new Vector(657.858467, 531.414995),
            new Vector(604.550524, 613.647976),
            new Vector(554.732378, 581.35325),
            new Vector(562.42393, 569.488191),
            new Vector(598.871343, 593.104945),
            new Vector(638.166954, 531.568329),
            new Vector(635.649615, 529.936458),
            new Vector(641.546108, 520.840472),
        ],

        [
            new Vector(527.365762, 629.021431),
            new Vector(567.760154, 655.253855),
            new Vector(565.614692, 659.464593),
            new Vector(563.832676, 658.556617),
            new Vector(558.943227, 668.152772),
            new Vector(571.390585, 674.494971),
            new Vector(584.258544, 649.394186),
            new Vector(535.480885, 616.525237),
        ],

        [
            new Vector(491.887698, 589.465207),
            new Vector(462.695045, 634.41795),
            new Vector(472.842941, 641.00807),
            new Vector(494.46511, 607.712848),
            new Vector(516.270543, 621.873462),
            new Vector(523.841026, 610.215941),
        ],

        [
            new Vector(819.754982, 246.050053),
            new Vector(802.97272, 235.170913),
            new Vector(810.664272, 223.305854),
            new Vector(829.905135, 235.778787),
            new Vector(869.217616, 176.054179),
            new Vector(849.557196, 163.309267),
            new Vector(857.248747, 151.444207),
            new Vector(890.28463, 172.859793),
            new Vector(836.008603, 256.586499),
        ],

        [
            new Vector(805.536434, 134.772665),
            new Vector(766.643493, 194.769279),
            new Vector(803.084924, 218.392516),
            new Vector(795.393372, 230.257575),
            new Vector(745.576476, 197.963668),
            new Vector(799.852523, 114.236932),
            new Vector(832.888406, 135.652518),
            new Vector(825.196854, 147.517577),
        ],

        [
            new Vector(538.573759, 234.991162),
            new Vector(488.48902, 202.552613),
            new Vector(496.48525, 190.217651),
            new Vector(538.574619, 217.392139),
            new Vector(616.292687, 166.228552),
            new Vector(624.374631, 178.508462),
        ],

        [
            new Vector(365.917664, 458.501308),
            new Vector(352.086737, 388.416984),
            new Vector(416.087577, 374.759479),
            new Vector(498.650564, 428.281423),
            new Vector(489.97989, 441.656886),
            new Vector(412.956952, 391.726436),
            new Vector(369.242038, 401.055012),
            new Vector(379.230499, 447.862233),
            new Vector(385.140967, 451.689496),
            new Vector(376.343595, 465.260094),
        ],

        [
            new Vector(163.532431, 565.963551),
            new Vector(157.071011, 586.97206),
            new Vector(179.151413, 593.778817),
            new Vector(181.614108, 585.790093),
            new Vector(203.736788, 592.609882),
            new Vector(196.736867, 614.739819),
            new Vector(152.897684, 600.461553),
            new Vector(143.187958, 631.958882),
            new Vector(308.052094, 682.781781),
            new Vector(317.76182, 651.284452),
            new Vector(270.873406, 637.562601),
            new Vector(277.539578, 615.361172),
            new Vector(302.290222, 622.991088),
            new Vector(299.830384, 630.970542),
            new Vector(321.924395, 637.781494),
            new Vector(328.396567, 616.78645),
        ],

        [
            new Vector(404.842298, 695.042509),
            new Vector(344.738491, 728.830596),
            new Vector(354.416732, 746.046697),
            new Vector(365.771389, 739.663538),
            new Vector(363.921504, 736.372862),
            new Vector(401.303739, 715.329304),
            new Vector(431.518574, 771.166773),
            new Vector(443.765978, 764.281746),
        ],

        [
            new Vector(360.432696, 526.446409),
            new Vector(370.601107, 510.788429),
            new Vector(410.106285, 536.56361),
            new Vector(402.590715, 548.136573),
            new Vector(373.715287, 529.384651),
            new Vector(371.117359, 533.38511),
        ],

        [
            new Vector(420.476846, 543.178113),
            new Vector(452.430174, 563.928847),
            new Vector(423.237542, 608.881602),
            new Vector(410.741371, 600.766494),
            new Vector(429.095686, 572.503283),
            new Vector(431.443962, 574.028271),
            new Vector(434.711796, 568.996247),
            new Vector(412.906363, 554.835634),
        ],

        [
            new Vector(655.216725, 463.110543),
            new Vector(674.457589, 475.583477),
            new Vector(713.770069, 415.858868),
            new Vector(694.109649, 403.113956),
            new Vector(701.801201, 391.248897),
            new Vector(734.837084, 412.664483),
            new Vector(680.561057, 496.391189),
            new Vector(647.525174, 474.975602),
        ],

        [
            new Vector(650.088888, 374.577355),
            new Vector(611.195946, 434.573969),
            new Vector(647.637378, 458.197205),
            new Vector(639.945826, 470.062264),
            new Vector(590.12893, 437.768357),
            new Vector(644.404976, 354.041621),
            new Vector(677.44086, 375.457208),
            new Vector(669.749308, 387.322267),
        ],

        [
            new Vector(568.401845, 323.550209),
            new Vector(493.144072, 373.09887),
            new Vector(484.429798, 359.672736),
            new Vector(523.925562, 333.587341),
            new Vector(553.193752, 314.223799),
            new Vector(568.110201, 304.364902),
            new Vector(605.094504, 328.427592),
            new Vector(551.579305, 410.980003),
            new Vector(533.337037, 399.154299),
            new Vector(541.981265, 385.81976),
            new Vector(548.358506, 389.953861),
            new Vector(584.55877, 334.111504),
        ],

        [
            new Vector(812.076653, 293.50855),
            new Vector(758.76871, 375.741531),
            new Vector(708.950565, 343.446805),
            new Vector(716.642116, 331.581746),
            new Vector(753.089529, 355.1985),
            new Vector(792.38514, 293.661884),
            new Vector(789.867801, 292.030013),
            new Vector(795.764295, 282.934027),
        ],

        [
            new Vector(729.542893, 252.924254),
            new Vector(689.403598, 313.924314),
            new Vector(709.064018, 326.669226),
            new Vector(701.372466, 338.534286),
            new Vector(668.336583, 317.118699),
            new Vector(721.644367, 234.885615),
            new Vector(737.956726, 245.460139),
            new Vector(732.060232, 254.556125),
        ],

        [
            new Vector(280.173576, 543.903294),
            new Vector(307.611436, 554.684493),
            new Vector(299.609651, 575.048821),
            new Vector(272.171791, 564.267622),
        ],

        [
            new Vector(214.557256, 518.120576),
            new Vector(241.995116, 528.901775),
            new Vector(233.993331, 549.266103),
            new Vector(206.555471, 538.484904),
        ],

        [
            new Vector(166.631054, 498.610006),
            new Vector(194.068914, 509.391205),
            new Vector(186.067128, 529.755532),
            new Vector(158.629268, 518.974334),
        ],

        [
            new Vector(142.204046, 463.26051),
            new Vector(171.498838, 459.787016),
            new Vector(174.101015, 481.733284),
            new Vector(144.806223, 485.206778),
        ],

        [
            new Vector(137.24696, 421.453366),
            new Vector(166.541752, 417.979872),
            new Vector(169.143928, 439.92614),
            new Vector(139.849136, 443.399634),
        ],

        [
            new Vector(130.876926, 367.729696),
            new Vector(160.171718, 364.256203),
            new Vector(162.773895, 386.202471),
            new Vector(133.479103, 389.675964),
        ],

        [
            new Vector(209.575618, 358.398109),
            new Vector(238.87041, 354.924616),
            new Vector(241.472586, 376.870884),
            new Vector(212.177794, 380.344377),
        ],

        [
            new Vector(203.912058, 310.632702),
            new Vector(233.20685, 307.159209),
            new Vector(235.809026, 329.105477),
            new Vector(206.514234, 332.57897),
        ],

        [
            new Vector(258.032945, 304.215571),
            new Vector(287.327737, 300.742078),
            new Vector(289.929913, 322.688346),
            new Vector(260.635121, 326.161839),
        ],

        [
            new Vector(321.724693, 450.277666),
            new Vector(335.967988, 474.625178),
            new Vector(315.923671, 486.351104),
            new Vector(299.218159, 457.794672),
            new Vector(295.329129, 424.207593),
            new Vector(318.396781, 421.536602),
        ],
    ]

    os.forEach(cs => {
        env.addObstacle(Obstacle.fromCoords(cs))
    })
}
