import studyAxios from "@/common/study-axios";
const resource = `/clientsvc/study/v1/sbook/status/activity`

export default {
    getActivityCalendarDetail(payload) {
        return studyAxios.post(`${resource}/calendar/dtl`,payload)
    },
    getReadingList(payload) {
        return studyAxios.post(`${resource}/list/info`,payload)
    },
    getActivityCalendar(payload) {
        return studyAxios.post(`${resource}/calendar/info`,payload)
    }
}