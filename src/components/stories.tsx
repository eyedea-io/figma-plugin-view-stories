import * as React from 'react'
import {post} from '../helpers'

interface StoriesProps {
  stories: Story[]
  selectedFrame: SelectedFrame
}

const CheckIcon = props => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" {...props}>
    <g fill="currentColor">
      <path d="M18.71 7.21a1 1 0 0 0-1.42 0l-7.45 7.46-3.13-3.14A1 1 0 1 0 5.29 13l3.84 3.84a1 1 0 0 0 1.42 0l8.16-8.16a1 1 0 0 0 0-1.47z"></path>
    </g>
  </svg>
)

const RemoveIcon = props => (
  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" {...props}>
    <g fill="none">
      <path d="M.5.5l9 9m0-9l-9 9" stroke="currentColor" strokeLinejoin="round"></path>
    </g>
  </svg>
)

export const Stories = ({stories = [], selectedFrame}: StoriesProps) => {
  const [value, setValue] = React.useState('')
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    post({
      type: 'add-story',
      payload: {
        frameId: selectedFrame.id,
        content: value
      }
    })
    setValue('')
  }
  const toggle = (item: Story) => {
    post({
      type: 'toggle-story',
      payload: {
        id: item.id,
        frameId: selectedFrame.id
      }
    })
  }
  const remove = (item: Story) => {
    post({
      type: 'remove-story',
      payload: {
        id: item.id,
        frameId: selectedFrame.id
      }
    })
  }

  return (
    <div className="stories">
      <h2>User stories</h2>
      <ul className="story-list">
        {stories.map(item => (
          <li className={`story-list__item ${item.isDone ? 'is-done' : ''}`}>
            <div className="story-list__item-toggle" onClick={() => toggle(item)}>
              <CheckIcon />
            </div>
            <span>{item.content}</span>
            <RemoveIcon className="story-list__item-remove" onClick={() => remove(item)} />
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input
          className="stories-input"
          type="text"
          placeholder="Add view story..."
          autoFocus
          value={value}
          onChange={e => setValue(e.target.value)}
        />
      </form>
    </div>
  )
}
