import studyAxios from "@/common/study-axios";
const resource = '/clientsvc/study/v1/sbook/store'

export default {
  getProductList(payload) {
    return studyAxios.post(`${resource}/product/list`, payload)
  },
  getProductDetail(payload) {
    return studyAxios.post(`${resource}/product/detail`, payload)
  },
  getProductSet(payload) {
    return studyAxios.post(`${resource}/set/list`, payload)
  },
  getProductSetDetail(payload) {
    return studyAxios.post(`${resource}/set/detail`, payload)
  },
  async getCartList(payload) {
    return await studyAxios.post(`${resource}/cart/get`,payload)
  },
  addCartItem(payload) {
    return studyAxios.post(`${resource}/cart/add`,payload)
  },
  deleteCartItem(payload) {
    return studyAxios.post(`${resource}/cart/remove`,payload)
  },
  deleteSetCartItem(payload) {
    return studyAxios.post(`${resource}/cart/remove2`,payload)
  },
  sendCartAlarm(payload) {
    return studyAxios.post(`${resource}/cart/confirm`,payload)
  },
  searchInit(payload) {
    return studyAxios.post(`${resource}/init`,payload)
  },
  getQrData(payload) {
    return studyAxios.get(`${resource}/product/qr/${payload}`, {
      responseType: "arraybuffer",
    });
  },
  getQrSetData(payload) {
    return studyAxios.get(`/clientsvc/study/v1/sbook/store/set/qr/${payload}`, {
      responseType: "arraybuffer",
    });
  }
}
