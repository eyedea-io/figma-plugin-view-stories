import * as React from 'react'
import {observer} from 'mobx-react-lite'
import {ContextState} from '../../models'
import cx from 'classnames'
import {post} from '../../helpers'
import {InstanceIcon} from '../../icons/instance'

const ContextStateIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 512 512">
    <g fill="currentColor">
      <path d="M486.4 128c14.14 0 25.6-11.46 25.6-25.6V25.6C512 11.46 500.54 0 486.4 0h-76.8C395.46 0 384 11.46 384 25.6V48H128V25.6C128 11.46 116.54 0 102.4 0H25.6C11.46 0 0 11.46 0 25.6v76.8C0 116.54 11.46 128 25.6 128H48v256H25.6C11.46 384 0 395.46 0 409.6v76.8C0 500.54 11.46 512 25.6 512h76.8c14.14 0 25.6-11.46 25.6-25.6V464h256v22.4c0 14.14 11.46 25.6 25.6 25.6h76.8c14.14 0 25.6-11.46 25.6-25.6v-76.8c0-14.14-11.46-25.6-25.6-25.6H464V128h22.4zM416 32h64v64h-64V32zM32 96V32h64v64H32zm64 384H32v-64h64v64zm384-64v64h-64v-64h64zm-48-32h-22.4c-14.14 0-25.6 11.46-25.6 25.6V432H128v-22.4c0-14.14-11.46-25.6-25.6-25.6H80V128h22.4c14.14 0 25.6-11.46 25.6-25.6V80h256v22.4c0 14.14 11.46 25.6 25.6 25.6H432v256z"></path>
    </g>
  </svg>
)

export const NavigatorItem = observer(
  ({
    item,
    selectedNodeId,
    setSelectedNodeId,
    renderItemMeta,
    renderItemLabel = item => item.name
  }: {
    item: ContextState
    selectedNodeId?: string
    setSelectedNodeId: (value: string) => void
    renderItemMeta: (item: ContextState) => React.ReactNode
    renderItemLabel?: (item: ContextState) => React.ReactNode
  }) => (
    <div
      className={cx('navigator__item', {
        'is-selected': item.figmaNodeId === selectedNodeId
      })}
      key={item.uuid}
      onClick={() => {
        post('selectNode', {nodeId: item.figmaNodeId})
        setSelectedNodeId(item.figmaNodeId)
      }}
    >
      <InstanceIcon width={12} height={12} />
      <div className="navigator__item-label">{renderItemLabel(item)}</div>
      <div className="navigator__item-meta">{renderItemMeta(item)}</div>
    </div>
  )
)
