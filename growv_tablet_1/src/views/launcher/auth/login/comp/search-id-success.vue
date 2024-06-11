<template>
  <div class="search">
    <div class="search-area">
      <div class="search-title">
        <p class="title">아이디 찾기</p>
      </div>
      <div class="success-info">
        <p class="title"><span>{{ this.$route.query.name }}</span>님</p>
        <div class="search-info">
          <div>
            <p class="title">아이디</p>
            <p class="info">{{ this.$route.query.loginId }}</p>
          </div>
          <div>
            <p class="title">가입일</p>
            <p class="info">{{ this.$route.query.regDt }}</p>
          </div>
        </div>

      </div>
      <div class="btn-wrap">
        <button class="btn btn-410">
          <router-link :to="{ name:'loginMain' }">로그인</router-link>
        </button>
        <button class="btn btn-410">
          <router-link :to="{ name:'searchPw' }">비밀번호찾기</router-link>
        </button>
      </div>
    </div>
    <div class="footer search-footer">
      <p>고객센터<span class="call">1533-1777</span></p>
      <div>
        <p></p>
        <p>평일<span>10:00 ~ 19:00</span></p>
        <p>점심시간<span>12:00 ~ 13:00</span></p>
        <p>주말/공휴일<span>휴무</span></p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "searchIdSuccess",
  props: {
    name: {
      type: String,
      default: "",
    },
    loginId: {
      type: String,
      default: "",
    },
    regDate: {
      type: String,
      default: "",
    }
  },
  created() {
    if(!this.$route.query.name || !this.$route.query.loginId) {
      this.$router.push({name: 'loginMain',});
    }
    // console.log(this.$route.params.name);
    // console.log(this.$route.params.loginId);
    // console.log(this.$route.params.regDate);

    // console.log(this.$route.query.name);
    // console.log(this.$route.query.loginId);
    // console.log(this.$route.query.regDt);
  }

}
</script>

<style scoped>

</style>