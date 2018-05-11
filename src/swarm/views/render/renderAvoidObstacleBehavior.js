export default function renderAvoidObstacleBehavior(drawer, agent, behaviour) {
    const ctx = drawer.context
    ctx.lineWidth = 1
    ctx.strokeStyle = 'rgba(255, 0, 255, 1)'

    if (behaviour.edge) renderWall(drawer, behaviour)
    if (behaviour.impactForce) renderForce(drawer, agent, behaviour)
    if (behaviour.intersection) renderIntersection(drawer, agent, behaviour)

    renderRadius(drawer, agent, behaviour)

    // const obstacle = behaviour.obstacle
    // if (obstacle) {
    //     ctx.strokeStyle = 'rgba(250, 0, 250, 0.5)'
    //     drawer.line(obstacle.lines[0])
    // }
}

function renderIntersection(drawer, agent, behaviour) {
    const ctx = drawer.context
    ctx.strokeStyle = null
    ctx.fillStyle = 'rgba(250, 0, 250, 1)'
    drawer.circleCenter(behaviour.intersection, 2)
    ctx.fill()
}

function renderRadius(drawer, agent, behaviour) {
    const ctx = drawer.context
    ctx.strokeStyle = 'rgba(250, 0, 250, 1)'
    drawer.circleCenterZoomed(agent.location, behaviour.radius)
}

function renderForce(drawer, agent, behaviour) {
    const ctx = drawer.context
    const r = behaviour.impactForce
        .clone()
        .setLength(behaviour.predictionDistance)
    ctx.lineWidth = 1
    ctx.strokeStyle = 'rgba(250, 0, 0, 1)'
    drawer.vector(agent.location, r)
}

function renderWall(drawer, behaviour) {
    const ctx = drawer.context

    const edge = behaviour.edge
    const offsetSize = behaviour.predictionDistance
    const offset = edge.offset(edge
        .normal
        .clone()
        .setLength(offsetSize)
    )

    ctx.strokeStyle = null
    ctx.fillStyle = 'rgba(250, 0, 250, 0.1)'
    drawer.path([
        edge.a, edge.b,
        offset.b, offset.a,
    ], true)
}