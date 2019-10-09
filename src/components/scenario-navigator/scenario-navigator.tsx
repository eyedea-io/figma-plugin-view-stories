import * as React from 'react'
import {useStore} from '../../store'
import {observer} from 'mobx-react-lite'
import {useFigmaData} from '../../hooks/use-figma-data'
import './scenario-navigator.scss'
import {Button, IconButton} from '../figma'
import {ScenarioIcon} from '../../icons/scenario'
import {PlusIcon} from '../../icons/plus'
import {PencilIcon} from '../../icons/pencil'

const ScenarioNavigator = observer(() => {
  const store = useStore()

  useFigmaData()

  return (
    <div className="scenario-navigator">
      <div className="scenario-navigator__header">
        <Button onClick={() => store.navigate('scenarios/create')}>
          <PlusIcon /> Add new scenario
        </Button>
      </div>
      <div className="navigator">
        {store.scenarios.map(item => (
          <div key={item.uuid} className="navigator__item">
            <ScenarioIcon />
            <div className="navigator__item-label">{item.title}</div>
            <div className="navigator__item-meta">
              <IconButton
                icon={PencilIcon}
                onClick={event => {
                  event.stopPropagation()
                  store.setEditedScenario(item.uuid)
                  store.navigate('scenarios/create')
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})

export default ScenarioNavigator
