
const englishLibraryStore = {
  namespaced: true,
  state: {
    engCategory: '',
    engSubCategory:'',
    selLevel:''
  },
  getters: {
    getEngCategory(state) {
      return state.engCategory;
    },
    getEngSubCategory(state) {
      return state.engSubCategory;
    },
    getSelLevel(state) {
      return state.selLevel;
    }
  },
  mutations: {
    updateEngCategory(state, name) {
      state.engCategory = name;
    },
    updateEngSubCategory(state, info) {
      state.engSubCategory = info;
    },
    updateSelLevel(state,step) {
      state.selLevel = step
    }
  },
};
export default englishLibraryStore;
