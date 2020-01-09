export const state = () => ({
  cells: []
})

export const mutations = {
  registerCell(state, payload) {
    state.cells.push(payload.data)
  },
  registerCells(state, payload) {
    state.cells = payload
  }
}

export const getters = {
  getCell(state, payload) {
    return state.cells[payload.id]
  },
  getCells(state) {
    return state.cells
  }
}
