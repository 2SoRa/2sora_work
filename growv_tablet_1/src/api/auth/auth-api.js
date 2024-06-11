import studyAxios from "@/common/study-axios";
import jwt from "@/common/jwt"

// 토큰 재발급처리
async function requestReissue() {
    const config = {
        headers: {
            "X-AUTH-TOKEN": jwt.getToken(),
            "X-REFRESH-TOKEN": jwt.getRefreshToken()
        }
    }

    await studyAxios.get("/clientsvc/account/v1/web/user/reissue", config).then((res) => {
        const result = res.data;
        if (result.code === '200') {
            jwt.saveAllToken(result.data);

            return result.data.accessToken;
        } else {
            console.log("[reissue]", res.data.message);
            jwt.destroyAll();
            document.location.href="/login.html";
        }
    }).catch((error) => {
        console.log("[reissue error]", error)
    });
}

// 토큰 상태 체크
function authStatusCheck() {
    return studyAxios.get("/clientsvc/account/v1/web/user/token");
}

// 로그아웃
async function logout() {
    const config = {
        headers: {
            "X-AUTH-TOKEN": jwt.getToken()
        }
    }

    await studyAxios.post("/clientsvc/account/v1/web/user/logout", null, config).then((res) => {
        const data = res.data;
        if (data.code === '200') {
            console.log("로그아웃")
        } else {
            console.log("[logout fail]", data.message);
        }
    }).catch((error) => {
        console.log("[logout fail]", error)
    }).finally(() => {
        jwt.destroyAll();
        document.location.href="/login.html";
    });
}

// 로그인
async function login(credentials) {
    return await studyAxios.post("/clientsvc/account/v1/stw/superv/login", credentials);
}

// 임시회원 일반회원 전환
function changeTempUser(data) {
    return studyAxios.post("/clientsvc/account/v1/stw/superv/temp/change", data);
}

// 이메일 중복 체크
function dupCheckUser(email) {
    const data = {
        email: email
    }
    return studyAxios.get("/clientsvc/account/v1/web/user/email/dup", data);
}

// 로그인정보 조회
function userInfo() {
    return studyAxios.get("/clientsvc/account/v1/stw/superv/user/info");
}

// ID찾기 회원정보 조회
function searchId(data){
    return studyAxios.post("/clientsvc/account/v1/web/user/search/id", data);
}

// 비밀번호찾기 회원정보 조회
function searchPw(data){
    return studyAxios.post("/clientsvc/account/v1/web/user/search/pw", data);
}

function changePw(data){
    return studyAxios.post("/clientsvc/account/v1/web/user/pw", data);
}

async function allReissue(){
    return await studyAxios.get("/clientsvc/account/v1/stw/superv/allReissue");
}


// TODO 정상기기 체크(도난기기, 자가기기 아님 등등)

// TODO 주문상태 체크(미납/해지/만료) => 현재 회원상태코드로만 체크중

export {requestReissue, allReissue, authStatusCheck, logout, login, userInfo, dupCheckUser, changeTempUser, searchId, searchPw, changePw};