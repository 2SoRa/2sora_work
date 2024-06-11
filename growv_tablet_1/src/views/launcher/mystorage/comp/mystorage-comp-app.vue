<template>
  <div class="mystorage-wrap">
    <div class="gnb">
      <div class="gnb-title">
        <img src="@/assets/img/launcher/storage/stg_sub_navi_ico_l@2x.webp" alt="deco">
        <p>나만의 보관함</p>
        <img src="@/assets/img/launcher/storage/stg_sub_navi_ico_r@2x.webp" alt="deco">
      </div>
      <div class="gnb-right">
        <!-- TODO: 나만의 보관함 종료 기능 추가 -->
        <button class="btn" @click="closeStorage()">
          <img src="@/assets/img/launcher/storage/stg_navi_btn_close@2x.webp" alt="close">
        </button>
      </div>
    </div>
    <div class="mystorage-div">
      <button :class="{'active' : storageDiv === 'study'}" @click="changeList('', '', 'study')">최근학습</button>
      <button :class="{'active' : storageDiv === 'store'}" @click="changeList('', '', 'store')">보관함</button>
    </div>
    <div class="subject-list">
      <button :class="{'active' : subjectDiv === '영어'}" @click="changeList('MyStorageSubject', '영어', '')">영어</button>
      <button :class="{'active' : subjectDiv === '수학'}" @click="changeList('MyStorageSubject', '수학', '')">수학</button>
      <button :class="{'active' : subjectDiv === '한글'}" @click="changeList('MyStorageSubject', '한글', '')">한글</button>
      <button :class="{'active02' : subjectDiv === '특별학습'}" @click="changeList('MyStorageSubject', '특별학습', '')">특별학습</button>
      <button :class="{'active02' : subjectDiv === '슈퍼리딩'}" @click="changeList('MyStorageBook', '슈퍼리딩', '')">영어도서관</button>
      <button :class="{'active03' : subjectDiv === '한글도서관'}" @click="changeList('MyStorageBook', '한글도서관', '')">한글도서관</button>
    </div>

    <router-view></router-view>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";

export default {
  data() {
    return {
      storageDiv: '', // 최근학습, 보관함 구분
      subjectDiv: '', // 영어~한글도서관 까지의 과목별 구분
    }
  },
  computed: {
    ...mapGetters('mystorageStorage', ['getLink', 'getSubjectDiv', 'getStorageDiv']),
  },
  watch: {
    '$route'() {
      this.getUrlParams();
    },
  },
  created() {
    this.getUrlParams();
    this.setInitView();
  },
  methods: {
    ...mapMutations('mystorageStorage', ['storeStorageDiv', 'resetStorageDiv', 'resetChangeDate']),

    getUrlParams() {
      let link = '';
      let subjectDiv = '';
      let storageDiv = '';

      if (window.location.href.match('%EC%98%81%EC%96%B4')) { // 영어 보관함
        link = 'MyStorageSubject';
        subjectDiv = '영어';
      } else if (window.location.href.match('%EC%88%98%ED%95%99')) { // 수학 보관함
        link = 'MyStorageSubject';
        subjectDiv = '수학';
      } else if (window.location.href.match('%ED%95%9C%EA%B8%80')) { // 한글 보관함
        link = 'MyStorageSubject';
        subjectDiv = '한글';

        if (window.location.href.match('%ED%95%9C%EA%B8%80%EB%8F%84%EC%84%9C%EA%B4%80')) { // 한글도서관 보관함
          link = 'MyStorageBook';
          subjectDiv = '한글도서관';
        }
      } else if (window.location.href.match('%ED%8A%B9%EB%B3%84%ED%95%99%EC%8A%B5')) { // 특별학습 보관함
        link = 'MyStorageSubject';
        subjectDiv = '특별학습';
      } else if (window.location.href.match('%EC%8A%88%ED%8D%BC%EB%A6%AC%EB%94%A9')) { // 슈퍼리딩 보관함
        link = 'MyStorageBook';
        subjectDiv = '슈퍼리딩';
      }

      if (window.location.href.match('store')) {
        storageDiv = 'store';
      } else {
        storageDiv = 'study';
      }

      this.storeStorageDiv({link, subjectDiv, storageDiv});

      this.storageDiv = storageDiv;
      this.subjectDiv = subjectDiv;
    },

    // 초기 화면 세팅 (최근학습, 영어, 과목페이지로 세팅) (로컬에 기억해두고 있는 페이지 내용 있으면 불러오기)
    // created에선 getters가 더 늦게 불러와질 때가 있어서 local에 있는 내용으로 진행
    setInitView() {
      let localMystorage = JSON.parse(localStorage.getItem('vuex')).mystorageStorage;

      let link = '';
      let subjectDiv = '';
      let storageDiv = '';

      if (!localMystorage.link || localMystorage.link === '' || localMystorage.link == undefined) {
        link = 'MyStorageSubject';
      } else {
        link = localMystorage.link;
      }

      if (!localMystorage.subjectDiv || localMystorage.subjectDiv === '' || localMystorage.subjectDiv == undefined) {
        subjectDiv = '영어';
      } else {
        subjectDiv = localMystorage.subjectDiv;
      }

      if (!localMystorage.storageDiv || localMystorage.storageDiv === '' || localMystorage.storageDiv == undefined) {
        storageDiv = 'study';
      } else {
        storageDiv = localMystorage.storageDiv;
      }

      this.storeStorageDiv({link, subjectDiv, storageDiv});

      this.storageDiv = storageDiv;
      this.subjectDiv = subjectDiv;

      this.$router.push({name: link, params: {subId: this.subjectDiv, storageId: this.storageDiv}})
    },

    // 리스트 영역 바뀌는 메소드, link : 최근학습,보관함 구분값, subjectDiv: 영어,수학, 등 과목별 구분값, storageDiv: 과목과 책의 구분값
    changeList(link, subjectDiv, storageDiv) {
      if (!link || link === '' || link == undefined) {
        link = this.getLink;
      }
      if (!subjectDiv || subjectDiv === '' || subjectDiv == undefined) {
        subjectDiv = this.getSubjectDiv;
      }
      if (!storageDiv || storageDiv === '' || storageDiv == undefined) {
        storageDiv = this.getStorageDiv;
      }

      this.storeStorageDiv({link, subjectDiv, storageDiv});

      this.storageDiv = storageDiv;
      this.subjectDiv = subjectDiv;

      this.$router.push({name: link, params: {subId: this.subjectDiv, storageId: this.storageDiv}});
    },

    // 나만의 보관함 닫기 - 슈퍼V 메인화면으로 이동
    closeStorage() {
      this.resetStorageDiv(); // '최근학습/보관함', '과목', '라우터 링크' 초기화
      this.resetChangeDate(); // 날짜 초기화
      // eslint-disable-next-line
      goGrowvAppPage("main");
    },
  },
}
</script>

<style>
</style>