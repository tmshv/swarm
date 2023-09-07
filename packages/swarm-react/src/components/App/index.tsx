// import s from './app.module.css'
// TODO fix this import
const s: any = {}

import React from 'react'

import { useToggleSignal } from './useToggleSignal'
import {AppController, Vector, Signal} from '@tmshv/swarm'
import { useEffect } from 'react'
import SidePanel from '@/components/SidePanel'

function useSetupCamera(swarm: AppController) {
    useEffect(() => {
        const t = setTimeout(() => {
            // swarm.viewController.zoom(0.5, cameraCoord)
            // swarm.viewController.translate(new Vector(0, 0))
            swarm.viewController.translate(new Vector(1000, -1000))
            swarm.updateCamera()
        }, 1)

        return () => {
            clearTimeout(t)
        }
    }, [])
}

export type AppProps = {
    displayUiSignal: Signal<boolean>
    swarm: AppController
    [key: string]: any // todo this is temp
}

export const App: React.FC<AppProps> = ({ displayUiSignal, ...props }) => {
    const showUi = useToggleSignal(displayUiSignal, true)
    useSetupCamera(props.swarm)

    const layers = props.layers
        .map(({ name, controlable }) => ({
            name,
            controlable,
            checked: true,
        }))
    const layerList = layers.filter(({ controlable }) => controlable)

    return (
        <div className={s.container}>
            {!showUi ? null : (
                <div className={s.appBodyWrapper}>
                    <div className={s.appBody}>
                        <SidePanel
                            uiCallbacks={props.uiCallbacks}
                            layers={layerList}
                            // onLayerCheckedChange={this.onLayerCheckedChange}
                            onLayerCheckedChange={console.log}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
