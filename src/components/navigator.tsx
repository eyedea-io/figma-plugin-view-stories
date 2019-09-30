import * as React from 'react'
import {post, STATES, STATUS_TEXT, COLORS, figmaColorToRgbString} from '../helpers'

interface NavigatorProps {
  details: Details
  selectedFrames: SelectedFrame[]
}

const FrameIcon = (props: any) => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M3.5 0V2.5H7.5V0H8.5V2.5H11V3.5H8.5V7.5H11V8.5H8.5V11H7.5V8.5H3.5V11H2.5V8.5H0V7.5H2.5V3.5H0V2.5H2.5V0H3.5ZM7.5 7.5V3.5H3.5V7.5H7.5Z"
      fill="currentColor"
    />
  </svg>
)

export const Navigator = ({details, selectedFrames}: NavigatorProps) => {
  const [filter, setFilter] = React.useState('all')

  if (!details) {
    return null
  }

  const focusFrame = (frame: any, {add}: {add: boolean}) => {
    post({type: 'focus-frame', payload: {id: frame.id, add}})
  }
  const isSelected = id => selectedFrames.some(item => item.id === id)

  return (
    <div className="navigator">
      <h2>Navigator</h2>
      <ul className="filter-list" style={{'--color': COLORS[filter] ? figmaColorToRgbString(COLORS[filter]) : '#fff'}}>
        <li className={`filter-list__item ${filter === 'all' ? 'is-selected' : ''}`} onClick={() => setFilter('all')}>
          All
        </li>
        <li
          className={`filter-list__item ${filter === STATES.DRAFT ? 'is-selected' : ''}`}
          onClick={() => setFilter(STATES.DRAFT)}
        >
          {STATUS_TEXT[STATES.DRAFT]}
        </li>
        <li
          className={`filter-list__item ${filter === STATES.IN_PROGRESS ? 'is-selected' : ''}`}
          onClick={() => setFilter(STATES.IN_PROGRESS)}
        >
          {STATUS_TEXT[STATES.IN_PROGRESS]}
        </li>
        <li
          className={`filter-list__item ${filter === STATES.IN_REVIEW ? 'is-selected' : ''}`}
          onClick={() => setFilter(STATES.IN_REVIEW)}
        >
          {STATUS_TEXT[STATES.IN_REVIEW]}
        </li>
        <li
          className={`filter-list__item ${filter === STATES.REJECTED ? 'is-selected' : ''}`}
          onClick={() => setFilter(STATES.REJECTED)}
        >
          {STATUS_TEXT[STATES.REJECTED]}
        </li>
        <li
          className={`filter-list__item ${filter === STATES.ACCEPTED ? 'is-selected' : ''}`}
          onClick={() => setFilter(STATES.ACCEPTED)}
        >
          {STATUS_TEXT[STATES.ACCEPTED]}
        </li>
      </ul>
      <ul className="list">
        {Object.entries(details)
          .filter(([, item]) => {
            if (filter === 'all') return true
            return item.status === filter
          })
          .map(([, item]) => (
            <li
              className={`list__item ${isSelected(item.id) ? 'is-selected' : ''}`}
              onClick={event => focusFrame(item, {add: event.ctrlKey})}
            >
              <FrameIcon className="list__item-icon" />
              {item.name}
            </li>
          ))}
      </ul>
    </div>
  )
}
