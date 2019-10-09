import * as React from 'react'
import cx from 'classnames'
import './select-menu.scss'

export type ButtonVariant = 'primary' | 'secondary'
export type ButtonAppearance = 'solid' | 'outline'

export type SelectMenuProps = Omit<React.SelectHTMLAttributes<{}>, 'onChange'> & {
  value: string
  disabled?: boolean
  alignWithActiveItem?: boolean
  onChange: (value: string) => void
  dropdownWidth?: number
}

const SelectMenu: React.FC<SelectMenuProps> = ({
  children,
  value,
  className,
  onChange,
  alignWithActiveItem = false,
  placeholder,
  ...props
}) => {
  const [isActive, setIsActive] = React.useState(false)
  const options = React.Children.map(children, item => ({
    value: (item as React.ReactElement).props.value,
    label: (item as React.ReactElement).props.children
  }))
  const activeItemIndex = options.findIndex(item => item.value === value)
  const close = () => setIsActive(false)

  React.useEffect(() => {
    if (isActive) {
      window.document.addEventListener('click', close)
    }

    return () => {
      window.document.removeEventListener('click', close)
    }
  }, [isActive])
  const selected = options.find(item => item.value === value)

  return (
    <div
      className={cx('select-menu', className)}
      onClick={event => {
        event.preventDefault()
        event.stopPropagation()
      }}
    >
      <button
        className="select-menu__button"
        onClick={() => {
          setIsActive(!isActive)
        }}
      >
        <span className="select-menu__button-label">{selected ? selected.label : placeholder}</span>
        <span className="select-menu__icon"></span>
      </button>
      <ul
        className={cx('select-menu__list', {
          'select-menu__list--active': isActive
        })}
        style={{
          width: props.dropdownWidth,
          top: activeItemIndex >= 0 && alignWithActiveItem ? activeItemIndex * -26 : 0
        }}
      >
        {options.map(item => (
          <li
            key={item.value}
            className={cx('select-menu__list-item', {
              'select-menu__list-item--active': item.value === value
            })}
            onClick={() => {
              setIsActive(!isActive)
              onChange(item.value)
            }}
          >
            <span className="select-menu__list-item-icon"></span>
            <span className="select-menu__list-item-text">{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SelectMenu
