import * as React from 'react'
import {useLocalStore, observer} from 'mobx-react-lite'
import {ContextState} from '../../../models'
import {useStore} from '../../../store'
import EmptyStatesList from './empty-states-list'
import {NavigatorItem} from '../../navigator/navigator-item'
import {IconButton} from '../../figma'
import {MinusIcon} from '../../../icons/minus'
import {FormState} from '@smashing/form'

export interface StatesListProps {
  form: FormState<{
    title: string
    platformName: string
    search: string
    statusFilter: string
    states: string[]
  }>
}

export const StatesList: React.FC<StatesListProps> = observer(({form}) => {
  const store = useStore()
  const localStore = useLocalStore(() => ({
    get contextStates(): ContextState[] {
      return form.values.states.map(item => store.contextStates.get(item, 'uuid'))
    }
  }))

  if (localStore.contextStates.length === 0) {
    return <EmptyStatesList />
  }

  return (
    <div className="states-list">
      <div className="navigator">
        {localStore.contextStates.map((item, index) => (
          <NavigatorItem
            key={`${item.uuid}-${index}`}
            renderItemMeta={() => (
              <IconButton
                icon={MinusIcon}
                onClick={event => {
                  event.stopPropagation()
                  form.setFieldValue('states', form.values.states.filter((_item, i) => i !== index))
                }}
              />
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
        ))}
      </div>
    </div>
  )
})
