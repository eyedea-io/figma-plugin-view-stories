import {types, Instance, IAnyModelType, getRoot} from 'mobx-state-tree'
import {Store} from './store'
import * as customTypes from './utils/custom-types'
import {post} from './helpers'

export const Detail = types.model('Detail', {})
export const Profile = types.model('Profile', {
  id: types.identifierNumber,
  username: types.string,
  fullName: types.string,
  photo: types.maybe(types.string)
})
export const Organization = types.model('Organization', {
  id: types.identifierNumber,
  title: types.string
})
export const FigmaPage = types.model('FigmaPage', {
  id: types.identifier,
  name: types.string
})
export const ContextState = types
  .model('ContextState', {
    uuid: customTypes.identifierUuid,
    name: types.string,
    figmaNodeId: types.maybe(types.string),
    contextUuid: types.string,
    status: types.maybe(types.string)
  })
  .actions(self => ({
    setFigmaNodeId(value: string) {
      self.figmaNodeId = value
    },
    setStatus(value: string) {
      self.status = value
    }
  }))
  .actions(self => ({
    afterCreate() {
      post<string>('getNodeValue', {nodeId: self.figmaNodeId, key: 'status'}).then(self.setStatus)
    }
  }))
  .views(self => ({
    getContext(): Context | undefined {
      return getRoot<Store>(self).contexts.get(self.contextUuid, 'uuid')
    }
  }))
export const ContextPlatform = types
  .model('ContextPlatform', {
    name: types.identifier
  })
  .views(self => ({
    get contexts(): Context[] {
      return getRoot<Store>(self).contexts.items.filter(item => item.platform.name === self.name)
    }
  }))
  .views(self => ({
    get states(): ContextState[] {
      return [].concat.apply([], self.contexts.map(item => item.states))
    }
  }))
export const Context = types
  .model('Context', {
    uuid: customTypes.identifierUuid,
    name: types.string,
    platform: types.reference(ContextPlatform)
  })
  .actions(self => ({
    setName(name: string) {
      self.name = name
    }
  }))
  .views(self => ({
    get states(): ContextState[] {
      const store = getRoot<Store>(self)
      return store.contextStates.items.filter(item => item.contextUuid === self.uuid)
    },
    get statesWithDraft(): ContextState[] {
      const store = getRoot<Store>(self)
      return []
        .concat(store.draftContextState ? store.draftContextState : [])
        .concat(store.contextStates.items)
        .filter(item => item.contextUuid === self.uuid)
    }
  }))
export interface FigmaPage extends Instance<typeof FigmaPage> {}
export interface Context extends Instance<typeof Context> {}
export interface ContextState extends Instance<typeof ContextState> {}
export interface ContextPlatform extends Instance<typeof ContextPlatform> {}
export interface Detail extends Instance<typeof Detail> {}
export interface Organization extends Instance<typeof Organization> {}
export interface Profile extends Instance<typeof Profile> {}
