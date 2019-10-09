import {types, Instance, getRoot} from 'mobx-state-tree'
import {Store} from './store'
import * as customTypes from './utils/custom-types'
import {post, STATES} from './helpers'

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
    status: types.maybe(types.string),
    isDraft: types.optional(types.boolean, true)
  })
  .actions(self => ({
    setIsDraft(value: boolean) {
      self.isDraft = value
    },
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
    name: types.identifier,
    width: types.maybe(types.number),
    height: types.maybe(types.number)
  })
  .views(self => ({
    get contexts(): Context[] {
      return getRoot<Store>(self).contexts.items.filter(item => item.platform.name === self.name)
    },
    get contextsWithDraft(): Context[] {
      const store = getRoot<Store>(self)
      return getRoot<Store>(self)
        .contexts.items.concat(store.draftContext || [])
        .filter(item => item.platform.name === self.name)
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
        .concat(store.contextStates ? store.contextStates.items : [])
        .filter(item => item.contextUuid === self.uuid)
    }
  }))
  .views(self => ({
    get isAccepted() {
      return self.states.every(item => item.status === STATES.ACCEPTED) && self.states.length
    }
  }))
export const Scenario = types
  .model('Scenario', {
    uuid: customTypes.identifierUuid,
    title: types.string,
    states: types.array(types.safeReference(ContextState))
  })
  .actions(self => ({
    setTitle(title: string) {
      self.title = title || ''
    },
    setStates(states: string[]) {
      self.states.replace(states as any)
    }
  }))
  .views(self => ({
    get status() {
      const hasRejectedStatus = self.states.some(item => item.status === STATES.REJECTED)
      if (hasRejectedStatus) return STATES.REJECTED
      const everyStateIsAccepted = self.states.every(item => item.status === STATES.ACCEPTED) && self.states.length
      if (everyStateIsAccepted) return STATES.ACCEPTED
      const everyStateIsInReview = self.states.every(item => item.status === STATES.IN_REVIEW) && self.states.length
      if (everyStateIsInReview) return STATES.IN_REVIEW
      const hasInProgress = self.states.some(item => item.status === STATES.IN_PROGRESS)
      if (hasInProgress) return STATES.IN_PROGRESS
      return STATES.DRAFT
    }
  }))
export interface FigmaPage extends Instance<typeof FigmaPage> {}
export interface Context extends Instance<typeof Context> {}
export interface ContextState extends Instance<typeof ContextState> {}
export interface ContextPlatform extends Instance<typeof ContextPlatform> {}
export interface Scenario extends Instance<typeof Scenario> {}
export interface Detail extends Instance<typeof Detail> {}
export interface Organization extends Instance<typeof Organization> {}
export interface Profile extends Instance<typeof Profile> {}
