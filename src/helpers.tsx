export const post = (pluginMessage: any) => parent.postMessage({pluginMessage}, '*')

export const STATUSES = {
  IN_PROGRESS: 'in-progress',
  READY_FOR_REVIEW: 'ready-for-review',
  DONE: 'done'
}
export const COLORS = {
  [STATUSES.IN_PROGRESS]: {r: 0.0823529411764706, g: 0.3725490196078431, b: 0.803921568627451},
  [STATUSES.READY_FOR_REVIEW]: {r: 1, g: 0.5, b: 0},
  [STATUSES.DONE]: {r: 0.08235, g: 0.80392, b: 0.15294}
}
export const STATUS_TEXT = {
  [STATUSES.IN_PROGRESS]: 'In progress',
  [STATUSES.READY_FOR_REVIEW]: 'Ready for review',
  [STATUSES.DONE]: 'Done'
}
