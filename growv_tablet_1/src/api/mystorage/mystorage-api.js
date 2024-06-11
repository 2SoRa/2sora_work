import studyAxios from "@/common/study-axios";

export default {
    getStudyList(data) {
        return studyAxios.post(`/clientsvc/study/v1/stw/inventory/study/act`, data);
    },
    getStoreList(data) {
        return studyAxios.post(`/clientsvc/study/v1/stw/inventory/study/my`, data);
    },
    addToInventory(data) {
        return studyAxios.post(`/clientsvc/study/v1/stw/inventory/lecture/add`, data);
    },
    delToInventory(data) {
        return studyAxios.post(`/clientsvc/study/v1/stw/inventory/lecture/del`, data);
    }
}