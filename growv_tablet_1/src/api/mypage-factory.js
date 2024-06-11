import noticeApi from '@/api/mypage/notice-api';
import faqApi from '@/api/mypage/faq-api';
import consultApi from '@/api/mypage/consult-api';
import vitaminApi from '@/api/mypage/vitamin-api';
import userInfoApi from '@/api/mypage/userInfo-api';
import sideApi from '@/api/mypage/side-api';
import attendApi from '@/api/mypage/attend-api';

const repositories = {
  noticeCode: noticeApi,
  faqCode: faqApi,
  consultCode: consultApi,
  vitaminCode: vitaminApi,
  userInfoCode: userInfoApi,
  sideCode: sideApi,
  attendCode: attendApi,
}

export default {
  get: (name) => repositories[name],
}