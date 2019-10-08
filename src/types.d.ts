type Story = {
  id: string
  isDone: boolean
  content: string
}
type SelectedFrame = {
  id: string
  status: {
    name: string
    frameId: string
  }
}
type Detail = {
  id?: string
  status?: string
  frameId?: string
  rejectionReason?: string
  name?: string
}
type Details = {
  [frameId: string]: Detail
}
type Message = {
  id: string
  type: string
  payload: any
}
