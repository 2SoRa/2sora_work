import studyAxios from "@/common/study-axios";
const resource = '/clientsvc/study/v1/sbook/pick'

export default {
    getSuperPickMain(sid) {
        return studyAxios.get(`${resource}/${sid}/main`)
    },
    getSuperPickDetail(sid, pid) {
        return studyAxios.get(`${resource}/${sid}/${pid}`)
    },
    getSuperPickMonth(sid) {
        return studyAxios.get(`${resource}/${sid}/month`)
    },
    setSuperPickComplete(sid, pid) {
        return studyAxios.get(`${resource}/${sid}/fin/${pid}`)
    },
}