const superBoxStore = {
  namespaced: true,

  state: {
    listStep: null,
  },

  getters: {
    getListStep(state) {
      return state.listStep;
    },
  },

  mutations: {
    storeListStep(state, list) {
      state.listStep = list;
    },
  },

  actions: {
  }
}

export default superBoxStore