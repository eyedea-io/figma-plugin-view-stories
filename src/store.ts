import {useContext, createContext} from 'react'
import {types, Instance, cast, SnapshotOrInstance} from 'mobx-state-tree'
import * as customTypes from './utils/custom-types'
import * as models from './models'
import Syncano from '@syncano/client'
import {post} from './helpers'

export const Store = types
  .model('Store', {
    isLoading: true,
    editedScenario: types.safeReference(models.Scenario),
    url: types.optional(types.string, 'scenarios'),
    token: types.maybe(types.string),
    profile: types.maybe(models.Profile),
    organizations: customTypes.collection(models.Organization, 'Organizations'),
    scenarios: customTypes.collection(models.Scenario, 'Scenarios'),
    details: customTypes.collection(models.Detail, 'Details'),
    pages: customTypes.collection(models.FigmaPage, 'Pages'),
    contexts: customTypes.collection(models.Context, 'Contexts'),
    contextPlatforms: customTypes.collection(models.ContextPlatform, 'ContextPlatforms'),
    draftContext: types.maybe(models.Context),
    draftContextState: types.maybe(models.ContextState),
    contextStates: customTypes.collection(models.ContextState, 'ContextStates')
  })
  .actions(self => ({
    setEditedScenario(uuid?: string) {
      self.editedScenario = uuid as any
    },
    setIsLoading(value: boolean) {
      self.isLoading = value
    },
    setDraftContext(context?: SnapshotOrInstance<models.Context>) {
      self.draftContext = cast(context)
    },
    setDraftContextState(state?: SnapshotOrInstance<models.ContextState>) {
      self.draftContextState = cast(state)
    },
    setToken(token?: string) {
      self.token = token
      if (token) {
        post('set', {key: 'token', value: token})
      } else {
        post('set', {key: 'token', value: undefined})
      }
    },
    setProfile(profile?: models.Profile) {
      self.profile = cast(profile)
      if (profile) {
        post('set', {key: 'profile', value: profile})
      } else {
        post('set', {key: 'profile', value: undefined})
      }
    }
  }))
  .actions(self => ({
    logout() {
      window.open(
        `https://${process.env.SYNCANO_PROJECT_INSTANCE}.syncano.space/flow-auth/logout/?user_key=${store.token}`
      )
      self.setProfile()
      self.setToken()
    },
    afterCreate() {
      const getToken = post<string>('get', {key: 'token'})
      const getProfile = post<models.Profile>('get', {key: 'profile'})

      Promise.all([getToken, getProfile]).then(([token, profile]) => {
        self.setToken(token)
        self.setProfile(profile)
      })
    },
    subscribe(url: string, data?: any) {
      const s = new Syncano(process.env.SYNCANO_PROJECT_INSTANCE)

      return s.listen(url, {token: self.token, ...data})
    },
    navigate(to: string) {
      self.url = to
    }
  }))
  .views(self => ({
    get isLoggedIn() {
      return Boolean(self.token) && Boolean(self.profile)
    }
  }))

export const store = Store.create({
  contextPlatforms: {
    items: [{name: 'Mobile'}, {name: 'Tablet'}, {name: 'Desktop'}, {name: 'Watch'}, {name: 'Email'}, {name: 'Paper'}]
  }
})
export const StoreContext = createContext<Instance<typeof Store>>(store)
export const useStore = () => useContext(StoreContext)
export interface Store extends Instance<typeof Store> {}
