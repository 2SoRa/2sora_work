import studyAxios from "@/common/study-axios";
const resource = '/clientsvc/study/v1/sbook/library/kor';

export default {
  getKorReadCount(sid) {
    return studyAxios.get(`${resource}/${sid}/count`)
  },
  getKorKeywords() {
    return studyAxios.get(`${resource}/material/list`)
  },
  getKorPublisher() {
    return studyAxios.get(`${resource}/publisher/list`)
  },
  getKorLibrary(payload) {
    return studyAxios.post(`${resource}/list`,payload)
  },
  getKorLibrarySearch(payload) {
    return studyAxios.post(`${resource}/search`,payload)
  }
}