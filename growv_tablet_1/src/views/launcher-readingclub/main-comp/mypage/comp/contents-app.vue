<template>
  <div class="mypage reading-club">
    <div class="sub-gnb">
      <div class="sub-gnb-left">
        <button type="button" class="btn-back"><router-link :to="{ name : 'ReadingClubMainView' }"></router-link></button>
      </div>
      <h1>마이페이지</h1>
      <div class="sub-gnb-right">
        <button type="button" class="btn-close"><router-link :to="{ name : 'ReadingClubMainView' }"></router-link></button>
      </div>
    </div>
    <div class="content">
      <sideMenu />
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import sideMenu from "./side-menu.vue";

export default {
  name: "",
  components: { sideMenu },
};
</script>

<style>
/* @import url("@/assets/css/launcher/mypage/mypage.css");*/
</style>
