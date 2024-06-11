<template>
  <div class="auth login">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
    }
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

@import url('@/assets/css/launcher/auth/auth.css');
</style>