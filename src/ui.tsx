import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {post} from './helpers'
import {Stories} from './components/stories'
import './ui.css'
import {ViewStatus} from './components/view-status'

const App = () => {
  const [message, setMessage] = React.useState()
  const [stories, setStories] = React.useState<Story[]>([])
  const [status, setStatus] = React.useState()
  const [selectedFrames, setSelectedFrames] = React.useState([])
  const getStatusValue = (selection: any[]) => {
    if (selection.length === 0) {
      return ''
    }
    const allFramesHasTheSameStatus = selection.every(
      item => item.status !== undefined && item.status === selection[0].status
    )
    if (allFramesHasTheSameStatus) {
      return selection[0].status.name
    }
    return ''
  }

  React.useEffect(() => {
    post({type: 'ready'})
  }, [])

  React.useEffect(() => {
    if (!message) return
    const {type, payload} = message

    if (type === 'selection-change') {
      setSelectedFrames(payload.selectedFrames)
      setStatus(getStatusValue(payload.selectedFrames))
      setStories(payload.stories)
    }
    if (type === 'update-stories') {
      setStories(payload)
    }
  }, [message])

  React.useEffect(() => {
    onmessage = ev => {
      setMessage(ev.data.pluginMessage)
    }
  }, [])

  if (selectedFrames.length === 0) {
    return <div>Select frames to get started.</div>
  }

  return (
    <React.Fragment>
      <ViewStatus status={status} setStatus={setStatus} />
      {selectedFrames.length === 1 && (
        <React.Fragment>
          <hr />
          <Stories stories={stories} selectedFrame={selectedFrames[0]} />
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

ReactDOM.render(<App />, document.getElementById('react-page'))
