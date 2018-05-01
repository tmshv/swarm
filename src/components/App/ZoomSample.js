import React, {Component} from 'react'

function eventCoord(event, element) {
    return [
        event.offsetX || (event.pageX - element.offsetLeft),
        event.offsetY || (event.pageY - element.offsetTop),
    ]
}

export default class ZoomSample extends Component {
    constructor(...args) {
        super(...args)

        this.onRef = this.onRef.bind(this)
    }

    onRef(e) {
        this.canvas = e
    }

    clear(ctx, canvas) {
        ctx.save()
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.restore()
    }

    redraw(ctx, canvas, img) {
        this.clear(ctx, canvas)
        ctx.drawImage(img, 0, 0)
    }

    componentDidMount() {
        const img = new Image()
        img.src = 'https://cdn.shopify.com/s/files/1/0592/6389/products/MarilynGlitch_large.jpg?v=1475187005'
        img.onload = () => {
            this.redraw(ctx, canvas, img)
        }

        const canvas = this.canvas
        const ctx = canvas.getContext('2d')
        this.trackTransforms(ctx)

        let lastX = canvas.width / 2
        let lastY = canvas.height / 2
        let dragStart

        canvas.addEventListener('mousedown', evt => {
            [lastX, lastY] = eventCoord(evt, canvas)
            dragStart = ctx.transformedPoint(lastX, lastY);
        })

        canvas.addEventListener('mousemove', evt => {
            [lastX, lastY] = eventCoord(evt, canvas)

            if (dragStart) {
                const pt = ctx.transformedPoint(lastX, lastY);
                ctx.translate(pt.x - dragStart.x, pt.y - dragStart.y);

                this.redraw(ctx, canvas, img);
            }
        })

        canvas.addEventListener('mouseup', () => {
            dragStart = null;
            zoomIn()
        })

        let scaleFactor = 1.1

        const zoomIn = () => {
            zoom(1)
        }

        const zoomOut = () => {
            zoom(-1)
        }

        const zoom = m => {
            const s = scaleFactor ** m
            const pt = ctx.transformedPoint(lastX, lastY)

            ctx.translate(pt.x, pt.y)
            ctx.scale(s, s)
            ctx.translate(-pt.x, -pt.y)

            this.redraw(ctx, canvas, img)
        }

        const handleScroll = event => {
            event.preventDefault()

            const delta = event.deltaY
            if (delta > 0) zoomOut()
            else zoomIn()
        };

        canvas.addEventListener('DOMMouseScroll', handleScroll)
        canvas.addEventListener('mousewheel', handleScroll)
    }

    trackTransforms(ctx) {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg')
        let xform = svg.createSVGMatrix()
        ctx.getTransform = function () {
            return xform;
        };

        const savedTransforms = []
        const save = ctx.save
        ctx.save = function () {
            savedTransforms.push(xform.translate(0, 0));
            return save.call(ctx);
        };
        const restore = ctx.restore
        ctx.restore = function () {
            xform = savedTransforms.pop();
            return restore.call(ctx);
        };

        const scale = ctx.scale
        ctx.scale = function (sx, sy) {
            xform = xform.scaleNonUniform(sx, sy);
            return scale.call(ctx, sx, sy);
        };

        const rotate = ctx.rotate
        ctx.rotate = function (radians) {
            xform = xform.rotate(radians * 180 / Math.PI);
            return rotate.call(ctx, radians);
        };

        const translate = ctx.translate
        ctx.translate = function (dx, dy) {
            xform = xform.translate(dx, dy);
            return translate.call(ctx, dx, dy);
        };

        const transform = ctx.transform
        ctx.transform = function (a, b, c, d, e, f) {
            const m2 = svg.createSVGMatrix()
            m2.a = a;
            m2.b = b;
            m2.c = c;
            m2.d = d;
            m2.e = e;
            m2.f = f;
            xform = xform.multiply(m2);
            return transform.call(ctx, a, b, c, d, e, f);
        };

        const setTransform = ctx.setTransform
        ctx.setTransform = function (a, b, c, d, e, f) {
            xform.a = a;
            xform.b = b;
            xform.c = c;
            xform.d = d;
            xform.e = e;
            xform.f = f;
            return setTransform.call(ctx, a, b, c, d, e, f);
        };

        const pt = svg.createSVGPoint()
        ctx.transformedPoint = function (x, y) {
            pt.x = x;
            pt.y = y;
            return pt.matrixTransform(xform.inverse());
        }
    }

    render() {
        return (
            <canvas
                width={800}
                height={600}
                ref={this.onRef}
            />
        )
    }
}
