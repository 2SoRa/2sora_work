<template>
  <div class="auth">
    <!-- TODO: 로그인 전에는 설정화면이 나타나지 않을 수 있음. 현재는 display: none 상태    -->
    <authHeader></authHeader>
    <router-view class="auth-area"></router-view>
  </div>
</template>

<script>
import authHeader from '@/views/launcher/auth/layout/auth-header';

export default {
  components: {
    authHeader,
  },
}
</script>

<style scoped>
@import url('@/assets/css/launcher/auth/auth.css');
</style>