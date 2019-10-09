import * as React from 'react'
import {Input, Button} from '../figma'
import './scenario-creator.scss'
import {useForm} from '@smashing/form'
import {observer} from 'mobx-react-lite'
import {StateNavigator} from './components/state-navigator'
import {StatesList} from './components/states-list'
import {useStore} from '../../store'
import {post} from '../../helpers'
import {v4} from 'uuid'

const ScenarioCreator = observer(() => {
  const store = useStore()
  const searchInput = React.useRef<null | HTMLInputElement>(null)
  const isEdit = Boolean(store.editedScenario)
  const {Field, form} = useForm({
    initialValues: {
      title: isEdit ? store.editedScenario.title : '',
      platformName: '',
      search: '',
      statusFilter: 'all',
      states: isEdit
        ? store.editedScenario.states.map(item => ({
            index: v4(),
            uuid: item.uuid
          }))
        : []
    }
  })
  const handleScenarioNameKeyUp = React.useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && searchInput.current) {
      searchInput.current.focus()
    }
  }, [])
  const createOrUpdateScenario = () => {
    if (form.values.title.trim() === '') return
    if (isEdit) {
      store.editedScenario.setTitle(form.values.title)
      store.editedScenario.setStates(form.values.states.map(item => item.uuid))
    } else {
      store.scenarios.add({
        title: form.values.title,
        states: form.values.states.map(item => item.uuid)
      })
    }
    post('setDocumentValue', {
      key: 'scenarios',
      value: store.scenarios.items.toJSON().map(item => (item as any).toJSON())
    })
    post('setupScenarios', {
      uuidArr: store.contextStates.items.reduce((all, item) => ({...all, [item.uuid]: item.figmaNodeId}), {})
    })
    store.navigate('scenarios')
    store.setEditedScenario()
  }
  const cancelCreation = React.useCallback(() => {
    store.navigate('scenarios')
    store.setEditedScenario()
  }, [])

  React.useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.key === 'Escape') cancelCreation()
    }
    window.document.addEventListener('keydown', listener)
    return () => {
      window.document.removeEventListener('keydown', listener)
    }
  }, [])

  return (
    <div className="scenario-creator">
      <section>
        <Field
          autoFocus
          name="title"
          component={Input}
          placeholder="Type scenario name..."
          onKeyUp={handleScenarioNameKeyUp}
        />
      </section>

      <StatesList form={form} />
      <StateNavigator save={createOrUpdateScenario} searchInputRef={searchInput} form={form} Field={Field} />

      <div className="scenario-creator__footer">
        <Button appearance="outline" onClick={cancelCreation}>
          Cancel
        </Button>
        <Button onClick={createOrUpdateScenario}>{isEdit ? 'Update' : 'Create'}</Button>
      </div>
    </div>
  )
})

export default ScenarioCreator
