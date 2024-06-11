<template>
  <div :class="{ 'korean-only' : !getIsEnglishMember }">
<!--  <div>-->
    <router-view v-if="userInfo.isAuthenticated"></router-view>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
  name: 'ReadingClubMainApp',
  created() {
    this.loadUserInfo();
  },
  computed: {
    ...mapGetters(['userInfo']),
    ...mapGetters('readingStorage',['getIsEnglishMember'])
  },
  methods: {
    ...mapActions(['loadUserInfo']),
  }
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

/* @import url('@/assets/css/reset.css');
@import url('@/assets/css/launcher/font.css');
@import url('@/assets/css/vue-select.css');
@import url('@/assets/css/launcher/common.css');*/
@import url('@/assets/css/launcher/layout.css');
/* @import url('@/assets/css/launcher-readingclub/gnb.css');
@import url('@/assets/css/launcher-readingclub/layout.css'); */
/* @import url('@/assets/css/launcher/superbox/superbox.css'); */

/* 08.30 SCSS 추가 */
/* reset, font, vue-select, gnb ======> webfont, reset, vue_select, modal, gnb */
</style>