<template>
  <div class="mypage-link show notice">
    <div class="gnb">
      <button v-if="!isReadingClub" class="back"><router-link :to="{ name: 'StudySupportNotice' }"></router-link></button>
      <!--      리딩클럽에서 진입시 query값 넘겨주기-->
      <button class="back" v-else><router-link :to="{ name: 'StudySupportNotice' , query:{ name: 'readingClub' }}"></router-link></button>
      <h1 class="title">공지사항</h1>
    </div>
    <div class="mypage-content">
      <div class="content">
        <div class="head">
          <div class="title">{{ detail.noticeTitle }}<span class="new" v-if="Math.abs((new Date(detail.regDtm).getTime() - new Date(setCurrentDate).getTime())/ (1000 * 60 * 60 * 24)) < 7"></span></div>
          <div class="info">
            <p class="date">{{ detail.regDtm }}</p>
          </div>
        </div>
        <div class="text" v-html="detail.noticeCt"></div>
      </div>
      <div class="btn-wrap btn-wrap-01">
        <button v-if="!isReadingClub" class="btn btn-type-02-sec"><router-link :to="{ name: 'StudySupportNotice'}">확인</router-link></button>
        <!--      리딩클럽에서 진입시 query값 넘겨주기-->
        <button v-else class="btn btn-type-02-sec"><router-link :to="{ name: 'StudySupportNotice', query:{ name: 'readingClub' }}">확인</router-link></button>
      </div>
    </div>
  </div>
</template>

<script>
import mypageFactory from '@/api/mypage-factory';

const noticeCode = mypageFactory.get('noticeCode');

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
  computed: {
    setCurrentDate() {
      const moment = require('moment');
      let today = moment().format('YYYY-MM-DD');

      return today;
    },
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
      }
*/
      const detail = noticeCode.getDetail(this.id);
      detail.then((res) => {
        if (res.status == 200) {
          const data = res.data.data;
          this.detail = data;
        }
      }).catch((error) => {
        console.log(error)
      });
    },
    //리딩클럽에서 진입 시 클래스 붙여주기
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