import * as React from 'react'
import cx from 'classnames'
import './icon-button.scss'

export type ButtonAppearance = 'solid' | 'outline'

export type IconButtonProps = React.ButtonHTMLAttributes<{}> & {
  appearance?: ButtonAppearance
  icon?: React.ComponentType
}

const Button: React.FC<IconButtonProps> = ({children, icon: Icon, appearance = 'solid', className, ...props}) => {
  const cn = cx(className, 'icon-button', `icon-button--${appearance}`)

  return (
    <button className={cn} {...props}>
      {Icon ? <Icon /> : children}
    </button>
  )
}

export default Button
