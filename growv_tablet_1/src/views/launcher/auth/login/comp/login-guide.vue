<template>
  <div class="login-guide">
    <p class="title">로그인 전 꼭 읽어보세요!</p>
    <p class="guide-content">기기를 이용하게 될 <span>실제 학습자로 로그인</span>해주세요!<br>
      기기에서 최초 로그인한 회원이 슈퍼V를 사용하는 회원으로 등록됩니다.<br>
      형제, 친구 등 타인이 최초로 로그인을 하는 경우가 없도록 주의해 주세요.
    </p>
    <div class="btn-wrap">
      <button class="btn btn-460">
        <router-link :to="{ name:'loginMain' }">
          시작하기
        </router-link>
      </button>
    </div>
    <div class="footer guide-footer">
      <p>고객센터<span class="call">1533-1777</span></p>
      <p>평일<span>10:00 ~ 19:00</span></p>
      <p>점심시간<span>12:00 ~ 13:00</span></p>
      <p>주말/공휴일<span>휴무</span></p>
    </div>
  </div>
</template>

<script>
import jwt from "@/common/jwt";

export default {
  name: "loginGuide",
  created() {
    jwt.destroyAll();
  }
}
</script>

<style scoped>

</style>