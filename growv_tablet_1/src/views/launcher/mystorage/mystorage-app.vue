<template>
  <div>
    <router-view v-if="userInfo.isAuthenticated"></router-view>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
  name: 'SuperboxApp',
  data() {
    return {
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

@import url('@/assets/css/reset.css');
@import url('@/assets/css/launcher/font.css');
@import url('@/assets/css/vue-select.css');
@import url('@/assets/css/launcher/common.css');
@import url('@/assets/css/launcher/layout.css');
/*@import url('@/assets/css/launcher/superbox/superbox.css');*/
@import url('@/assets/css/launcher/storage/storage.css');
</style>