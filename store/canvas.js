export const state = () => ({
  bg: null,
  item: null,
  hit: null,
  overlay: null,
  text: null
})

export const mutations = {
  setContext(state, payload) {
    // console.log('STATE: ', state, payload)
    state[payload.layer] = payload.context
  }
}

export const getters = {
  getBackgroundContext(state) {
    return state.bg
  },
  getHitContext(state) {
    return state.hit
  },
  getOverlayContext(state) {
    return state.overlay
  },
  getTextContext(state) {
    return state.text
  },
  getItemContext(state) {
    return state.item
  }
}
