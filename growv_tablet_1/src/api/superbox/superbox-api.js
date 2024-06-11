import studyAxios from "@/common/study-axios";

export default {
    getMainList(data) {
        return studyAxios.post(`/clientsvc/study/v1/stw/superbox/main`, data);
    },
    getSubList(data) {
        return studyAxios.post(`/clientsvc/study/v1/stw/superbox/sub`, data);
    },
}