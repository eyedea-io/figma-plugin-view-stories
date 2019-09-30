import {COLORS} from './helpers'

figma.showUI(__html__, {
  height: 560,
  width: 320
})

interface Message {
  type: string
  payload: any
}
let selection: readonly SceneNode[] = []

// Poor man's listener
setInterval(() => {
  handleSelectionChange()
}, 50)

figma.ui.onmessage = msg => {
  switch (msg.type) {
    case 'ready':
      return init()
    case 'update-frame-details':
      return handelFrameDetailsUpdate(msg)
    case 'update-frame-rejection-reason':
      return handelRejectionReasonUpdate(msg)
    case 'add-story':
      return handleAddStory(msg)
    case 'toggle-story':
      return handleToggleStory(msg)
    case 'remove-story':
      return handleRemoveStory(msg)
    case 'focus-frame':
      return handleFocusFrame(msg)
    case 'fetch-details':
      return handleFetchDetails()
    default:
      break
  }
}

function handleFetchDetails() {
  figma.ui.postMessage({type: 'update-details', payload: getDetails()})
}

function handleFocusFrame(message: Message) {
  const node = figma.currentPage.findOne(item => item.id === message.payload.id)
  if (message.payload.add) {
    if (figma.currentPage.selection.some(item => item.id === node.id)) {
      figma.currentPage.selection = figma.currentPage.selection.filter(item => item.id !== node.id)
    } else {
      figma.currentPage.selection = [...figma.currentPage.selection, node]
    }
  } else {
    figma.currentPage.selection = [node]
  }
  figma.viewport.scrollAndZoomIntoView(figma.currentPage.selection)
  handleSelectionChange()
}

function handleAddStory(message: Message) {
  const stories = getStories(selection).concat({
    id: Math.random().toString(32),
    content: message.payload.content,
    isDone: false
  })

  figma.currentPage.setPluginData(`stories.${message.payload.frameId}`, JSON.stringify(stories))
  figma.ui.postMessage({
    type: 'update-stories',
    payload: stories
  })
}

function handleToggleStory(message: Message) {
  const stories = getStories(selection).map(item =>
    item.id === message.payload.id
      ? {
          ...item,
          isDone: !item.isDone
        }
      : item
  )

  figma.currentPage.setPluginData(`stories.${message.payload.frameId}`, JSON.stringify(stories))
  figma.ui.postMessage({
    type: 'update-stories',
    payload: stories
  })
}

function handleRemoveStory(message: Message) {
  const stories: Story[] = getStories(selection)
  const storyIndex = stories.findIndex(item => item.id === message.payload.id)
  if (storyIndex >= 0) {
    stories.splice(storyIndex, 1)
    figma.currentPage.setPluginData(`stories.${message.payload.frameId}`, JSON.stringify(stories))
    figma.ui.postMessage({
      type: 'update-stories',
      payload: stories
    })
  }
}

function getStatusesGroup() {
  const statesGroupId = figma.currentPage.getPluginData('statusFrameId')
  let group = figma.currentPage.findOne(item => item.id === statesGroupId)

  if (!group) {
    group = figma.createFrame()
    group.name = '# Statuses'
    group.clipsContent = false
    group.x = 0
    group.y = 0
    group.resizeWithoutConstraints(1, 1)
    figma.currentPage.appendChild(group)
    figma.currentPage.setPluginData('statusFrameId', group.id)
  }

  return group as FrameNode
}

function init() {
  const details = getDetails()
  const selectedFrames = figma.currentPage.selection.map(node => ({
    id: node.id,
    ...details[node.id]
  }))
  figma.ui.postMessage({
    type: 'selection-change',
    payload: {
      selectedFrames,
      details: getDetails(),
      stories: getStories(figma.currentPage.selection)
    }
  })
  selection = figma.currentPage.selection
}

function getDetails(): Details {
  let json = figma.currentPage.getPluginData('details')
  const parsed = json ? JSON.parse(json) : {}
  Object.entries<Detail>(parsed).forEach(([key, entry]) => {
    parsed[key] = {
      ...parsed[key],
      name: figma.currentPage.findOne(item => item.id === entry.id).name
    }
  })
  return parsed
}

function getStories(frames: readonly SceneNode[]) {
  if (frames.length !== 1) return 0
  let stories = figma.currentPage.getPluginData(`stories.${frames[0].id}`) || []

  return typeof stories === 'string' ? JSON.parse(stories) : []
}

function handleSelectionChange() {
  if (selection.map(item => item.id).join(',') === figma.currentPage.selection.map(item => item.id).join(',')) {
    return
  }
  const details = getDetails()
  const selectedFrames = figma.currentPage.selection.map(node => ({
    id: node.id,
    ...details[node.id]
  }))
  figma.ui.postMessage({
    type: 'selection-change',
    payload: {
      selectedFrames,
      details: getDetails(),
      stories: getStories(figma.currentPage.selection)
    }
  })
  selection = figma.currentPage.selection
}

async function handelRejectionReasonUpdate(message: Message) {
  const details = getDetails()
  const node = selection[0]
  details[node.id].rejectionReason = message.payload.rejectionReason
  figma.currentPage.setPluginData('details', JSON.stringify(details))
}
async function handelFrameDetailsUpdate(message: Message) {
  await figma.loadFontAsync({family: 'Roboto', style: 'Black'})
  const FRAME_WIDTH = 40
  const FRAME_HEIGHT = 40
  const details = getDetails()
  const group = getStatusesGroup()

  selection.forEach(node => {
    if (message.payload.status === '' && details[node.id]) {
      const frame = figma.currentPage.findOne(item => item.id === details[node.id].frameId)
      if (frame) {
        frame.remove()
      }
      delete details[node.id]
      return
    }
    let frame: FrameNode
    if (details[node.id]) {
      frame = figma.currentPage.findOne(item => item.id === details[node.id].frameId) as FrameNode
    } else {
      details[node.id] = {
        id: node.id
      }
    }
    frame = frame || figma.createFrame()
    frame.name = ' '
    frame.x = node.x + node.width - FRAME_WIDTH
    frame.y = node.y - FRAME_HEIGHT - 10
    frame.backgrounds = [{type: 'SOLID', color: {r: 0, g: 0, b: 0}, visible: false}]
    frame.resizeWithoutConstraints(FRAME_WIDTH, FRAME_HEIGHT)
    frame.children.map(item => item.remove())

    const status = figma.createEllipse()
    status.resizeWithoutConstraints(40, 40)
    status.fills = [{type: 'SOLID', color: COLORS[message.payload.status]}]
    frame.appendChild(status)

    details[node.id].frameId = frame.id
    details[node.id].status = message.payload.status
    details[node.id].rejectionReason = message.payload.rejectionReason

    group.appendChild(frame)
  })

  figma.currentPage.setPluginData('details', JSON.stringify(details))
  figma.ui.postMessage({type: 'update-details', payload: getDetails()})
}
