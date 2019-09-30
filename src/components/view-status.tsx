import * as React from 'react'
import {post, STATES, STATUS_TEXT, COLORS, figmaColorToRgbString} from '../helpers'

export const ViewStatus = ({
  status,
  setStatus,
  rejectionReason,
  setRejectionReason
}: {
  status: string
  rejectionReason: string
  setStatus: (value: string) => void
  setRejectionReason: (value: string) => void
}) => (
  <section className="view-status">
    <h2>View status</h2>
    <div className="select --with-status">
      <select
        className={status ? 'has-status' : ''}
        value={status}
        onChange={event => {
          setStatus(event.target.value)
          post({type: 'update-frame-details', payload: {status: event.target.value, rejectionReason: ''}})
        }}
      >
        <option value="">Select status...</option>
        <option value={STATES.DRAFT}>{STATUS_TEXT[STATES.DRAFT]}</option>
        <option value={STATES.IN_PROGRESS}>{STATUS_TEXT[STATES.IN_PROGRESS]}</option>
        <option value={STATES.IN_REVIEW}>{STATUS_TEXT[STATES.IN_REVIEW]}</option>
        <option value={STATES.REJECTED}>{STATUS_TEXT[STATES.REJECTED]}</option>
        <option value={STATES.ACCEPTED}>{STATUS_TEXT[STATES.ACCEPTED]}</option>
      </select>
      <div
        style={
          COLORS[status]
            ? {
                [`--color`]: figmaColorToRgbString(COLORS[status])
              }
            : {}
        }
      />
    </div>
    {status === STATES.REJECTED && (
      <React.Fragment>
        <h2>Rejection reason</h2>
        <input
          type="text"
          placeholder="Why it is rejected?"
          value={rejectionReason}
          onChange={event => {
            setRejectionReason(event.target.value)
            post({type: 'update-frame-rejection-reason', payload: {rejectionReason: event.target.value}})
          }}
        />
      </React.Fragment>
    )}
  </section>
)
