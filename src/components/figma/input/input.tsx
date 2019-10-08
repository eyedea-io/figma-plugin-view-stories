import * as React from 'react'
import cx from 'classnames'
import './input.scss'

export type ButtonProps = React.InputHTMLAttributes<{}> & {}

const Input = React.forwardRef<HTMLInputElement, ButtonProps>(({className, ...props}, ref) => {
  const cn = cx(className, 'input')

  return <input className={cn} {...props} ref={ref} />
})

export default Input
