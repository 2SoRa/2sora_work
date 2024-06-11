<template>
  <div class="content-main message">
    <div class="menu-wrap">
      <div class="content-menu">
        <p :class="{ active : isReceive }" @click="tabMessage('receive')"><router-link :to="{ name: 'MessageReceive' }">받은 쪽지함<span></span></router-link></p>
        <p :class="{ active : isSend }" @click="tabMessage('send')"><router-link :to="{ name: 'MessageSend' }">보낸 쪽지함<span></span></router-link></p>
      </div>
      <p class="info">읽은 쪽지는 30일 후 자동삭제 됩니다. (읽지 않은 쪽지는 60일 후 삭제)</p>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data () {
    return {
      //하단 탭 메뉴
      isReceive: true,
      isSend: false,
    }
  },
  watch: {
    '$route'() {
      this.getUrlParams();
    },
  },
  created() {
    this.getUrlParams();
  },
  methods: {
    //TODO: 탭메뉴 active
    getUrlParams() {
      if (window.location.href.match('send')) {
        this.isReceive = false;
        this.isSend = true;
      } else {
        this.isReceive = true;
        this.isSend = false;
      }
    },
    tabMessage(thisArea) {
      if (thisArea == 'receive') {
        this.isReceive = true;
        this.isSend = false;
      } else if (thisArea == 'send') {
        this.isReceive = false;
        this.isSend = true;
      }
    },
  }
}
</script>

<style>
</style>