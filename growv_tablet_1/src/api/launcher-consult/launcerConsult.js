import studyAxios from "@/common/study-axios";

export default {
    //슈퍼브이 체험 상태 확인
    checkSupervTrial(id) {
        return studyAxios.post(`/clientsvc/study/v1/launcher/superv/exp/member/${id}`)
    },
    //슈퍼리딩 체험 상태 확인
    checkReadingTrial(id) {
        return studyAxios.post(`/clientsvc/study/v1/launcher/reading/exp/member/${id}`)
    },
    //체험신청
    applyTrial(params) {
        return studyAxios.post(`/clientsvc/study/v1/launcher/exp/info`,params)
    },
    //구매상담
    applyConsult(params) {
        return studyAxios.post(`/clientsvc/study/v1/launcher/consult/inquiry`,params)
    }
}