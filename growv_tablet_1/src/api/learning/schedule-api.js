import studyAxios from "@/common/study-axios";

const resource = '/clientsvc/study/v1/stw/plan';

export default {
    getList(payload) {
        return studyAxios.post(`${resource}/studyPlanList`, payload);
    },
    getStatusList(payload) {
        return studyAxios.post(`${resource}/studyPlanHistList`, payload);
    },
    getDetailConts(payload) {
        return studyAxios.post(`${resource}/studyPlanView`, payload);
    },
    getCourseByLevel(payload) {
        return studyAxios.post(`${resource}/studyBaseCourseCheck`, payload);
    },
    getCourseByLevelChoice(payload) {
        return studyAxios.post(`${resource}/studySelCourseCheck`, payload);
    },
    updateDefaultSchedule(payload) {
        return studyAxios.post(`${resource}/studyBasePlanUpdate`, payload);
    },
    loadCourseSubj(payload) {
        return studyAxios.post(`${resource}/studyCourseSubj`, payload);
    },
    loadCourseProg(payload) {
        return studyAxios.post(`${resource}/studyCourseProg`, payload);
    },
    loadCourseList(payload) {
        return studyAxios.post(`${resource}/studyPlanCourse`, payload);
    },
    getLectureByDay(payload) {
        return studyAxios.post(`${resource}/studySelPlanUpdatePre`, payload);
    },
    selectPlanLecture(payload) {
        return studyAxios.post(`${resource}/studySelPlanLecture`, payload);
    },
    preCheckRegister(payload) {
        return studyAxios.post(`${resource}/studyPlanSavePre`, payload);
    },
    register(payload) {
        return studyAxios.post(`${resource}/studyPlanSave`, payload);
    },
    delete(student_id, study_course_id) {
        return studyAxios.delete(`${resource}/studyPlanDelete?student_id=${student_id}&study_course_id=${study_course_id}`);
    },
    historyAuthParent(payload) {
        return studyAxios.post(`${resource}/studyParentHist`, payload);
    },
    loadParentSmsInfo(payload) {
        return studyAxios.post(`${resource}/studyParenSmsInfo`, payload);
    },
    sendParentAuthNum(payload) {
        return studyAxios.post(`${resource}/studyParenSmsSend`, payload);
    },
    checkParentAuthNum(payload) {
        return studyAxios.post(`${resource}/studyParenSmsSendCheck`, payload);
    },
    loadCourseDetailInfo(payload) {
        return studyAxios.post(`${resource}/courseLectureInfo`, payload);
    },
    loadLevelByProg(payload) {
        return studyAxios.post(`${resource}/studyCourseProgLevel`, payload);
    },
}