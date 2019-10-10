import * as React from 'react'
import {useStore} from '../../store'
import {observer, useLocalStore, Observer} from 'mobx-react-lite'
import {useForm} from '@smashing/form'
import {useFigmaData} from '../../hooks/use-figma-data'
import {ContextPlatform, ContextState} from '../../models'
import {useDocumentValue} from '../../hooks/use-document-value'
import {Header} from './components/header'
import './context-navigator.scss'
import {SelectMenu} from '../figma'
import {STATES, STATUS_TEXT, COLORS_RGB, post} from '../../helpers'
import {EmptyState} from './components/empty-state'
import {Navigator} from '../navigator'

const NodeStatusSelect = ({value, onChange, className}) => (
  <SelectMenu value={value} onChange={onChange} placeholder="Status..." className={className}>
    <option value={STATES.DRAFT}>{STATUS_TEXT[STATES.DRAFT]}</option>
    <option value={STATES.IN_PROGRESS}>{STATUS_TEXT[STATES.IN_PROGRESS]}</option>
    <option value={STATES.IN_REVIEW}>{STATUS_TEXT[STATES.IN_REVIEW]}</option>
    <option value={STATES.REJECTED}>{STATUS_TEXT[STATES.REJECTED]}</option>
    <option value={STATES.ACCEPTED}>{STATUS_TEXT[STATES.ACCEPTED]}</option>
  </SelectMenu>
)

const ContextNavigator = observer(() => {
  const store = useStore()
  const [platformId, setPlatformId] = useDocumentValue('platformId')
  const {Field, form} = useForm({
    initialValues: {
      statusFilter: 'all',
      platformName: 'Desktop'
    }
  })
  const localStore = useLocalStore(() => ({
    get platform(): ContextPlatform | undefined {
      return store.contextPlatforms.get(form.values.platformName, 'name')
    }
  }))

  useFigmaData()

  // Load platform id from store
  React.useEffect(() => {
    form.setFieldValue('platformName', platformId || 'Desktop')
  }, [platformId])

  // Save platform id on select
  React.useEffect(() => {
    setPlatformId(form.values.platformName)
  }, [form.values.platformName])

  const countFilter = (status?: string) => (item: ContextState) =>
    localStore.platform &&
    item.getContext().platform.name === localStore.platform.name &&
    (status ? item.status === status : true)

  if (store.isLoading) {
    return <div />
  }

  return (
    <div className="states-view">
      {console.log(form.values)}
      <Header countFilter={countFilter} Field={Field} />
      <Observer>
        {() =>
          localStore.platform ? (
            <Navigator
              form={form}
              className="context-navigator"
              contexts={localStore.platform.contexts}
              renderEmptyState={EmptyState}
              renderStateItemMeta={item => (
                <React.Fragment>
                  <NodeStatusSelect
                    className="navigator__item-status-select"
                    value={item.status}
                    onChange={value => {
                      post('setNodeValue', {nodeId: item.figmaNodeId, key: 'status', value})
                      item.setStatus(value)
                    }}
                  />
                  <div
                    className="navigator__item-status status"
                    style={{'--status-color': COLORS_RGB[item.status]} as any}
                  />
                </React.Fragment>
              )}
            />
          ) : null
        }
      </Observer>
    </div>
  )
})

export default ContextNavigator
