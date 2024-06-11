import studyAxios from "@/common/study-axios";

export default {
    updateCharacter(payload) {
        return studyAxios.put(`/clientsvc/study/v1/stw/mypage/update/character`, payload);
    },
    modeNormal(payload) {
        return studyAxios.post(`/clientsvc/study/v1/stw/mypage/normal/agree`, payload);
    },
}