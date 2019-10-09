import * as React from 'react'
import {SelectMenu, Input, IconButton} from '../../figma'
import {useStore} from '../../../store'
import {observer, Observer, useLocalStore} from 'mobx-react-lite'
import {ContextPlatform, ContextState, Context} from '../../../models'
import {Navigator} from '../../navigator'
import {clone} from 'mobx-state-tree'
import {post, COLORS_RGB, STATES} from '../../../helpers'
import {FormState, FieldProps} from '@smashing/form'
import {PlusIcon} from '../../../icons/plus'
import {autorun} from 'mobx'
import {useDocumentValue} from '../../../hooks/use-document-value'
import {v4} from 'uuid'

export const StateNavigator = observer<{
  searchInputRef: React.RefObject<HTMLInputElement>
  Field: (props: FieldProps) => JSX.Element
  form: FormState<{
    title: string
    platformName: string
    search: string
    statusFilter: string
    states: {
      index: string
      uuid: string
    }[]
  }>
}>(({searchInputRef, form, Field}) => {
  const store = useStore()
  const [platformId] = useDocumentValue('platformId')
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
    get platform(): ContextPlatform | undefined {
      return store.contextPlatforms.get(form.values.platformName, 'name')
    },
    get states(): ContextState[] {
      const context = localStore.platform.contexts.find(item => item.name === localStore.search[0])
      return context ? context.states : []
    }
  }))
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
        form.setFieldValue(
          'states',
          form.values.states.concat({
            index: v4(),
            uuid: contextState.uuid
          })
        )
        form.setFieldValue('search', '')
        post<{id: string}>('createStateFrame', {
          name: `${localStore.platform.name} / ${contextState.getContext().name} / ${contextState.name}`,
          width: localStore.platform.width,
          height: localStore.platform.height,
          blueprint: {
            uuid: contextState.uuid,
            contextUuid: contextState.contextUuid,
            status: STATES.DRAFT
          }
        }).then(res => {
          contextState.setFigmaNodeId(res.id)
        })
        searchInputRef.current.focus()
      } else {
        const contextState = localStore.states.find(item => item.name === localStore.search[1])
        form.setFieldValue(
          'states',
          form.values.states.concat({
            index: v4(),
            uuid: contextState.uuid
          })
        )
        form.setFieldValue('search', '')
      }
    }
  }
  const handleSearchChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    localStore.setLastTypedSearch(event.target.value)
    localStore.setLastAutocompleteIndex(-1)
  }, [])

  // Load platform id from store
  React.useEffect(() => {
    form.setFieldValue('platformName', platformId)
  }, [platformId])

  React.useEffect(() => {
    const dispose = autorun(function createDraftContextAndState(reaction) {
      if (!localStore.platform) return
      const [contextName, stateName] = localStore.search
      const existingContext = localStore.platform.contexts.find(item => item.name === contextName)
      const existingState = existingContext ? existingContext.states.find(item => item.name === stateName) : undefined
      const newContext = existingContext
        ? undefined
        : Context.create({
            name: contextName,
            platform: localStore.platform.name
          })
      store.setDraftContext(newContext)
      store.setDraftContextState(
        existingState || !stateName
          ? undefined
          : {
              name: stateName || '',
              contextUuid: existingContext ? existingContext.uuid : newContext.uuid,
              status: 'draft'
            }
      )
    })

    return () => {
      store.setDraftContext()
      store.setDraftContextState()
      dispose()
    }
  }, [])

  return (
    <React.Fragment>
      <div className="scenario-creator__header">
        <Observer>
          {() => (
            <Field name="platformName" component={SelectMenu} placeholder="Select platform..." dropdownWidth={130}>
              {store.contextPlatforms.map(item => (
                <option key={item.name} value={item.name}>
                  {item.name} <span className="filter-count">{item.contexts.length}</span>
                </option>
              ))}
            </Field>
          )}
        </Observer>
        <Observer>
          {() => (
            <Field
              component={Input}
              name="search"
              placeholder="Search or create..."
              ref={searchInputRef}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
            />
          )}
        </Observer>
      </div>

      {localStore.platform ? (
        <Observer>
          {() => (
            <Navigator
              form={form}
              contexts={localStore.platform.contextsWithDraft}
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
                <React.Fragment>
                  <div className="status" style={{marginRight: 8, '--status-color': COLORS_RGB[item.status]} as any} />
                  <IconButton
                    icon={PlusIcon}
                    onClick={event => {
                      event.stopPropagation()
                      form.setFieldValue(
                        'states',
                        form.values.states.concat({
                          index: v4(),
                          uuid: item.uuid
                        })
                      )
                    }}
                  />
                </React.Fragment>
              )}
            />
          )}
        </Observer>
      ) : (
        <div />
      )}
    </React.Fragment>
  )
})
