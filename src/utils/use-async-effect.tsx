import {useEffect} from 'react'

type EffectCallback = () => Promise<void> | (Promise<() => void | undefined>)

export default function useEffectAsync(effect: EffectCallback, deps?: readonly any[] | undefined): void {
  useEffect(() => {
    effect()
  }, deps)
}
