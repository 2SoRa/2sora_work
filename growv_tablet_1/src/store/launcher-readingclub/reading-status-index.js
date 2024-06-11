const readingStatusStore = {
  namespaced: true,

  state: {
    date: '',
    isPause:false
  },

  getters: {
    getDate(state) {
      return state.date;
    },
    getPause(state){
      return state.isPause;
    }
  },

  mutations: {
    updateDate(state, date) {
      state.date = date;
    },
    updateIsPause(state,boolean) {
      state.date = boolean;

    }
  },

  actions: {
  }
}

export default readingStatusStore