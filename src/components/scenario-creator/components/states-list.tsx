import * as React from 'react'
import {useLocalStore, observer} from 'mobx-react-lite'
import {ContextState} from '../../../models'
import {useStore} from '../../../store'
import EmptyStatesList from './empty-states-list'
import {NavigatorItem} from '../../navigator/navigator-item'
import {IconButton} from '../../figma'
import {MinusIcon} from '../../../icons/minus'
import {FormState} from '@smashing/form'
import {useDrag, useDrop, DropTargetMonitor} from 'react-dnd'
import {XYCoord} from 'dnd-core'
import update from 'immutability-helper'
import {v4} from 'uuid'
import {COLORS_RGB} from '../../../helpers'

interface DragItem {
  index: number
  uuid: string
  type: string
}

export interface StatesListProps {
  form: FormState<{
    title: string
    platformName: string
    search: string
    statusFilter: string
    states: {uuid: string; index: string}[]
  }>
}

interface StateItemProps {
  index: number
  item: ContextState
  form: StatesListProps['form']
  moveItem: (dragIndex: number, hoverIndex: number) => void
}

const StateItem: React.FC<StateItemProps> = observer(({item, form, index, moveItem}) => {
  const ref = React.useRef<HTMLDivElement>(null)
  const [, drop] = useDrop({
    accept: 'item',
    hover(item: DragItem, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current!.getBoundingClientRect()

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      // Determine mouse position
      const clientOffset = monitor.getClientOffset()

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      // Time to actually perform the action
      moveItem(dragIndex, hoverIndex)

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    }
  })
  const [{opacity}, drag] = useDrag({
    item: {type: 'item', uuid: item.uuid, index},
    collect: monitor => ({
      opacity: monitor.isDragging() ? 0 : 1
    })
  })
  drag(drop(ref))

  return (
    <NavigatorItem
      ref={ref}
      style={{opacity, cursor: 'move'}}
      renderItemMeta={() => (
        <React.Fragment>
          <div className="status" style={{marginRight: 8, '--status-color': COLORS_RGB[item.status]} as any} />
          <IconButton
            icon={MinusIcon}
            onClick={event => {
              event.stopPropagation()
              form.setFieldValue('states', form.values.states.filter((_item, i) => i !== index))
            }}
          />
        </React.Fragment>
      )}
      renderItemLabel={() => (
        <span>
          {item.getContext().name} / {item.name}
        </span>
      )}
      item={item}
      selectedNodeId={''}
      setSelectedNodeId={() => {}}
    />
  )
})

export const StatesList: React.FC<StatesListProps> = observer(({form}) => {
  const store = useStore()
  const localStore = useLocalStore(() => ({
    get contextStates(): {index: string; details: ContextState}[] {
      return form.values.states.map(item => ({
        index: item.index,
        details: store.contextStates.get(item.uuid, 'uuid')
      }))
    }
  }))

  const moveItem = React.useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const dragItem = form.values.states[dragIndex]
      form.setFieldValue(
        'states',
        update(form.values.states, {
          $splice: [[dragIndex, 1], [hoverIndex, 0, dragItem]]
        })
      )
    },
    [form.values.states]
  )

  if (localStore.contextStates.length === 0) {
    return <EmptyStatesList />
  }

  return (
    <div className="states-list">
      <div className="navigator">
        {localStore.contextStates.map((item, index) => (
          <StateItem moveItem={moveItem} key={`${item.index}`} item={item.details} index={index} form={form} />
        ))}
      </div>
    </div>
  )
})
