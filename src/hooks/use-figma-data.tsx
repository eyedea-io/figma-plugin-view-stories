import {useStore} from '../store'
import useEffectAsync from '../utils/use-async-effect'
import {post} from '../helpers'
import {Scenario} from '../models'
import {useDocumentValue} from './use-document-value'

export const useFigmaData = () => {
  const store = useStore()
  const [contextPageId] = useDocumentValue('contextPageId')

  useEffectAsync(async () => {
    store.scenarios.clear()
    store.contextStates.clear()
    store.contexts.clear()
    store.setIsLoading(true)

    const [scenarios = [], frames = []] = await Promise.all([
      await post<Scenario[]>('getDocumentValue', {key: 'scenarios'}),
      (await post<
        Array<
          FrameNode & {
            blueprint: {
              uuid?: string
              status?: string
              contextUuid?: string
            }
          }
        >
      >('getPageNodes', {pageId: contextPageId})).reverse()
    ])
    console.log(frames, scenarios)
    // Add contexts
    for (const item of frames) {
      const [platformName, contextName] = item.name.split(' / ')
      const platform = store.contextPlatforms.get(platformName, 'name')

      if (!platform) return

      if (!platform.contexts.find(item => item.name === contextName)) {
        store.contexts.add({
          name: contextName,
          platform: platform.name,
          uuid: item.blueprint.contextUuid
        })
      }
    }

    // Add states
    for (const item of frames) {
      const [platformName, contextName, stateName] = item.name.split(' / ')
      const platform = store.contextPlatforms.get(platformName, 'name')
      const context = platform.contexts.find(item => item.name === contextName)
      if (platform && context) {
        store.contextStates.add({
          uuid: item.blueprint.uuid,
          status: item.blueprint.status,
          name: stateName,
          contextUuid: item.blueprint.contextUuid,
          figmaNodeId: item.id,
          isDraft: false
        })
      }
    }
    store.scenarios.replace(scenarios)
    store.setIsLoading(false)
  }, [contextPageId])
}
