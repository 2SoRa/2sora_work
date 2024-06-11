const koreanLibraryStore = {
  namespaced: true,

  state: {
    korCategory: '',
    korSubCategory: '',
    age : ''
  },
  getters: {
    getKorCategory(state){
      return state.korCategory;
    },
    getKorSubCategory(state) {
      return state.korSubCategory;
    },
    getAge(state) {
      return state.age;
    }
  },
  mutations: {
    updateAge(state, age) {
      state.age = age;
    },
    updateKorCategory(state, name) {
      state.korCategory = name;
    },
    updateKorSubCategory(state, info) {
      state.korSubCategory = info;
    }
  },
  actions: {}
}

export default koreanLibraryStore