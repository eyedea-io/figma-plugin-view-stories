import * as React from 'react'
import {post, STATUSES} from '../helpers'

export const ViewStatus = ({status, setStatus}: {status: string; setStatus: (value: string) => void}) => (
  <section className="view-status">
    <h2>View status</h2>
    <select
      value={status}
      onChange={event => {
        setStatus(event.target.value)
        post({type: 'update-frame-status', payload: event.target.value})
      }}
    >
      <option value="">Select status...</option>
      <option value={STATUSES.IN_PROGRESS}>In progress</option>
      <option value={STATUSES.READY_FOR_REVIEW}>Ready for review</option>
      <option value={STATUSES.DONE}>Done</option>
    </select>
  </section>
)
