<template>
  <div class="content-main support">
    <div class="menu-wrap">
      <div class="content-menu">
        <p :class="{ active : isNotice }" @click="tabMessage('notice')"><router-link :to="{ name: 'StudySupportNotice',query:{name : readingClubQuery } }">공지사항<span></span></router-link></p>
        <p :class="{ active : isFaq }" @click="tabMessage('faq')"><router-link :to="{ name: 'StudySupportFaq',query:{name : readingClubQuery } }">자주 묻는 질문<span></span></router-link></p>
        <p :class="{ active : isConsult }" @click="tabMessage('consult')"><router-link :to="{ name: 'StudySupportConsult' , query:{name : readingClubQuery } }">1:1 친절상담<span></span></router-link></p>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data () {
    return {
      //하단 탭 메뉴
      isNotice: true,
      isFaq: false,
      isConsult: false,
      readingClubQuery:''
    }
  },
  watch: {
    '$route'() {
      this.getUrlParams();
    },
  },
  created() {
    this.getUrlParams();
    this.readingClubQuery = this.$route.query.name
  },
  methods: {
    //TODO: 탭메뉴 active
    getUrlParams() {
      if (window.location.href.match('faq')) {
        this.isFaq = true;
        this.isNotice = false;
        this.isConsult = false;
      } else if (window.location.href.match('consult')) {
        this.isConsult = true;
        this.isFaq = false;
        this.isNotice = false;
      } else {
        this.isNotice = true;
        this.isFaq = false;
        this.isConsult = false;
      }
    },
    tabMessage(thisArea) {
      if (thisArea == 'notice') {
        this.isNotice = true;
        this.isFaq = false;
        this.isConsult = false;
      } else if (thisArea == 'faq') {
        this.isFaq = true;
        this.isNotice = false;
        this.isConsult = false;
      } else if (thisArea == 'consult') {
        this.isConsult = true;
        this.isFaq = false;
        this.isNotice = false;
      }
    },
  }
}
</script>

<style>
/* @import url('@/assets/css/launcher/mypage/mypage.css'); */
</style>