<template>
  <div>
    <router-view v-if="userInfo.isAuthenticated"></router-view>
    <confirmModal :propsData="{confirmShowModal, message, isLogin}" @closePopup="closeConfirmPopup"></confirmModal>
  </div>
</template>

<script>
import {mapGetters, mapActions} from "vuex";
// import jwt from "@/common/jwt"
// import {requestReissue} from "@/api/auth/auth-api";

import confirmModal from '../common/comp/comp-common-popup/common-login-confirm-popup';

export default {
  name: 'ScheduleApp',
  components: {
    confirmModal,
  },
  data() {
    return {
      confirmShowModal: false,
      message: '',
      isLogin: false,
    }
  },
  created() {
    // TODO: 리이슈 처리 주석
    /*if (jwt.isExpired()) {
      if (jwt.getToken()) {
        requestReissue();
      }
    }*/

    this.loadUserInfo();
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  methods: {
    ...mapActions(['loadUserInfo']),

    // 팝업
    // 알럿팝업 열기
    openConfirmPopup() {
      this.confirmShowModal = true;
      document.querySelector('body').style.overflow = 'hidden';
    },
    //  알럿팝업 닫기
    closeConfirmPopup() {
      this.confirmShowModal = false;
      document.querySelector('body').style.overflow = 'auto';
    },
  },
}
</script>

<style>
#app {
  font-family: sdGothicNR, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0;
  padding: 0;
}

  @import url('@/assets/css/reset.css');
  @import url('@/assets/css/launcher/font.css');
  @import url('@/assets/css/vue-select.css');
  @import url('@/assets/css/launcher/common.css');
  @import url('@/assets/css/launcher/layout.css');
  @import url('@/assets/css/launcher/calendar/calendar.css');
</style>