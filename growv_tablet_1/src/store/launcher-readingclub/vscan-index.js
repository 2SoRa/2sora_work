const vscanStore = {
  namespaced: true,
  state: {
    vscanBookInfo: null,
  },
  getters: {
    getVscanBookInfo(state) {
      return state.vscanBookInfo;
    },
  },
  mutations: {
    updateVscanBookInfo(state, info) {
      state.vscanBookInfo = info;
    }
  }
}

export default vscanStore