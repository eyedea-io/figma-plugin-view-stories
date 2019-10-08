import * as React from 'react'
import {SelectMenu, Label} from '../figma'
import {useDocumentValue} from '../../hooks/use-document-value'
import {observer} from 'mobx-react-lite'
import {useStore} from '../../store'
import './settings.scss'

const Settings = observer(() => {
  const store = useStore()
  const [contextPageId, setContextPageId] = useDocumentValue('contextPageId')

  return (
    <div className="settings">
      <Label>Contexts page</Label>
      <SelectMenu placeholder="Select page..." value={contextPageId} onChange={setContextPageId}>
        {store.pages.map(item => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </SelectMenu>
    </div>
  )
})

export default Settings
