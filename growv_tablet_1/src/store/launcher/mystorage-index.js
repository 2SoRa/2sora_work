const mystorageStore = {
  namespaced: true,

  state: {
    link: '',
    subjectDiv: '',
    storageDiv: '',

    year: '',
    month: '',
  },

  getters: {
    getLink(state) {
      return state.link;
    },
    getSubjectDiv(state) {
      return state.subjectDiv;
    },
    getStorageDiv(state) {
      return state.storageDiv;
    },
    getYear(state) {
      return state.year;
    },
    getMonth(state) {
      return state.month;
    },
  },

  mutations: {
    storeStorageDiv(state, payload) {
      state.link = payload.link;
      state.subjectDiv = payload.subjectDiv;
      state.storageDiv = payload.storageDiv;
    },
    resetStorageDiv(state) {
      state.link = '';
      state.subjectDiv = '';
      state.storageDiv = '';
    },
    storeChangeDate(state, payload) {
      state.year = payload.year;
      state.month = payload.month;
    },
    resetChangeDate(state) {
      state.year = '';
      state.month = '';
    },
  },

  actions: {
  }
}

export default mystorageStore