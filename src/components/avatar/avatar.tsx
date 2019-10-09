import * as React from 'react'
import {observer} from 'mobx-react-lite'
import './avatar.scss'

export interface AvatarProps {
  src: string
  size?: number
}

const Avatar = observer<AvatarProps>(({src, size = 32}) => {
  return <img className="avatar" src={src} alt="" style={{width: size, height: size}} />
})

export default Avatar
