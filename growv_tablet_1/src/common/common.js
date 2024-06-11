import moment from "moment/moment";

const EXPIRED_TIME_NAME = "parentAuthExpiredTime";

export default {
  getParentAuthExpiredTime() {
    return localStorage.getItem(EXPIRED_TIME_NAME);
  },
  saveParentAuthExpiredTime(expiredTime) {
    localStorage.setItem(EXPIRED_TIME_NAME, expiredTime);
  },
  isParentAuthExpired() {
    if (this.getParentAuthExpiredTime() == null)
      return true;

    const expiredTime = this.getParentAuthExpiredTime();

    const expiredMoment = moment(expiredTime);
    let currentMoment = moment();
    const difference = moment.duration(currentMoment.diff(expiredMoment)).asSeconds();

    // 만료 30초 전일 경우 만료로 판단
    return difference <= 30;
  }
}