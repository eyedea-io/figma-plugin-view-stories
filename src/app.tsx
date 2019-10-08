import * as React from 'react'
import {useStore} from './store'
import {observer} from 'mobx-react-lite'
import {Login} from './components/login'
import {Text} from './components/figma'
import {ContextNavigator} from './components/context-navigator'
import cx from 'classnames'
import './ui.scss'
import {ScenarioNavigator} from './components/scenario-navigator'
import {Settings} from './components/settings'
import useEffectAsync from './utils/use-async-effect'
import {post} from './helpers'

const TABS = [
  {label: 'Contexts', value: 'contexts'},
  {label: 'Scenarios', value: 'scenarios'},
  {label: 'Settings', value: 'settings'}
]

const Route = observer<{path: string; component: React.FC}>(({path, component: Component}) => {
  const store = useStore()
  if (store.url === path) {
    return <Component />
  }
  return null
})

export const App = observer(() => {
  const store = useStore()

  useEffectAsync(async () => {
    store.pages.replace(await post<PageNode[]>('getPages'))
  }, [])

  if (!store.isLoggedIn) {
    return <Login />
  }

  return (
    <div className="view">
      <Route path="contexts" component={ContextNavigator} />
      <Route path="scenarios" component={ScenarioNavigator} />
      <Route path="settings" component={Settings} />

      <div className="footer">
        {TABS.map(item => (
          <div
            key={item.value}
            className={cx('footer__item', {'is-active': store.url === item.value})}
            onClick={() => store.navigate(item.value)}
          >
            <Text>{item.label}</Text>
          </div>
        ))}
        <div className="footer__item" onClick={store.logout}>
          <Text>Logout</Text>
        </div>
      </div>
    </div>
  )
})
