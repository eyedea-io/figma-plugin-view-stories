import * as React from 'react'
import {Text} from '../../figma'

export default () => (
  <div className="empty-states-list">
    <svg width="24" height="24" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3.743 2.748L6 .5l2.257 2.248L6 4.996 3.743 2.748zm-.995 5.51L.5 6l2.248-2.257L4.996 6 2.748 8.257zm5.51.994L6 11.5 3.743 9.252 6 7.004l2.257 2.248zM11.5 6L9.252 3.743 7.004 6l2.248 2.257L11.5 6z"
        fillRule="nonzero"
        fillOpacity="1"
        fill="currentColor"
        stroke="none"
      ></path>
    </svg>
    <Text>Choose scenario states bellow</Text>
  </div>
)
