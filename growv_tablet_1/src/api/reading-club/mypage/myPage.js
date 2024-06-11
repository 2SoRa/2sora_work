import studyAxios from "@/common/study-axios";
const resource = `/clientsvc/study/v1/sbook/mypage`;

export default {
    getShoppingPoint(id) {
        return studyAxios.get(`${resource}/point/${id}`)
    },
    getShoppingPointList(params) {
        return studyAxios.post(`${resource}/point/list`,params)
    },
    getGrowTreeList(params) {
        return studyAxios.post(`${resource}/mission/info`,params)
    },

}