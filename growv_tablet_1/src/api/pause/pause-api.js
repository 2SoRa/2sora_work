import studyAxios from "@/common/study-axios";

export default {
    getInfo(payload) {
        return studyAxios.post(`/clientsvc/study/v1/stw/main/student/info`, payload);
    },
}