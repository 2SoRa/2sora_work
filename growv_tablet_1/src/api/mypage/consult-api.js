import studyAxios from "@/common/study-axios";

export default {
    getList(payload) {
        return studyAxios.post(`/clientsvc/study/v1/stw/mypage/qna/list`, payload);
    },
    getDetail(id) {
        return studyAxios.get(`/clientsvc/study/v1/stw/mypage/qna/info/${id}`);
    },
    register(payload) {
        return studyAxios.post(`/clientsvc/study/v1/stw/mypage/qna/info`, payload);
    },
    delete(id) {
        return studyAxios.delete(`/clientsvc/study/v1/stw/mypage/qna/${id}`);
    },
}