import studyAxios from "@/common/study-axios";
const resource = '/clientsvc/study/v1/sbook/report'

export default {
  getSuperBookWeek(payload) {
    return studyAxios.post(`${resource}/week`,payload)
  },
  getSuperBookMonth(payload) {
    return studyAxios.post(`${resource}/month`,payload)
  }
}