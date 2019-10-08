import * as React from 'react'
import cx from 'classnames'
import './label.scss'

export type LabelProps = React.LabelHTMLAttributes<{}> & {}

const Label: React.FC<LabelProps> = ({className, ...props}) => {
  const cn = cx(className, 'label')

  return <label className={cn} {...props} />
}

export default Label
