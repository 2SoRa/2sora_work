import studyAxios from "@/common/study-axios";

const moment = require('moment');
const ACCESS_TOKEN_NAME = "accessToken";
const EXPIRED_TIME_NAME = "expiredTime";
const REFRESH_TOKEN_NAME = "refreshToken";

export default {
  getToken() {
    return localStorage.getItem(ACCESS_TOKEN_NAME);
  },
  getExpiredTime() {
    return localStorage.getItem(EXPIRED_TIME_NAME);
  },
  getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_NAME);
  },
  saveToken(token) {
    localStorage.setItem(ACCESS_TOKEN_NAME, token);
  },
  saveExpiredTime(expiredTime) {
    localStorage.setItem(EXPIRED_TIME_NAME, expiredTime);
  },
  saveRefreshToken(token) {
    localStorage.setItem(REFRESH_TOKEN_NAME, token);
  },
  destroyAll() {
    localStorage.removeItem(ACCESS_TOKEN_NAME);
    localStorage.removeItem(EXPIRED_TIME_NAME);
    localStorage.removeItem(REFRESH_TOKEN_NAME);
    localStorage.removeItem("vuex");
  },

  // 로컬스토리지 토큰 정보 저장
  saveAllToken(result) {
    this.saveToken(result.accessToken);
    this.saveExpiredTime(result.expiredTime);
    this.saveRefreshToken(result.refreshToken);
    studyAxios.defaults.headers.common['Authorization'] = "Bearer " + result.accessToken;
  },
  isExpired() {
    if (this.getExpiredTime() == null || this.getToken() == null)
      return true;

    const expiredTime = this.getExpiredTime();

    const expiredMoment = moment(expiredTime);
    let currentMoment = moment();

    const difference = moment.duration(expiredMoment.diff(currentMoment)).asSeconds();

    // 만료 30초 전일 경우 만료로 판단
    return difference <= 30;
  }
}