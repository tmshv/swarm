import { useState, useEffect } from 'react'
import { Signal } from '@tmshv/swarm'

export function useSignalReducer<I, O>(signal: Signal<I>, initialValue: O, reduce: (acc: O, value: I) => O) {
    const [value, setValue] = useState(initialValue)

    useEffect(() => {
        return signal.on(value => {
            setValue(acc => reduce(acc, value))
        })
    }, [signal])

    return value
}
