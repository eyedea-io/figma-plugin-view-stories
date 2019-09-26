import {STATUSES, COLORS, STATUS_TEXT} from './helpers'

figma.showUI(__html__, {
  height: 600
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
    case 'update-frame-status':
      return handelFrameStatusUpdate(msg)
    case 'add-story':
      return handleAddStory(msg)
    case 'toggle-story':
      return handleToggleStory(msg)
    case 'remove-story':
      return handleRemoveStory(msg)
    default:
      break
  }

  // if (msg.type === 'create-rectangles') {
  //   const nodes = []

  //   for (let i = 0; i < msg.count; i++) {
  //     const rect = figma.createRectangle()
  //     rect.x = i * 150
  //     rect.fills = [{type: 'SOLID', color: {r: 1, g: 0.5, b: 0}}]
  //     figma.currentPage.appendChild(rect)
  //     nodes.push(rect)
  //   }

  //   figma.currentPage.selection = nodes
  //   figma.viewport.scrollAndZoomIntoView(nodes)
  // }
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

function init() {
  const statuses = getStatuses()
  const selectedFrames = figma.currentPage.selection.map(node => ({
    id: node.id,
    status: statuses[node.id]
  }))
  figma.ui.postMessage({
    type: 'selection-change',
    payload: {
      selectedFrames,
      stories: getStories(figma.currentPage.selection)
    }
  })
  selection = figma.currentPage.selection
}

function getStatuses() {
  let statuses = figma.currentPage.getPluginData('statuses')
  return statuses ? JSON.parse(statuses) : {}
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
  const statuses = getStatuses()
  const selectedFrames = figma.currentPage.selection.map(node => ({
    id: node.id,
    status: statuses[node.id]
  }))
  figma.ui.postMessage({
    type: 'selection-change',
    payload: {
      selectedFrames,
      stories: getStories(figma.currentPage.selection)
    }
  })
  selection = figma.currentPage.selection
}

async function handelFrameStatusUpdate(message: Message) {
  await figma.loadFontAsync({family: 'Arial', style: 'Bold'})
  const FRAME_WIDTH = 120
  const FRAME_HEIGHT = 30

  let statuses = figma.currentPage.getPluginData('statuses')
  statuses = statuses ? JSON.parse(statuses) : {}
  selection.forEach(node => {
    if (message.payload === '' && statuses[node.id]) {
      const frame = figma.currentPage.findOne(item => item.id === statuses[node.id].frameId)
      if (frame) {
        frame.remove()
      }
      delete statuses[node.id]
      return
    }
    let frame: FrameNode
    if (statuses[node.id] && statuses[node.id]) {
      frame = figma.currentPage.findOne(item => item.id === statuses[node.id].frameId) as FrameNode
    }
    frame = frame || figma.createFrame()
    frame.name = ' '
    frame.x = node.x + node.width - FRAME_WIDTH
    frame.y = node.y - FRAME_HEIGHT - 10
    frame.resizeWithoutConstraints(FRAME_WIDTH, FRAME_HEIGHT)
    frame.backgrounds = [{type: 'SOLID', color: COLORS[message.payload]}]
    if (frame.children.length === 0) {
      const text = figma.createText()
      text.fontName = {family: 'Arial', style: 'Bold'}
      text.fontSize = 12
      text.fills = [{type: 'SOLID', color: {r: 1, g: 1, b: 1}}]
      text.textAlignHorizontal = 'CENTER'
      text.textAlignVertical = 'CENTER'
      text.characters = STATUS_TEXT[message.payload]
      text.x = 0
      text.y = 0
      text.resizeWithoutConstraints(FRAME_WIDTH, FRAME_HEIGHT)
      frame.appendChild(text)
    } else if (frame.children[0]) {
      ;(frame.children[0] as TextNode).characters = STATUS_TEXT[message.payload]
    }
    statuses[node.id] = {
      name: message.payload,
      frameId: frame.id
    }
    figma.currentPage.appendChild(frame)
  })
  figma.currentPage.setPluginData('statuses', JSON.stringify(statuses))
}
