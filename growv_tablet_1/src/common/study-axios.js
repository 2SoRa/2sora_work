import * as axios from "axios";
import {requestReissue} from "@/api/auth/auth-api"
import jwt from "@/common/jwt"

const studyAxios = axios.create({
    baseURL: '/',
    headers: {
        'Pragma': 'no-cache', 'Cache-Control': "no-cache, no-store, must-revalidate", 'Expires': '-1',
    }
});

studyAxios.interceptors.request.use(
    function (config) {
        config.headers.Authorization = "Bearer " + jwt.getToken();
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

studyAxios.interceptors.response.use(
    function (response) {
        const result = response.data;
        if(result.code == "-401"){
            console.log("-401 = ", result);
            jwt.destroyAll();
            document.location.href = "/login.html";
        }else if(result.code == "401"){
            console.log("400 = ", result);
        }
        return response;
    },
    async function (error) {
        if (error.response != null) {
            const originalRequest = error.config;
            if (error.response.status === 401) {
                let code = error.response.data.code;
                try {
                    if (code === "EXPIRED") {
                        const accessToken = await requestReissue();
                        originalRequest.headers.Authorization = "Bearer " + accessToken;
                        return studyAxios(originalRequest);
                    } else if (code === "-401") {
                        const url = window.location.href;
                        if (!(url.indexOf("/login.html") > -1)) {
                            jwt.destroyAll();
                            document.location.href = "/login.html";
                        }
                    }
                } catch (error2) {
                    alert("로그인 정보가 유효하지 않습니다. 다시 로그인 해주세요");
                    jwt.destroyAll();
                    document.location.href = "/login.html";
                    return Promise.reject(error2);
                }
            } else {
                if (error.response.data.message) {
                    // alert(error.response.data.message);
                    // alert("회원님의 정보가 유효하지 않습니다. 고객센터에 문의해주시기 바랍니다.");
                }
            }
        }
        return Promise.reject(error);
    }
)


export default studyAxios