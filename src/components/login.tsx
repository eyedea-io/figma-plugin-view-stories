import * as React from 'react'
import {useStore} from '../store'
import {v4} from 'uuid'
import {observer} from 'mobx-react-lite'
import {Loader} from './loader'
import {Button} from './figma'

const DOMAIN = process.env.SYNCANO_PROJECT_INSTANCE

export const Login = observer(() => {
  const [isLoading, setIsLoading] = React.useState(false)
  const uuid = React.useRef(v4())
  const store = useStore()
  const redirectURL = `https://${DOMAIN}.syncano.space/figma/login/?room=${uuid.current}`
  const loginURL = `https://${DOMAIN}.syncano.space/flow-auth/login/?redirect=${redirectURL}`
  const login = () => {
    setIsLoading(true)
    window.open(loginURL)
  }
  const handleLogin = data => {
    store.organizations.replace(data.organizations)
    store.setProfile(data.profile)
    store.setToken(data.token)
  }

  React.useEffect(() => {
    store.subscribe('figma/verify', {room: uuid.current}).addEventListener('message', ev => {
      handleLogin(JSON.parse(ev.data).payload)
    })
  }, [])

  if (isLoading) {
    return (
      <div>
        <Loader />
      </div>
    )
  }

  return (
    <div>
      <Button onClick={login}>Login</Button>
    </div>
  )
})
