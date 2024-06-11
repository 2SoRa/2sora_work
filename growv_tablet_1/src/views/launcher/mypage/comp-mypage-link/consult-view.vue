<template>
  <!-- TODO : mypage-link 공통 슈퍼리딩일 경우 add class .reading-club -->
  <div class="mypage-link show consult">
    <div class="gnb">
      <button v-if="!isReadingClub" class="back"><router-link :to="{ name: 'StudySupportConsult' }"></router-link></button>
      <!--      리딩클럽에서 진입시 query값 넘겨주기-->
      <button class="back" v-else><router-link :to="{ name: 'StudySupportConsult' , query:{ name: 'readingClub' }}"></router-link></button>
      <h1 class="title">1:1 문의 상세보기</h1>
    </div>
    <div class="mypage-content">
      <div class="content">
        <div class="head">
          <div class="info">
            <p class="name">{{ detail.inquireTypeName }}</p>
            <p class="date">
              <img v-if="detail.inquireAnswerStateDiv === 'W'" src="@/assets/img/launcher/mypage/mp_value_wait.png" alt="no-read">
              <img v-else-if="detail.inquireAnswerStateDiv === 'P'" src="@/assets/img/launcher/mypage/mp_value_ing.png" alt="read">
              <img v-else-if="detail.inquireAnswerStateDiv === 'C'" src="@/assets/img/launcher/mypage/mp_value_finish.png" alt="reply">
            </p>
          </div>
        </div>
        <div class="text">
         <div class="question">
           <p></p>
           <textarea :value="detail.inquireCt" style="height:auto;"></textarea>
         </div>
          <div class="answer">
            <p></p>
            <p v-if="detail.inquireAnswerStateDiv === 'P'">문의를 처리 중입니다. <br> 신속하게 답변 드리겠습니다.</p>
            <p v-else-if="detail.inquireAnswerStateDiv === 'W'">문의하신 내용이 접수되었습니다. <br> 신속하게 답변 드리겠습니다.</p>
            <p v-else v-html="detail.inquireCtAnswer"></p>
          </div>
        </div>
      </div>
      <div class="btn-wrap btn-wrap-01">
        <button v-if="!isReadingClub" class="btn btn-type-02-sec gray">
          <router-link :to="{ name: 'StudySupportConsult' }">목록</router-link>
        </button>
<!--        리딩클럽에서 진입시 query값 넘겨주기-->
        <button v-else class="btn btn-type-02-sec gray">
          <router-link :to="{ name: 'StudySupportConsult',query:{ name: 'readingClub' } }">목록</router-link>
        </button>
        <button class="btn btn-type-02-sec" @click="deleteQna()">삭제</button>
      </div>
    </div>
  </div>
  <deleteModal :propsData="{deleteShowModal, id}" @closePopup="closeDeletePopup"></deleteModal>
</template>

<script>
import deleteModal from '../comp/comp-contents/comp-mypage-popup/consult-delete-popup'
import mypageFactory from '@/api/mypage-factory';

const consultCode = mypageFactory.get('consultCode');

export default {
  name: '',
  props: ['id'],
  components: {
    deleteModal,
  },
  data() {
    return {
      detail: {},
      deleteShowModal: false,
      //리딩클럽 집입 여부
      isReadingClub:false,
    }
  },
  created() {
    this.getDetail()
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

      const detail = consultCode.getDetail(this.id);
      detail.then((res) => {
        if (res.status == 200) {
          const data = res.data.data;
          this.detail = data;
        }
      }).catch((error) => {
        console.log(error)
      });
    },
    deleteQna() {
      this.openDeletePopup();
    },

    // 팝업 클릭시
    clickPopBtn() {
      document.querySelector('body').style.overflow = 'hidden';
    },
    // 삭제 팝업 열기
    openDeletePopup() {
      this.deleteShowModal = true;
      this.clickPopBtn();
    },
    // 삭제 팝업 닫기
    closeDeletePopup() {
      this.deleteShowModal = false;

      document.querySelector('body').style.overflow = 'auto';
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
@import url('@/assets/css/launcher/mypage/mypage.css');
@import url('@/assets/css/launcher/mypage/mypage-link.css');
</style>