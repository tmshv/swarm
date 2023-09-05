import Signal from '@/lib/Signal'
import { useSignalReducer } from '@/hooks/useSignalReducer'

export function useToggleSignal(signal: Signal<boolean>, initialValue: boolean) {
    return useSignalReducer(signal, initialValue, value => !value)
}
