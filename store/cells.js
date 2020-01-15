export const state = () => ({
  cells: [],
  hits: []
})

export const mutations = {
  registerCell(state, payload) {
    state.cells.push(payload.data)
  },
  registerCells(state, payload) {
    state.cells = payload
  },
  registerHit(state, payload) {
    state.hits.push(payload.data)
  },
  registerHits(state, payload) {
    state.hits = payload
  }
}

export const getters = {
  getCell(state, payload) {
    return state.cells[payload.id]
  },
  getCells(state) {
    return state.cells
  },
  getHit(state, payload) {
    return state.hits[payload.id]
  },
  getHits(state) {
    return state.hits
  }
}
