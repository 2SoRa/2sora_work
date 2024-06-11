<template>
  <div class="mypage">
    <div class="gnb">
      <div class="gnb-title">
        <img src="@/assets/img/launcher/mypage/mp_sub_navi_ico_l.png" alt="deco">
        <p>마이페이지</p>
        <img src="@/assets/img/launcher/mypage/mp_sub_navi_ico_r.png" alt="deco">
      </div>
      <div class="gnb-right">
        <button class="btn" @click="closeMypage()">
          <img src="@/assets/img/launcher/mypage/mp_navi_btn_close_b.png" alt="close">
        </button>
      </div>
    </div>
    <div class="content">
      <side-menu></side-menu>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import {mapActions} from "vuex";
import sideMenu from './side-menu'

export default {
  name: '',
  components: {
    sideMenu,
  },
  created() {
    this.loadUserInfo();
  },
  methods : {
    ...mapActions(['loadUserInfo']),

    closeMypage(){
      // eslint-disable-next-line
      goGrowvAppPage("main");
    }
  }
}
</script>

<style>
  @import url('@/assets/css/launcher/mypage/mypage.css');
</style>