const UI_OPTIONS = {
  height: 720,
  width: 380
}

function getPlatformsWithContexts() {
  const page = getContextPage()
  const states = page.children.map(item => {
    const [platform, context, state] = item.name.split('/').map(item => item.trim())
    return {
      blueprint: {
        platform,
        context,
        state
      },
      figma: item
    }
  })
  const statesByPlatform = states.reduce((all, item) => {
    if (!all[item.blueprint.platform]) {
      all[item.blueprint.platform] = []
    }
    all[item.blueprint.platform].push(item)
    return all
  }, {})

  return Object.entries<typeof states>(statesByPlatform).map(([key, items]) => ({
    platform: key,
    contexts: items.reduce(
      (all, item) => {
        if (!all[item.blueprint.context]) {
          all[item.blueprint.context] = []
        }
        all[item.blueprint.context].push(item)
        return all
      },
      {} as {
        [contextName: string]: typeof states
      }
    )
  }))
}

function getContextPage() {
  const pageId = actions.getDocumentValue({key: 'contextPageId'})
  let page = figma.root.children.find(item => item.id === pageId && item.type === 'PAGE')
  if (!page) {
    page = figma.createPage()
    page.name = 'master - States'
    figma.root.appendChild(page)
  }
  return page
}
function getScenariosPage() {
  let scenariosPage = figma.root.children.find(item => item.name === 'master - Scenarios')
  if (!scenariosPage) {
    scenariosPage = figma.createPage()
    scenariosPage.name = 'master - Scenarios'
    figma.root.appendChild(scenariosPage)
  }
  return scenariosPage
}

const actions = {
  getPages() {
    return figma.root.children.map(item => ({
      id: item.id,
      name: item.name
    }))
  },
  getPageNodes({pageId}: {pageId: string}) {
    actions.organizeStatesPage()
    return figma.root.children
      .find(item => item.id === pageId)
      .children.map(item => ({
        id: item.id,
        name: item.name,
        blueprint: JSON.parse(item.getPluginData('blueprint'))
      }))
  },
  selectNode({nodeId}: {nodeId: string}) {
    const node = figma.currentPage.findOne(node => node.id === nodeId)

    if (node) {
      figma.viewport.scrollAndZoomIntoView([node])
      figma.currentPage.selection = [node]
    }
  },
  setupScenarios({uuidArr}: {uuidArr: {[uuid: string]: string}[]}) {
    const contextPage = getContextPage()
    let scenariosPage = getScenariosPage()
    // Clean scenarios page
    scenariosPage.children.forEach(item => item.remove())
    const scenarios: {
      title: string
      uuid: string
      states: string[]
    }[] = JSON.parse(figma.root.getPluginData('scenarios') || '[]')
    let scenarioX = 0
    let scenarioY = 0
    let scenarioHeight = 0
    scenarios.forEach(item => {
      scenarioHeight = 0
      const nodes = []
      item.states.forEach(uuid => {
        const component = contextPage.findOne(node => {
          return node.type === 'COMPONENT' && node.id === uuidArr[uuid]
        }) as ComponentNode
        if (!component) return
        const instance = component.createInstance()
        nodes.push(instance)
        instance.x = scenarioX
        instance.y = scenarioY
        scenarioX += instance.width + 30
        scenarioHeight = Math.max(component.height, scenarioHeight)
        scenariosPage.appendChild(instance)
      })
      figma.group(nodes, scenariosPage).name = item.title
      scenarioX = 0
      scenarioY += scenarioHeight + 120
    })
    // platforms.forEach(platform => {
    //   Object.entries(platform.contexts).forEach(([contextName, states]) => {
    //     states.forEach()
    //   })
    // })
  },
  organizeStatesPage() {
    const contextPage = getContextPage()
    const statesByContext = getPlatformsWithContexts()
    type States = typeof statesByContext[0]['contexts'][string]
    const calculations = statesByContext.map(item => {
      return {
        ...item,
        y: 0,
        height: Object.entries<States>(item.contexts).reduce((maxHeight, [, states]) => {
          const height = states.reduce((total, state) => total + state.figma.height + 120, 0)
          return Math.max(maxHeight, height)
        }, 0)
      }
    })
    calculations.reduce((prev, current, currentIndex) => {
      calculations[currentIndex].y = prev.y + prev.height + 120
      return current
    })

    let contextX: number
    let stateY: number

    calculations.forEach(platform => {
      contextX = 0

      Object.entries<States>(platform.contexts).forEach(([contextName, states]) => {
        const contextWidth = platform.contexts[contextName].reduce(
          (maxWidth, item) => Math.max(item.figma.width, maxWidth),
          0
        )
        stateY = platform.y

        states.forEach(state => {
          const frame = contextPage.findOne(node => node.id === state.figma.id)
          frame.x = contextX
          frame.y = stateY
          stateY += state.figma.height + 120
        })

        contextX += contextWidth + 80
      })
    })
  },
  createStateFrame({name, blueprint, width, height}: {name: string; blueprint: any; width: number; height: number}) {
    const pageId = actions.getDocumentValue({key: 'contextPageId'})
    const page = figma.root.children.find(item => item.id === pageId && item.type === 'PAGE')
    if (!page) return {}

    const frame = figma.createComponent()
    frame.name = name
    frame.backgrounds = [{type: 'SOLID', color: {r: 1, g: 1, b: 1}}]
    frame.resizeWithoutConstraints(width, height)
    frame.setPluginData('blueprint', JSON.stringify(blueprint))
    frame.setPluginData('status', 'draft')
    page.appendChild(frame)
    actions.organizeStatesPage()
    page.selection = [frame]
    return {id: frame.id}
  },
  setDocumentValue({key, value}: {key: string; value: any}) {
    figma.root.setPluginData(key, JSON.stringify(value))
  },
  getDocumentValue({key}: {key: string}) {
    return JSON.parse(figma.root.getPluginData(key))
  },
  setNodeValue({nodeId, key, value}: {nodeId: string; key: string; value: any}) {
    figma.root.findOne(item => item.id === nodeId).setPluginData(key, value)
  },
  getNodeValue({nodeId, key}: {nodeId: string; key: string}) {
    return figma.root.findOne(item => item.id === nodeId).getPluginData(key)
  },
  get: async ({key}: {key: string}) => {
    return figma.clientStorage.getAsync(key)
  },
  set: async ({key, value}: {key: string; value: any}) => {
    return figma.clientStorage.setAsync(key, value)
  }
}
// Handle requests
figma.ui.onmessage = async (message: Message) => {
  const payload = await actions[message.type](message.payload)
  figma.ui.postMessage({type: 'response', id: message.id, payload})
}

// Show widget ui
figma.showUI(__html__, UI_OPTIONS)
