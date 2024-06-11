import studyAxios from "@/common/study-axios";
const resource = `/clientsvc/study/v1/sbook/library/eng`;

export default {
    getEngReadCount(id) {
      return studyAxios.get(`${resource}/${id}/count`)
    },
    getKEngKeywords() {
      return studyAxios.get(`${resource}/material/list`)
    },
    getEngPublisher(){
      return studyAxios.get(`${resource}/publisher/list`)
    },
    getEngMotion(payload) {
      return studyAxios.post(`${resource}/motion/list`,payload)
    },
    getEngLibraryData(payload) {
      return studyAxios.post(`${resource}/list`,payload)
    },
    getEngLibrarySearch(payload) {
      return studyAxios.post(`${resource}/search`,payload)
    }

}