import studyAxios from "@/common/study-axios";
const resource = `/clientsvc/study/v1/sbook/storage/keep`;

export default {
    deleteStorage(payload) {
      return studyAxios.post(`${resource}/remove`,payload)
    },
    saveStorage(payload) {
      return studyAxios.post(`${resource}/save`,payload)
    }
}