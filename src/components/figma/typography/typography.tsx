import * as React from 'react'
import cx from 'classnames'
import './typography.scss'

export type TextVariant = 100 | 200 | 300 | 400 | 500
export type TextProps = React.HTMLAttributes<{}> & {
  variant?: TextVariant
}
export type ParagraphProps = React.HTMLAttributes<{}> & TextProps & {}
export type LinkProps = React.HTMLAttributes<{}> & TextProps & {}
export type HeadingProps = React.HTMLAttributes<{}> &
  TextProps & {
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  }

export const Text: React.FC<TextProps> = ({children, variant = 200, ...props}) => {
  const cn = cx(props.className, {
    text: true,
    [`text--${variant}`]: true
  })

  return React.createElement('span', {
    ...props,
    className: cn,
    children
  })
}

export const Paragraph: React.FC<ParagraphProps> = ({children, variant = 200, ...props}) => {
  const cn = cx(props.className, {
    text: true,
    paragraph: true,
    [`text--${variant}`]: true,
    [`paragraph--${variant}`]: true
  })

  return React.createElement('p', {
    ...props,
    className: cn,
    children
  })
}

export const Heading: React.FC<HeadingProps> = ({children, as = 'h2', variant = 200, ...props}) => {
  const cn = cx(props.className, {
    text: true,
    heading: true,
    [`text--${variant}`]: true,
    [`heading--${variant}`]: true
  })

  return React.createElement(as, {
    ...props,
    className: cn,
    children
  })
}

export const Link: React.FC<HeadingProps> = ({children, variant = 200, ...props}) => {
  const cn = cx(props.className, {
    text: true,
    link: true,
    [`text--${variant}`]: true,
    [`link--${variant}`]: true
  })

  return React.createElement('a', {
    ...props,
    className: cn,
    children
  })
}
