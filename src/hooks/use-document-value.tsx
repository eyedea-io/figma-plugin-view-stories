import * as React from 'react'
import {post} from '../helpers'
import useEffectAsync from '../utils/use-async-effect'

export const useDocumentValue = (key: string) => {
  const [value, setLocalValue] = React.useState()
  const setValue = (value: any) => {
    post('setDocumentValue', {key, value})
    setLocalValue(value)
  }

  useEffectAsync(async () => {
    setLocalValue(await post('getDocumentValue', {key}))
  }, [])

  return [value, setValue]
}
