import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {post} from './helpers'
import {Stories} from './components/stories'
import './ui.css'
import {ViewStatus} from './components/view-status'
import {Navigator} from './components/navigator'

const App = () => {
  const [message, setMessage] = React.useState()
  const [stories, setStories] = React.useState<Story[]>([])
  const [status, setStatus] = React.useState()
  const [details, setDetails] = React.useState({})
  const [rejectionReason, setRejectionReason] = React.useState('')
  const [selectedFrames, setSelectedFrames] = React.useState([])
  const getStatusValue = (selection: any[]) => {
    if (selection.length === 0) {
      return ''
    }
    const allFramesHasTheSameStatus = selection.every(
      item => item.status !== undefined && item.status === selection[0].status
    )
    if (allFramesHasTheSameStatus) {
      return selection[0].status
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
      setRejectionReason(payload.selectedFrames[0] ? payload.selectedFrames[0].rejectionReason : '')
      setStories(payload.stories)
      setDetails(payload.details)
    }
    if (type === 'update-details') {
      setDetails(payload)
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

  // if (selectedFrames.length === 0) {
  //   return (
  //     <section className="empty-view">
  //       <div className="empty-view__inner">
  //         <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 512 512">
  //           <g fill="#000000">
  //             <path d="M486.4 128c14.14 0 25.6-11.46 25.6-25.6V25.6C512 11.46 500.54 0 486.4 0h-76.8C395.46 0 384 11.46 384 25.6V48H128V25.6C128 11.46 116.54 0 102.4 0H25.6C11.46 0 0 11.46 0 25.6v76.8C0 116.54 11.46 128 25.6 128H48v256H25.6C11.46 384 0 395.46 0 409.6v76.8C0 500.54 11.46 512 25.6 512h76.8c14.14 0 25.6-11.46 25.6-25.6V464h256v22.4c0 14.14 11.46 25.6 25.6 25.6h76.8c14.14 0 25.6-11.46 25.6-25.6v-76.8c0-14.14-11.46-25.6-25.6-25.6H464V128h22.4zM416 32h64v64h-64V32zM32 96V32h64v64H32zm64 384H32v-64h64v64zm384-64v64h-64v-64h64zm-48-32h-22.4c-14.14 0-25.6 11.46-25.6 25.6V432H128v-22.4c0-14.14-11.46-25.6-25.6-25.6H80V128h22.4c14.14 0 25.6-11.46 25.6-25.6V80h256v22.4c0 14.14 11.46 25.6 25.6 25.6H432v256z"></path>
  //           </g>
  //         </svg>
  //         <p>Select frame to get started.</p>
  //       </div>
  //     </section>
  //   )
  // }

  return (
    <div className="content">
      <Navigator details={details} selectedFrames={selectedFrames} />
      {selectedFrames.length > 0 && (
        <React.Fragment>
          <hr />
          <ViewStatus
            status={status}
            setStatus={setStatus}
            rejectionReason={rejectionReason}
            setRejectionReason={setRejectionReason}
          />
          <hr />
          {selectedFrames.length === 1 && <Stories stories={stories} selectedFrame={selectedFrames[0]} />}
        </React.Fragment>
      )}
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('react-page'))
