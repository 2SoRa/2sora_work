<template>
  <div class="auth login">
    <div class="search">
      <div class="search-area">
        <div class="search-title" style="padding-top:440px;">
          <p class="title">로그인</p>
          <p class="content">로그인이 필요합니다. 로그인 해주세요.</p>
        </div>
        <div class="btn-wrap">
          <button class="btn btn-410">
            <a href="/login.html">로그인</a>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "moveLogin",
  data() {
    return {
    }
  },
  components: {
  },
  methods: {
  },
}
</script>

<style scoped>
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
@import url('@/assets/css/launcher/auth/login.css');
</style>