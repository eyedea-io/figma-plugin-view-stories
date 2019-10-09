const requests = new Set()

export const post = function<Response>(type: string, payload?: any): Promise<Response> {
  return new Promise(resolve => {
    const id = Math.random().toString(32)
    requests.add(id)
    const handleResponse = ev => {
      const isResponse = ev.data.pluginMessage && ev.data.pluginMessage.type === 'response'
      if (isResponse && requests.has(ev.data.pluginMessage.id) && ev.data.pluginMessage.id === id) {
        resolve(ev.data.pluginMessage.payload)
        window.removeEventListener('message', handleResponse, false)
      }
    }
    window.addEventListener('message', handleResponse, false)
    parent.postMessage(
      {
        pluginMessage: {type, payload, id}
      },
      '*'
    )
  })
}

export const toFigmaColor = ({r, g, b}) => ({
  r: r / 255,
  g: g / 255,
  b: b / 255
})
export const toRgbString = ({r, g, b}) => `rgb(${r}, ${g}, ${b})`
export const STATES = {
  DRAFT: 'draft',
  IN_PROGRESS: 'in-progress',
  IN_REVIEW: 'in-review',
  REJECTED: 'rejected',
  ACCEPTED: 'accepted'
}
export const COLORS = {
  [STATES.DRAFT]: {r: 130, g: 130, b: 130},
  [STATES.IN_PROGRESS]: {r: 242, g: 201, b: 76},
  [STATES.IN_REVIEW]: {r: 24, g: 144, b: 255},
  [STATES.REJECTED]: {r: 235, g: 87, b: 87},
  [STATES.ACCEPTED]: {r: 111, g: 207, b: 151}
}
export const COLORS_FIGMA = {
  [STATES.DRAFT]: toFigmaColor(COLORS[STATES.DRAFT]),
  [STATES.IN_PROGRESS]: toFigmaColor(COLORS[STATES.IN_PROGRESS]),
  [STATES.IN_REVIEW]: toFigmaColor(COLORS[STATES.IN_REVIEW]),
  [STATES.REJECTED]: toFigmaColor(COLORS[STATES.REJECTED]),
  [STATES.ACCEPTED]: toFigmaColor(COLORS[STATES.ACCEPTED])
}
export const COLORS_RGB = {
  [STATES.DRAFT]: toRgbString(COLORS[STATES.DRAFT]),
  [STATES.IN_PROGRESS]: toRgbString(COLORS[STATES.IN_PROGRESS]),
  [STATES.IN_REVIEW]: toRgbString(COLORS[STATES.IN_REVIEW]),
  [STATES.REJECTED]: toRgbString(COLORS[STATES.REJECTED]),
  [STATES.ACCEPTED]: toRgbString(COLORS[STATES.ACCEPTED])
}
export const STATUS_TEXT = {
  [STATES.DRAFT]: 'Draft',
  [STATES.IN_PROGRESS]: 'In progress',
  [STATES.IN_REVIEW]: 'In review',
  [STATES.REJECTED]: 'Rejected',
  [STATES.ACCEPTED]: 'Accepted'
}
export const STATUS_WEIGHT = {
  [STATES.DRAFT]: 1,
  [STATES.IN_PROGRESS]: 2,
  [STATES.IN_REVIEW]: 3,
  [STATES.ACCEPTED]: 4,
  [STATES.REJECTED]: 5
}
