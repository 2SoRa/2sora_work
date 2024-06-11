import studyAxios from "@/common/study-axios";

export default {
    checkPassword(payload) {
        return studyAxios.post(`/clientsvc/account/v1/web/user/mypage/login`, payload);
    },
    getUserInfo(id) {
        return studyAxios.get(`/clientsvc/study/v1/stw/mypage/${id}/info`);
    },
    updateUserInfo(payload) {
        return studyAxios.put(`/clientsvc/study/v1/stw/mypage/member/info`, payload);
    },
    updatePhoneNum(payload) {
        return studyAxios.put(`/clientsvc/study/v1/stw/mypage/mdn`, payload);
    },
    checkAuthNum(payload) {
        return studyAxios.post(`/clientsvc/account/v1/web/sms/cert/send/mypage`, payload);
    },
}