export const post = (pluginMessage: any) => parent.postMessage({pluginMessage}, '*')
export const toFigmaColor = ({r, g, b}) => ({
  r: r / 255,
  g: g / 255,
  b: b / 255
})
export const figmaColorToRgbString = ({r, g, b}) => `rgb(${r * 255}, ${g * 255}, ${b * 255})`
export const STATES = {
  DRAFT: 'draft',
  IN_PROGRESS: 'in-progress',
  IN_REVIEW: 'in-review',
  REJECTED: 'rejected',
  ACCEPTED: 'accepted'
}
export const COLORS = {
  [STATES.DRAFT]: toFigmaColor({r: 130, g: 130, b: 130}),
  [STATES.IN_PROGRESS]: toFigmaColor({r: 242, g: 201, b: 76}),
  [STATES.IN_REVIEW]: toFigmaColor({r: 24, g: 144, b: 255}),
  [STATES.REJECTED]: toFigmaColor({r: 235, g: 87, b: 87}),
  [STATES.ACCEPTED]: toFigmaColor({r: 111, g: 207, b: 151})
}
export const STATUS_TEXT = {
  [STATES.DRAFT]: 'Draft',
  [STATES.IN_PROGRESS]: 'In progress',
  [STATES.IN_REVIEW]: 'In review',
  [STATES.REJECTED]: 'Rejected',
  [STATES.ACCEPTED]: 'Accepted'
}
