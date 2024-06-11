import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import userStorage from '@/store/modules/userInfo'

export default createStore({
    modules: {
        userStorage,
    },
    plugins: [createPersistedState({
        paths: ['userStorage']
    })]
});