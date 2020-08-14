import { Canvas } from '../Canvas'
import { useRef, useEffect } from 'react'

export type SimulationProps = {
    view: any

    width: number
    height: number
    devicePixelRatio: number

    onClick: any
    onMouseMove: any
    onMouseDown: any
    onMouseUp: any
    onMouseWheel: any
}

export const Simulation: React.FC<SimulationProps> = props => {
    const ref = useRef<HTMLCanvasElement>()
    const viewRef = useRef<any>()

    useEffect(() => {
        viewRef.current = props.view.init({
            width: props.width,
            height: props.height,
            canvas: ref.current,
        })

        return () => {
            if (viewRef.current) {
                viewRef.current.destroy()
            }
        }
    }, [ref.current, props.width, props.height, props.view])

    const { width, height, devicePixelRatio } = props
    const { onClick, onMouseMove, onMouseDown, onMouseUp, onMouseWheel } = props

    return (
        <Canvas
            ref={ref}
            width={width}
            height={height}
            devicePixelRatio={devicePixelRatio}

            onClick={onClick}
            onMouseMove={onMouseMove}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onWheel={onMouseWheel}
        />
    )
}