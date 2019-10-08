import * as React from 'react'
import cx from 'classnames'
import './button.scss'

export type ButtonVariant = 'primary' | 'secondary'
export type ButtonAppearance = 'solid' | 'outline'

export type ButtonProps = React.ButtonHTMLAttributes<{}> & {
  appearance?: ButtonAppearance
  variant?: ButtonVariant
  disabled?: boolean
}

const Button: React.FC<ButtonProps> = ({children, appearance = 'solid', variant = 'primary', className, ...props}) => {
  const cn = cx(className, {
    button: true,
    [`button--${appearance}-${variant}`]: true
  })

  return (
    <button className={cn} {...props}>
      {children}
    </button>
  )
}

export default Button
