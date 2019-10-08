import {useStore} from '../store'
import useEffectAsync from '../utils/use-async-effect'
import {post} from '../helpers'
export const useContextLoader = (pageId?: string) => {
  const store = useStore()

  useEffectAsync(async () => {
    store.contextStates.clear()
    store.contexts.clear()

    if (!pageId) return

    const frames = (await post<FrameNode[]>('getPageNodes', {pageId})).reverse()

    // Add contexts
    for (const item of frames) {
      const [platformName, contextName] = item.name.split(' / ')
      const platform = store.contextPlatforms.get(platformName, 'name')

      if (!platform) return

      if (!platform.contexts.find(item => item.name === contextName)) {
        store.contexts.add({name: contextName, platform: platform.name})
      }
    }

    // Add states
    for (const item of frames) {
      const [platformName, contextName, stateName] = item.name.split(' / ')
      const platform = store.contextPlatforms.get(platformName, 'name')
      const context = platform.contexts.find(item => item.name === contextName)

      if (platform && context) {
        store.contextStates.add({name: stateName, contextUuid: context.uuid, figmaNodeId: item.id})
      }
    }
  }, [pageId])
}
