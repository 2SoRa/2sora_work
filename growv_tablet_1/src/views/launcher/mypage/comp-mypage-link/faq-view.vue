<template>
  <div class="mypage-link show notice">
    <div class="gnb">
      <button  v-if="!isReadingClub" class="back"><router-link :to="{ name: 'StudySupportFaq' }"></router-link></button>
      <!--      리딩클럽에서 진입시 query값 넘겨주기-->
      <button class="back" v-else><router-link :to="{ name: 'StudySupportFaq' , query:{ name: 'readingClub' }}"></router-link></button>
      <h1 class="title">자주 묻는 질문</h1>
    </div>
    <div class="mypage-content">
      <div class="content">
        <div class="head">
          <div class="title">{{ detail.fqnaTitle }}</div>
        </div>
        <div class="text" v-html="detail.fqnaCt"></div>
      </div>
      <div class="btn-wrap btn-wrap-01">
        <button v-if="!isReadingClub" class="btn btn-type-02-sec"><router-link :to="{ name: 'StudySupportFaq'}">확인</router-link></button>
        <!--      리딩클럽에서 진입시 query값 넘겨주기-->
        <button v-else class="btn btn-type-02-sec"><router-link :to="{ name: 'StudySupportFaq',query:{ name: 'readingClub' }}">확인</router-link></button>
      </div>
    </div>
  </div>
</template>

<script>
import mypageFactory from '@/api/mypage-factory';

const faqCode = mypageFactory.get('faqCode');

export default {
  name: '',
  props: ['id'],
  data() {
    return {
      detail: {},
      //리딩클럽 집입 여부
      isReadingClub:false,
    }
  },
  created() {
    this.getDetail()
    //리딩클럽에서 진입 했다면 true로 바꿔주기
    if(window.location.href.match('readingclub')){
      this.isReadingClub = true
    }
  },
  mounted() {
    if(this.$route.query.name){
      this.readingClubQuery = this.$route.query.name
      this.addReadingClubClass();
    }
  },
  methods: {
    getDetail() {
      /*const data = {
        id: this.id,
      }*/

      const detail = faqCode.getDetail(this.id);
      detail.then((res) => {
        if (res.status == 200) {
          const data = res.data.data;
          this.detail = data;
        }
      }).catch((error) => {
        console.log(error)
      });
    },
    addReadingClubClass() {
      const readingClub = document.querySelector('.mypage-link')
      readingClub.classList.add('reading-club')
    }
  },
}
</script>

<style>
@import url('@/assets/css/launcher/common.css');
@import url('@/assets/css/launcher/layout.css');
@import url('@/assets/css/launcher/mypage/mypage-link.css');
</style>