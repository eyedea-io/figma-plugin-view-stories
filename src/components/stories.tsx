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
    if (value.trim() === '') return
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
    <section className="stories">
      <h2>User stories</h2>
      {stories.length ? (
        <ul className="story-list">
          {stories.map(item => (
            <li key={item.id} className={`story-list__item ${item.isDone ? 'is-done' : ''}`}>
              <div className="story-list__item-toggle" onClick={() => toggle(item)}>
                <CheckIcon />
              </div>
              <span>{item.content}</span>
              <RemoveIcon className="story-list__item-remove" onClick={() => remove(item)} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="stories__empty">
          <div className="stories__empty-inner">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" viewBox="0 0 576 512">
              <title>kiwi-bird</title>
              <g fill="#000000">
                <path d="M463.99 200c-13.25 0-24 10.74-24 24 0 13.25 10.75 24 24 24s24-10.75 24-24c0-13.26-10.75-24-24-24zm98.61 76.02c9.13-17.26 14.34-36.92 13.23-58.04C572.66 157.41 518.3 112 457.65 112h-9.37c-52.82 0-104.26-16.25-147.74-46.24C269.69 44.48 232.32 32 191.99 32c-14.56 0-29.5 1.62-44.67 5.05C76.36 53.08 19.49 110.89 4.43 182.07c-18.61 87.96 23.2 168.34 91.56 207.96V472c0 4.42 3.58 8 8 8h16c4.42 0 8-3.58 8-8v-66.93c20.02 7.08 41.56 10.93 64 10.93 10.94 0 21.57-1.14 32-2.91V472c0 4.42 3.58 8 8 8h16c4.42 0 8-3.58 8-8v-67.44c14.23-5.07 27.88-11.38 40.34-19.5C342.08 355.25 393.88 336 448.48 336h15.51c2.58 0 4.99-.61 7.53-.78l74.44 136.44c2.84 5.25 8.28 8.34 14.03 8.34 1.5 0 3-.2 4.5-.64 7.22-2.12 12-9 11.47-16.5L562.6 276.02zm-58.45 52.14c10.54-4.07 20.18-9.66 28.9-16.54l5.73 80.07-34.63-63.53zm17.88-49.1C506.77 295.14 486.16 304 463.99 304h-15.51c-57.3 0-114.36 18.25-169.62 54.25C253.01 375.1 222.97 384 191.99 384c-48.47 0-93.81-21.63-124.37-59.33-30.56-37.71-42.18-87.27-31.88-135.98 12.44-58.81 60.12-107.2 118.64-120.42C166.9 65.44 179.56 64 191.99 64c32.47 0 63.72 9.72 90.38 28.1 49.23 33.95 106.6 51.9 165.91 51.9h9.37c45.36 0 84.04 33.94 86.22 75.65 1.17 22.24-6.59 43.34-21.84 59.41z"></path>
              </g>
            </svg>
            <div>
              There are no user stories for this frame, <br /> you should define some.
            </div>
          </div>
        </div>
      )}
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
    </section>
  )
}
