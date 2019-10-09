import * as React from 'react'
import {observer, Observer} from 'mobx-react-lite'
import {SelectMenu, Label} from '../../figma'
import {STATES, STATUS_TEXT} from '../../../helpers'
import {ContextState} from '../../../models'
import {FieldProps} from '@smashing/form'
import {useStore} from '../../../store'

export interface HeaderProps {
  Field: (props: FieldProps) => JSX.Element
  countFilter: (status?: string) => (item: ContextState) => void
}

export const Header = observer<HeaderProps>(({countFilter, Field}) => {
  const store = useStore()

  return (
    <div className="header">
      <div>
        <Label>Platform</Label>
        <Field name="platformName" component={SelectMenu} placeholder="Select platform...">
          {store.contextPlatforms.map(item => (
            <option key={item.name} value={item.name}>
              {item.name} <span className="filter-count">{item.contexts.length}</span>
            </option>
          ))}
        </Field>
      </div>

      <Observer>
        {() => (
          <div>
            <Label>Acceptance status</Label>
            <Field name="statusFilter" component={SelectMenu}>
              <option value="all">
                All <span className="filter-count">{store.contextStates.countBy(countFilter())}</span>
              </option>
              <option value={STATES.DRAFT}>
                {STATUS_TEXT[STATES.DRAFT]}
                <span className="filter-count">{store.contextStates.countBy(countFilter(STATES.DRAFT))}</span>
              </option>
              <option value={STATES.IN_PROGRESS}>
                {STATUS_TEXT[STATES.IN_PROGRESS]}
                <span className="filter-count">{store.contextStates.countBy(countFilter(STATES.IN_PROGRESS))}</span>
              </option>
              <option value={STATES.IN_REVIEW}>
                {STATUS_TEXT[STATES.IN_REVIEW]}
                <span className="filter-count">{store.contextStates.countBy(countFilter(STATES.IN_REVIEW))}</span>
              </option>
              <option value={STATES.REJECTED}>
                {STATUS_TEXT[STATES.REJECTED]}
                <span className="filter-count">{store.contextStates.countBy(countFilter(STATES.REJECTED))}</span>
              </option>
              <option value={STATES.ACCEPTED}>
                {STATUS_TEXT[STATES.ACCEPTED]}
                <span className="filter-count">{store.contextStates.countBy(countFilter(STATES.ACCEPTED))}</span>
              </option>
            </Field>
          </div>
        )}
      </Observer>
    </div>
  )
})
