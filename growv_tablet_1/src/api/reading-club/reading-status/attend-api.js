import studyAxios from "@/common/study-axios";

export default {
    getAttendInfo(payload) {
        return studyAxios.post(`/clientsvc/study/v1/sbook/status/attend/info`,payload)
    }
}