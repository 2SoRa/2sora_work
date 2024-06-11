<template>
  <div class="join-success">
    <h1 class="title">슈퍼V 회원가입이 완료되었습니다.</h1>
    <div class="success-info">
      <ul>
        <li class="success-title">이제부터 <span>회원 아이디</span>로 로그인 하세요!</li>
        <li>
          <p>아이디</p>
          <span>{{ this.userInfo.info.parentEmail }}</span>
        </li>
        <li>
          <p>자녀 이름</p>
          <span>{{ this.userInfo.info.studentName }}</span>
        </li>
      </ul>
      <div class="btn-wrap">
        <button class="btn btn-460" @click="goSuperVBook">슈퍼V 시작하기</button>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "joinSuccess",
  computed: {
    ...mapGetters(['userInfo']),
  },
  created() {
    if(!this.userInfo.info.parentId){
      this.$router.push({name: 'loginMain'});
    }

    this.$store.dispatch('loadUserInfo');
  },
  methods: {
    goSuperVBook() {
      //TODO 테블릿 메인페이지 진입
      // eslint-disable-next-line
      goGrowvAppPage("welcome");
    }
  }
}
</script>

<style scoped>
@import url('@/assets/css/launcher/auth/join.css');
</style>