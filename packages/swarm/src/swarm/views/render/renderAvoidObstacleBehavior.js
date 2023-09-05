export default function renderAvoidObstacleBehavior(drawer, agent, behavior) {
    const ctx = drawer.context
    ctx.lineWidth = 1
    ctx.strokeStyle = 'rgba(255, 0, 255, 1)'

    renderFutureLocation(drawer, agent, behavior)
    if (behavior.edge) renderWall(drawer, behavior)
    if (behavior.impactForce) renderForce(drawer, agent, behavior)
    if (behavior.intersection) renderIntersection(drawer, agent, behavior)

    // renderRadius(drawer, agent, behavior)

    // const obstacle = behavior.obstacle
    // if (obstacle) {
    //     ctx.strokeStyle = 'rgba(250, 0, 250, 0.5)'
    //     drawer.line(obstacle.lines[0])
    // }
}

function renderFutureLocation(drawer, agent, behavior) {
    const f = behavior.predictLocation()
    const ctx = drawer.context
    ctx.strokeStyle = '#fff'
    drawer.circleCenter(f, 2)
}

function renderIntersection(drawer, agent, behavior) {
    const ctx = drawer.context
    ctx.strokeStyle = null
    ctx.fillStyle = 'rgba(250, 0, 250, 1)'
    drawer.circleCenter(behavior.intersection, 2)
    ctx.fill()
}

function renderRadius(drawer, agent, behavior) {
    const ctx = drawer.context
    ctx.strokeStyle = 'rgba(250, 0, 250, 1)'
    drawer.circleCenterZoomed(agent.location, behavior.radius)
}

function renderForce(drawer, agent, behavior) {
    const ctx = drawer.context
    const r = behavior.impactForce
        .clone()
        .setLength(behavior.predictionDistance)
    ctx.lineWidth = 1
    ctx.strokeStyle = 'rgba(250, 0, 0, 1)'
    drawer.vector(agent.location, r)
}

function renderWall(drawer, behavior) {
    const ctx = drawer.context

    const edge = behavior.edge
    const offsetSize = behavior.predictionDistance
    const offset = edge.offset(edge
        .normal
        .clone()
        .setLength(offsetSize)
    )

    ctx.strokeStyle = null
    ctx.fillStyle = 'rgba(250, 0, 250, 1)'
    drawer.path([
        edge.a, edge.b,
        offset.b, offset.a,
    ], true)
}