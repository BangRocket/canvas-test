export const state = () => ({
  bg: null,
  item: null,
  hit: null,
  overlay: null,
  text: null,
  registered: {}
})

export const mutations = {
  setContext(state, payload) {
    // layer: target layer, context: canvas 2d context
    state[payload.layer] = payload.context
  },
  registerCanvasElement(state, payload) {
    // id: element id of component, element: element of component
    state.registered[payload.id] = payload.element
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
  },
  getContext(state) {
    return (id) => {
      return state[id]
    }
  }
}
