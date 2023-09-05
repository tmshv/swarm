import { useState, useEffect } from 'react'
import Signal from '@/lib/Signal'

export function useSignal<T>(signal: Signal<T>, initialValue: T) {
    const [value, setValue] = useState<T>(initialValue)

    useEffect(() => {
        return signal.on(setValue)
    }, [signal])

    return value
}
