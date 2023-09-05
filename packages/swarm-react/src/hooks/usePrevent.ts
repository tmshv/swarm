import { useEffect } from "react"

type PreventTarget = Window | Document | HTMLElement

export function usePrevent(target: PreventTarget, eventName: string) {
    useEffect(() => {
        const handle = (e: Event) => {
            e.preventDefault()
        }

        target.addEventListener(eventName, handle, {
            passive: false // magic piece
        })

        return () => {
            target.removeEventListener(eventName, handle)
        }
    }, [])
}
