<template>
<div class="login-fail">
  <div class="content">
    <ul>
      <li>
        <p class="info"><span class="dotbadge"></span>학생 이름</p>
        <p>이애기</p>
      </li>
      <li>
        <p class="info"><span class="dotbadge"></span>중지 사유</p>
        <p>이월로 학습중지(2021.11.23 ~ 2022.12.24)</p>
      </li>
      <li class="help">
        <p>도움이 필요하시면 담임선생님 혹은 고객센터에 문의해주세요.</p>
      </li>
    </ul>
    <div class="btn-wrap btn-wrap-01">
      <button class="btn btn-410">
        <router-link :to="{ name: 'loginMain'}">확인</router-link>
      </button>
    </div>
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
export default {
  name: "login-fail"
}
</script>

<style scoped>
  @import url('@/assets/css/launcher/auth/login.css')
</style>