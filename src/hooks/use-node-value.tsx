import * as React from 'react'
import {post} from '../helpers'
import useEffectAsync from '../utils/use-async-effect'

export const useNodeValue = (nodeId: string, key: string) => {
  const [value, setLocalValue] = React.useState()
  const setValue = (value: any) => {
    post('setNodeValue', {nodeId, key, value})
    setLocalValue(value)
  }

  useEffectAsync(async () => {
    setLocalValue(await post('getNodeValue', {nodeId, key}))
  }, [])

  return [value, setValue]
}
