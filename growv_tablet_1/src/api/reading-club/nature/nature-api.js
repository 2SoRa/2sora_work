import studyAxios from "@/common/study-axios";
const resource = '/clientsvc/study/v1/sbook/theme'

export default {
  getNatureList(payload) {
    return studyAxios.post(`${resource}/list`,payload)
  },
  getNatureSearch(payload) {
    return studyAxios.post(`${resource}/search`,payload)
  }
}