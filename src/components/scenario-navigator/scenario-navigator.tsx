import * as React from 'react'
import {Input, Button, SelectMenu, IconButton, Text} from '../figma'
import './scenario-navigator.scss'
import {useForm} from '@smashing/form'
import {useDocumentValue} from '../../hooks/use-document-value'
import {useContextLoader} from '../../hooks/use-context-loader'
import {useLocalStore, observer, Observer} from 'mobx-react-lite'
import {ContextPlatform, FigmaPage, ContextState, Context} from '../../models'
import {useStore} from '../../store'
import {Navigator} from '../navigator'
import {NavigatorItem} from '../navigator/navigator-item'
import {clone} from 'mobx-state-tree'
import {autorun} from 'mobx'
import {v4} from 'uuid'
import EmptyStatesList from './components/empty-states-list'
import {post} from '../../helpers'

const PlusIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 5V0h1v5h5v1H6v5H5V6H0V5h5z" fillRule="nonzero" fillOpacity="1" fill="currentColor" stroke="none"></path>
  </svg>
)
const MinusIcon = () => (
  <svg width="12" height="6" viewBox="0 0 12 6" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 3H0V2h11v1z" fillRule="evenodd" fillOpacity="1" fill="currentColor" stroke="none"></path>
  </svg>
)

