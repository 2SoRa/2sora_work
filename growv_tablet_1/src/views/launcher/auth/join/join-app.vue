<template>
  <div class="auth join">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "joinApp",
  props: ['info']
}
</script>

<style scoped>
@import url('@/assets/css/launcher/auth/auth.css');
@import url('@/assets/css/launcher/auth/join.css');
</style>