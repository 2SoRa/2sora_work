import studyAxios from "@/common/study-axios";

export default {
    viewComplete(bookId, params){
        return studyAxios.post(`/clientsvc/study/v1/sbook/viewer/${bookId}`,params)
    },
    buyVscanBook(bookId,params){
        return studyAxios.post(`/clientsvc/study/v1/sbook/viewer/buy/${bookId}`,params)
    }
}