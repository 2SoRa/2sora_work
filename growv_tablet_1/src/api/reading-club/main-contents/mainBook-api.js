import studyAxios from "@/common/study-axios";

const resource = '/clientsvc/study/v1/sbook'
export default {
  //1일1권
  getTodayBook(payload) {
    return studyAxios.post(`${resource}/today`, payload)
  },
  //총 독서 수
  getTotalReading(payload) {
    return studyAxios.post(`${resource}/total`, payload)
  },
  //인기도서&슈퍼픽
  getPopularBookSuperpick(payload) {
    return studyAxios.post(`${resource}/main`, payload)
  },
  //자람나무 카운트
  getTotalReadingTree(sid) {
    return studyAxios.get(`${resource}/mission/${sid}`)
  },
  //스캔 정보 받아오기
  getVscanInfo(id,payload) {
    return studyAxios.post(`/clientsvc/study/v1/sbook/store/${id}`,payload);
  },
  //출석하기
  setAttend(payload){
    return studyAxios.post(`/clientsvc/study/v1/sbook/attend/save`,payload)
  }
}