import s from './app.module.css'
import Signal from '@/lib/Signal'
import App2 from './App'
import { useToggleSignal } from './useToggleSignal'
import { usePrevent } from '@/hooks/usePrevent'

export type AppProps = {
    displayUiSignal: Signal<boolean>
    [key: string]: any // todo this is temp
}

export const App: React.FC<AppProps> = ({ displayUiSignal, ...props }) => {
    const showUi = useToggleSignal(displayUiSignal, true)
    usePrevent(window, 'mousewheel')

    return (
        <div className={s.container}>
            <App2
                {...props}
                showUi={showUi}
            />
        </div>
    )
}
