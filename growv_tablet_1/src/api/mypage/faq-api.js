import studyAxios from "@/common/study-axios";

export default {
    getList(payload) {
        return studyAxios.post(`/clientsvc/study/v1/stw/mypage/faq/list`, payload);
    },
    getDetail(id) {
        return studyAxios.get(`/clientsvc/study/v1/stw/mypage/faq/info/${id}`);
    },
}