const ScenarioNavigator = observer(() => {
  const store = useStore()
  const [isCreatingScenario, setIsCreatingScenario] = React.useState(true)
  const [platformId] = useDocumentValue('platformId')
  const [pageId] = useDocumentValue('contextPageId')
  const searchInput = React.useRef<null | HTMLInputElement>(null)
  const {Field, form} = useForm({
    initialValues: {
      title: '',
      platformName: '',
      search: '',
      statusFilter: 'all',
      states: []
    }
  })
  const localStore = useLocalStore(() => ({
    lastTypedSearch: '',
    setLastTypedSearch(value: string) {
      localStore.lastTypedSearch = value
    },
    lastAutocompleteIndex: -1,
    setLastAutocompleteIndex(value?: number) {
      localStore.lastAutocompleteIndex = value
    },
    get search() {
      return form.values.search
        .trim()
        .split('/')
        .map(item => item.trim())
    },
    get page(): FigmaPage | undefined {
      return store.pages.get(pageId)
    },
    get platform(): ContextPlatform | undefined {
      return store.contextPlatforms.get(form.values.platformName, 'name')
    },
    get contextsWithDraft(): Context[] {
      return [].concat(store.draftContext || []).concat(localStore.platform.contexts)
    },
    get states(): ContextState[] {
      const context = localStore.platform.contexts.find(item => item.name === localStore.search[0])
      return context ? context.states : []
    },
    get contextStates(): ContextState[] {
      return form.values.states.map(item => store.contextStates.get(item, 'uuid'))
    }
  }))
  const handleScenarioNameKeyUp = React.useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && searchInput.current) {
      searchInput.current.focus()
    }
  }, [])
  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const [contextName, stateName] = localStore.lastTypedSearch.split('/').map(item => item.trim())

    if (event.key === 'Tab') {
      event.preventDefault()
      let match = []
      if (stateName) {
        match = localStore.states.filter(item => item.name.toLowerCase().indexOf(stateName.toLowerCase()) >= 0)
      } else {
        match = localStore.platform.contexts.filter(item => {
          return item.name.toLowerCase().indexOf(contextName.toLowerCase()) >= 0
        })
      }

      if (match.length === 0 && !stateName) {
        form.setFieldValue('search', `${localStore.search[0]}/`)
        return
      }

      localStore.setLastAutocompleteIndex((localStore.lastAutocompleteIndex + 1) % match.length)

      if (!match[localStore.lastAutocompleteIndex]) return

      if (stateName) {
        form.setFieldValue('search', `${localStore.search[0]}/${match[localStore.lastAutocompleteIndex].name}`)
      } else {
        form.setFieldValue('search', `${match[localStore.lastAutocompleteIndex].name}/`)
      }
    } else if (event.key === 'Enter' && contextName && stateName) {
      if (store.draftContext) {
        const context = clone(store.draftContext)
        store.setDraftContext()
        store.contexts.add(context)
      }
      if (store.draftContextState) {
        const contextState = clone(store.draftContextState)
        store.setDraftContextState()
        store.contextStates.add(contextState)
        form.setFieldValue('states', form.values.states.concat(contextState.uuid))
        form.setFieldValue('search', '')
        post<{id: string}>('createStateFrame', {
          name: `${localStore.platform.name} / ${contextState.getContext().name} / ${contextState.name}`
        }).then(res => {
          contextState.setFigmaNodeId(res.id)
        })
      } else {
        const contextState = localStore.states.find(item => item.name === localStore.search[1])
        form.setFieldValue('states', form.values.states.concat(contextState.uuid))
        form.setFieldValue('search', '')
      }
    }
  }
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    form.setFieldValue('search', event.target.value)
    localStore.setLastTypedSearch(event.target.value)
    localStore.setLastAutocompleteIndex(-1)
  }

  React.useEffect(() => {
    autorun(() => {
      if (!localStore.platform) return
      const [contextName, stateName] = localStore.search
      const existingContext = localStore.platform.contexts.find(item => item.name === contextName)
      const newContext = existingContext
        ? undefined
        : Context.create({
            name: contextName,
            platform: localStore.platform.name
          })
      const existingState = existingContext ? existingContext.states.find(item => item.name === stateName) : undefined
      const newState = existingState
        ? undefined
        : ContextState.create({
            name: stateName || '',
            contextUuid: existingContext ? existingContext.uuid : newContext.uuid
          })
      store.setDraftContext(newContext)
      store.setDraftContextState(stateName ? newState : undefined)
    })

    return () => {
      store.setDraftContext()
      store.setDraftContextState()
    }
  }, [])

  // Load platform id from store
  React.useEffect(() => {
    form.setFieldValue('platformName', platformId)
  }, [platformId])

  useContextLoader(pageId)

  if (isCreatingScenario) {
    return (
      <div className="scenario-form">
        <section>
          <Field name="title" component={Input} placeholder="Type scenario name..." onKeyUp={handleScenarioNameKeyUp} />
        </section>

        {localStore.contextStates.length === 0 ? (
          <EmptyStatesList />
        ) : (
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
        )}

        <div className="scenario-navigator__header">
          <Field name="platformName" component={SelectMenu} placeholder="Select platform...">
            {store.contextPlatforms.map(item => (
              <option key={item.name} value={item.name}>
                {item.name}
              </option>
            ))}
          </Field>
          <Input
            name="search"
            placeholder="Search or create..."
            ref={searchInput}
            value={form.values.search}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
          />
        </div>

        {localStore.platform ? (
          <Observer>
            {() => (
              <Navigator
                form={form}
                contexts={localStore.contextsWithDraft}
                contextFilter={item => {
                  return item.name.toLowerCase().indexOf(localStore.search[0].toLowerCase()) >= 0
                }}
                stateFilter={item => {
                  // Don't filter by state if search form doesn't contain "/"
                  if (!/\//.test(form.values.search)) {
                    return true
                  }
                  return item.name.toLowerCase().indexOf(localStore.search[1].toLowerCase()) >= 0
                }}
                renderStateItemMeta={item => (
                  <IconButton
                    icon={PlusIcon}
                    onClick={event => {
                      event.stopPropagation()
                      form.setFieldValue('states', form.values.states.concat(item.uuid))
                    }}
                  />
                )}
              />
            )}
          </Observer>
        ) : (
          <div />
        )}

        <div className="scenario-form__actions">
          <Button onClick={() => setIsCreatingScenario(false)}>Save</Button>
          <Button appearance="outline" onClick={() => setIsCreatingScenario(false)}>
            Cancel
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="scenario-navigator">
      <Button onClick={() => setIsCreatingScenario(true)}>Create scenario</Button>
    </div>
  )
})

export default ScenarioNavigator
