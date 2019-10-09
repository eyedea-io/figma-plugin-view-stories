const UI_OPTIONS = {
  height: 620,
  width: 380
}

const actions = {
  getPages() {
    return figma.root.children.map(item => ({
      id: item.id,
      name: item.name
    }))
  },
  getPageNodes({pageId}: {pageId: string}) {
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
  createStateFrame({name, blueprint}: {name: string; blueprint: any}) {
    const pageId = actions.getDocumentValue({key: 'contextPageId'})
    const page = figma.root.children.find(item => item.id === pageId && item.type === 'PAGE')
    if (!page) return {}

    const frame = figma.createComponent()
    frame.name = name
    frame.setPluginData('blueprint', JSON.stringify(blueprint))
    page.appendChild(frame)
    page.selection = [frame]
    figma.viewport.scrollAndZoomIntoView([frame])
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
