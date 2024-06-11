import studyAxios from "@/common/study-axios";

const resource = '/clientsvc/study/v1/sbook/storage';
export default {
  getTodayBookList(payload) {
    return studyAxios.post(`${resource}/plan/list`, payload)
  },
  getStorageList(payload) {
    return studyAxios.post(`${resource}/keep/list`, payload)
  },
  getVscanList(payload) {
    return studyAxios.post(`${resource}/scan/list`, payload)
  }
}