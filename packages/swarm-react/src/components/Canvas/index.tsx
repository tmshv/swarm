import React, { Component, forwardRef } from 'react'

export type CanvasProps = React.DetailedHTMLProps<React.CanvasHTMLAttributes<HTMLCanvasElement>, HTMLCanvasElement> & {
    width: number
    height: number
    devicePixelRatio: number
}

export const Canvas = forwardRef<HTMLCanvasElement, CanvasProps>((props, ref) => {
    const { width, height, devicePixelRatio, ...otherProps } = props
    const w = width * devicePixelRatio
    const h = height * devicePixelRatio

    return (
        <canvas
            ref={ref}
            width={w}
            height={h}
            {...otherProps}
        />
    )
})