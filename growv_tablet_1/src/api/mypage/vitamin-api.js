import studyAxios from "@/common/study-axios";

export default {
    getHistoryVita(payload) {
        return studyAxios.post(`/clientsvc/study/v1/stw/mypage/vita/list`, payload);
    },
    statusInfoVita(payload) {
        return studyAxios.post(`/clientsvc/study/v1/stw/mypage/vita/info`, payload);
    },
}