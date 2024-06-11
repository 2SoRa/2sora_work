import studyAxios from "@/common/study-axios";

export default {
    getInfo(payload) {
        return studyAxios.post(`/clientsvc/study/v1/stw/mypage/attend/Info`, payload);
    },
}