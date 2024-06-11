import {userInfo} from "@/api/auth/auth-api"
import jwt from "@/common/jwt"

const userStore = {
    namespace: true,
    state: {
        isAuthenticated: false,
        userInfo: {}
    },

    getters: {
        userInfo(state) {
            return {
                'isAuthenticated': state.isAuthenticated,
                'info': state.userInfo
            }
        },
        isAuthenticated(state) {
            return state.isAuthenticated;
        }
    },
    mutations: {
        updateUserInfo(state, result) {
            state.isAuthenticated = result.data.parentId !== null ? true : false;
            state.userInfo = result.data.parentId ? result.data : {};
        },
        loggedOut(state) {
            state.isAuthenticated = false;
            state.userInfo = {}
        }
    },

    actions: {
        loadUserInfo: ({commit}) => {
            if(jwt.getToken()) {
                userInfo().then((res) => {
                    const result = res.data;
                    if (result.code === '200') {
                        commit('updateUserInfo', result);
                    }
                }).catch((reason) => {
                    if (reason.response.status >= 400 && reason.response.status <= 500) {
                        jwt.destroyAll();
                        // eslint-disable-next-line
                        clearGrowvApp();
                        if (!(window.location.href.indexOf("/login.html") > -1)) {
                            document.location.href = "/login.html";
                        }
                    }
                });
            }else{
                jwt.destroyAll();
                // eslint-disable-next-line
                clearGrowvApp();
                if (!(window.location.href.indexOf("/login.html") > -1)) {
                    document.location.href = "/login.html";
                }
            }
        }
    }
}

export default userStore
