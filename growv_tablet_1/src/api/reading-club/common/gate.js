import studyAxios from "@/common/study-axios";

const resource = '/clientsvc/study/v1/launcher';
export default {
    // 가입 유형 확인
    getUserProduct(id) {
        return studyAxios.post(`${resource}/user/getUserProducts`,id)
    },
    // 슈퍼브이체험 상태 확인
    getUserSuperVstate(sid) {
        return studyAxios.get(`${resource}/superv/exp/member/${sid}`)
    },
    // 슈퍼브이체험 상태 확인
    getUserReadingstate(sid) {
        return studyAxios.get(`${resource}/reading/exp/member/${sid}`)
    },
    // 체험 신청
    doExp(payload) {
        return studyAxios.post(`${resource}/exp/info`,payload);
    },
    // 구매상담 신청
    doBuy(payload) {
        return studyAxios.post(`${resource}/consult/inquiry`,payload);
    },
    // 보호자 핸드폰 번호
    getParentPhone(payload) {
        return studyAxios.post('/clientsvc/study/v1/stw/plan/studyParenSmsInfo',payload)
    },
    // 스터디 신청여부 확인
    getIsInquiry(payload) {
        return studyAxios.post(`${resource}/consult/inquiry/info/count`,payload)
    }
}