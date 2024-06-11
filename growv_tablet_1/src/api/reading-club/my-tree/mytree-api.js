import studyAxios from "@/common/study-axios";
const resource = '/clientsvc/study/v1/sbook/mission'

export default {
  getTreeYear(sid, year) {
    return studyAxios.get(`${resource}/map/${sid}/${year}`)
  },
  getTreeMonth(sid,year,month) {
    return studyAxios.get(`${resource}/${sid}/${year}/${month}`)
  }
}