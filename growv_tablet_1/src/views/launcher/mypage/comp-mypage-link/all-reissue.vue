<template>
  <div>
  </div>
</template>

<script>
import {allReissue} from "@/api/auth/auth-api";
import jwt from "@/common/jwt";
import {mapGetters} from "vuex";
export default {
  created() {
    this.requestAllReissue();
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  methods: {
    requestAllReissue() {
      allReissue().then((res) => {
        const result = res.data;
        if (result.code === '200') {
          if (result.data.accessToken) {
            jwt.saveAllToken(result.data);
            this.$store.dispatch('loadUserInfo');

            setTimeout(() => {
              this.setAppToken();
            }, 500);
          }
        }
      }).catch((error) => {
        const errorData = error.response.data;
        if (errorData.code === 'INVALID') {
          this.message = errorData.message;
          this.openLoginErrorPopup();
        }
      });
    },
    setAppToken(){
      // eslint-disable-next-line
      setGrowvAppUser(jwt.getToken(), this.userInfo.info.studentId);
    }
  }
}
</script>

<style>
</style>