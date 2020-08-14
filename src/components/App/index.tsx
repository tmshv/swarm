import { useState, useEffect } from 'react'
import s from './app.module.css'
import Signal from '@/lib/Signal'
import App2 from './App'

function useToggleUi(signal: Signal) {
    const [value, setValue] = useState<boolean>(true)

    useEffect(() => {
        const callback = () => {
            setValue(value => !value)
        }
        signal.on(callback)

        return () => {
            signal.off(callback)
        }
    }, [signal])

    return value
}

export type AppProps = {
    displayUiSignal: Signal
    [key: string]: any // todo this is temp
}

export const App: React.FC<AppProps> = ({ displayUiSignal, ...props }) => {
    const showUi = useToggleUi(displayUiSignal)

    return (
        <div className={s.container}>
            <App2
                {...props}
                showUi={showUi}
            />
        </div>
    )
}
