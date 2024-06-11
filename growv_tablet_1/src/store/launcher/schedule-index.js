const scheduleStore = {
  namespaced: true,

  state: {
    detailList: [],
    regCourseItem: {},
    parentSmsInfo: '',
    parentAuthDiv: '',
  },

  getters: {
    getDetailList(state) {
      return state.detailList;
    },
    getRegCourseItem(state) {
      return state.regCourseItem;
    },
    getParentSmsInfo(state) {
      return state.parentSmsInfo;
    },
    getParentAuthDiv(state) {
      return state.parentAuthDiv;
    },
  },

  mutations: {
    storeDetailList(state, list) {
      state.detailList = list;
    },
    storeRegCourseItem(state, item) {
      state.regCourseItem = item;
    },
    storeParentSmsInfo(state, info) {
      state.parentSmsInfo = info;
    },
    storeParentAuthDiv(state, authDiv) {
      state.parentAuthDiv = authDiv;
    },
  },

  actions: {

  }
}

export default scheduleStore