const userProductStore = {
    namespaced : true,
    state:{
        product:null
    },
    getters: {
        getProductInfo(state) {
            return state.product;
        },
    },
    mutations: {
        updateProductInfo(state, product) {
            state.product = product;
        },
    },
}

export default  userProductStore