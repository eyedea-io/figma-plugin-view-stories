import * as React from 'react'
import {Paragraph, Button} from '../../figma'
import {KiwiIcon} from '../../../icons/kiwi'
import {useStore} from '../../../store'
import {observer} from 'mobx-react-lite'

export const EmptyState = observer(() => {
  const store = useStore()

  return (
    <div className="states-view__empty">
      <KiwiIcon />
      <Paragraph>
        There's nothing to display.
        <br /> Get started by adding scenarios.
      </Paragraph>
      <Paragraph>
        <Button onClick={() => store.navigate('scenarios/create')}>Get started</Button>
      </Paragraph>
    </div>
  )
})
