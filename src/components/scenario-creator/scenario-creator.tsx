import * as React from 'react'
import {Input, Button} from '../figma'
import './scenario-creator.scss'
import {useForm} from '@smashing/form'
import {observer} from 'mobx-react-lite'
import {StateNavigator} from './components/state-navigator'
import {StatesList} from './components/states-list'
import {useStore} from '../../store'
import {post} from '../../helpers'

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
      states: isEdit ? store.editedScenario.states.map(item => item.uuid) : []
    }
  })

  const handleScenarioNameKeyUp = React.useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && searchInput.current) {
      searchInput.current.focus()
    }
  }, [])
  const createScenario = () => {
    if (form.values.title.trim() === '') return
    if (isEdit) {
      store.editedScenario.setTitle(form.values.title)
      store.editedScenario.setStates(form.values.states)
    } else {
      store.scenarios.add({
        title: form.values.title,
        states: form.values.states
      })
    }
    post('setDocumentValue', {
      key: 'scenarios',
      value: store.scenarios.items.toJSON().map(item => (item as any).toJSON())
    })
    store.navigate('scenarios')
    store.setEditedScenario()
  }
  const cancelCreation = React.useCallback(() => {
    store.navigate('scenarios')
    store.setEditedScenario()
  }, [])

  return (
    <div className="scenario-creator">
      <section>
        <Field name="title" component={Input} placeholder="Type scenario name..." onKeyUp={handleScenarioNameKeyUp} />
      </section>

      <StatesList form={form} />
      <StateNavigator searchInputRef={searchInput} form={form} Field={Field} />

      <div className="scenario-creator__footer">
        <Button appearance="outline" onClick={cancelCreation}>
          Cancel
        </Button>
        <Button onClick={createScenario}>{isEdit ? 'Update' : 'Create'}</Button>
      </div>
    </div>
  )
})

export default ScenarioCreator
