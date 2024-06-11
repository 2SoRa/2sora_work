<template>
  <!-- 내 도서관 : 오늘의 책 -->
  <div class="category-select-wrap hide-eng">
<!--    <ul v-show="isEEbooks" class="tab-menu-list">-->
    <ul class="tab-menu-list">
      <li class="list-item">
        <button type="button" @click="toggleLanguage('K')" :class="{ active : this.currentLanguage === 'K'}"><span
          class="txt">한글책</span></button>
      </li>
      <li class="list-item">
        <button type="button" @click="toggleLanguage('E')" :class="{ active : this.currentLanguage === 'E'}"><span
          class="txt">영어책</span></button>
      </li>
    </ul>
  </div>
  <div class="content-scroll-area">
    <div class="desc-area">
      <small class="float-desc"><em>진도일에 학습</em>한 책만 완료 체크가 됩니다.</small>
      <small v-if="currentLanguage === 'K' " class="float-desc left"><img src="@/assets/img/launcher-readingclub/my-library/ico-mylib-v.webp" alt="아이콘">한글책은 독후활동이 없어요.</small>
    </div>
    <form class="form-area">
      <fieldset>
        <legend>날짜 조회</legend>
        <div class="btn-calendar">
          <button type="button" @click="movePreviousMonth" class="btn-prev" :disabled="!moveIsPrevMonth">이전 달</button>
          <p class="txt-month">{{ moveDate }}</p>
          <button type="button" @click="moveNextMonth" class="btn-next" :disabled="!moveIsNextMonth">다음 달</button>
        </div>
      </fieldset>
      <fieldset>
        <legend>전체/미완료/완료 라디오버튼</legend>
        <div class="radio-round-group">
          <div class="radio-input">
            <input type="radio" id="A" name="checked-study" value="A" v-model="currentRead" checked>
            <label for="A">전체</label>
          </div>
          <div class="radio-input">
            <input type="radio" id="N" name="checked-study" value="N" v-model="currentRead">
            <label for="N">미완료</label>
          </div>
          <div class="radio-input">
            <input type="radio" id="Y" name="checked-study" value="Y" v-model="currentRead">
            <label for="Y">완료</label>
          </div>
        </div>
      </fieldset>
    </form>
    <div class="book-list-wrap">
      <ul class="book-list" v-if="bookListData && bookListData.length > 0">
        <li class="list-item" v-for="(item, index) in bookListData" :key="item">
          <div class="thumb-wrap">
            <span class="sta-book" :class="{ 'check-comp' : item.isRead }"></span>
            <div class="thumbnail" @class="{ expire : item.endDate && (item.endDate > new Date())}">
              <img :src="item.thumbUrl" :alt="item.bookNm" @error="replaceDefault">
            </div>
            <div class="thumb-info">
              <div class="book-kind">
                <span :class="['motion-book', { 'show' : item.isMotionBook }]">모션북</span>
                <span :class="['e-book', { 'show' : item.isEbook }]">이북</span>
              </div>
              <div class="thumb-bottom-right">
                <span class="ico-guide" v-if="item.isGuide"></span>
                <div v-if="item.bookVerDiv" class="flag day">
                  <span class="txt-data">
                    {{ item.bookVerDiv === 'D1' ? 'Day 1' : 'Day 2' }}
                  </span>
                </div>
              </div>
            </div>
            <div v-if="currentLanguage === 'K' " class="view" @click="mixin_openBook({ 'path' : 'T', 'entry' : 'TodayBook', 'index' : `${index}` }, item)"></div>
            <div v-if="currentLanguage === 'E' " class="view" @click="mixin_openBook({ 'path' : 'T', 'entry' : 'TodayBook', 'index' : `${index}` }, item)"></div>
          </div>
          <div class="tag-wrap">
            <div class="tag" v-if="currentLanguage === 'K' ">
              <img v-if="item.mainAreaCd === '1'" src="@/assets/img/launcher-readingclub/common/icons/ico_tag_society.webp" alt="사회성" class="tag-item">
              <img v-if="item.mainAreaCd === '2'" src="@/assets/img/launcher-readingclub/common/icons/ico_tag_language.webp" alt="언어" class="tag-item">
              <img v-if="item.mainAreaCd === '3'" src="@/assets/img/launcher-readingclub/common/icons/ico_tag_recognition.webp" alt="인지" class="tag-item">
              <img v-if="item.mainAreaCd === '4'" src="@/assets/img/launcher-readingclub/common/icons/ico_tag_emotion.webp" alt="정서" class="tag-item">
              <img v-if="item.mainAreaCd === '5'" src="@/assets/img/launcher-readingclub/common/icons/ico_tag_creativity.webp" alt="창의사고" class="tag-item">
              <img v-if="item.subAreaCd === '1'" src="@/assets/img/launcher-readingclub/common/icons/ico_tag_society.webp" alt="사회성" class="tag-item">
              <img v-if="item.subAreaCd === '2'" src="@/assets/img/launcher-readingclub/common/icons/ico_tag_language.webp" alt="언어" class="tag-item">
              <img v-if="item.subAreaCd === '3'" src="@/assets/img/launcher-readingclub/common/icons/ico_tag_recognition.webp" alt="인지" class="tag-item">
              <img v-if="item.subAreaCd === '4'" src="@/assets/img/launcher-readingclub/common/icons/ico_tag_emotion.webp" alt="정서" class="tag-item">
              <img v-if="item.subAreaCd === '5'" src="@/assets/img/launcher-readingclub/common/icons/ico_tag_creativity.webp" alt="창의사고" class="tag-item">
            </div>
            <div class="tag ar" v-if="currentLanguage === 'E' ">
              <p v-if="item.bookEngStep === 'B'" class="tag-item step basic">Basic</p> <!--단계표시-->
              <p v-if="item.bookEngStep === 'I'" class="tag-item step intermediate">Intermediate</p>
              <p v-if="item.bookEngStep === 'A'" class="tag-item step advanced">Advanced</p>
              <p class="tag-item level">AR {{item.arLevel}}</p><!--AR표시-->
            </div>
          </div>
        </li>
      </ul>
      <div v-else class="no-data"><span class="text-blind">오늘의 책이 없습니다</span></div>
    </div>
    <TopButton></TopButton>
    <viewerModal :propsData="{ viewerInfo }" @openBookRun="openBookRun" @openViewerPopup="openViewerPopup" @closeViewerPopup="closeViewerPopup"></viewerModal>
  </div>
</template>

<script>
import dataMixin from "@/common/mixin/dataMixin";
import viewerMixin from "@/common/mixin/viewerMixin";
import moment from "moment/moment";
import readingClubFactory from "@/api/reading-club/readingClub-factory";
import {mapGetters} from "vuex";
import TopButton from '@/components/launcher-readingclub/elements/top-button.vue'
import viewerModal from "@/components/launcher-readingclub/modals/model-viewer.vue";

const myLibrary = readingClubFactory.get('myLibrary');
export default {
  mixins: [
    dataMixin,
    viewerMixin
  ],
  data() {
    return {
      viewerInfo : {
        isModal : false,
        modalType : 'type',
        modalData : {}
      },
      bookListOriginal: [],
      bookListData: [],
      currentLanguage: 'K',
      currentRead: 'A',
      isEEbooks: false,
    }
  },
  components : {
    viewerModal,
    TopButton
  },
  computed: {
    ...mapGetters(['userInfo']),
    moveNowDate: () => {
      const date = new Date();
      return moment(date).locale("ko").format("YYYY년 MM월");
    }
  },
  watch: {
    moveDate() {
      this.bookListOriginal = [];
      this.bookListData = [];
      this.currentRead = 'A';
      this.isEEbooks = false;
      this.getTodayBookData();
    },
    currentRead(oldState, newState) {
      if (oldState !== newState) {
        this.filterBookList();
      }
    },
    currentLanguage(oldValue, newValue) {
      if (oldValue !== newValue) {
        this.currentRead = 'A';
        this.filterBookList();
      }
    }
  },
  methods: {
    getTodayBookData() {
      const params = {
        studentId: this.userInfo.info.studentId,
        selectedDate: this.moveYear + this.moveMonth,
        readingYn: this.readingState
      }
      const todayList = myLibrary.getTodayBookList(params);
      todayList.then((res) => {
        if (res.status === 200 && res.data.data) {
          this.bookListOriginal = res.data.data.items;
          this.filterBookList();
        }
      }).catch((error) => {
        console.log(error)
      });
    },
    filterBookList() {
      this.bookListData = this.bookListOriginal.filter((item) => {
        if (this.currentRead === 'A') {
          return (this.currentLanguage === item.bookDiv)
        } else {
          const isRead = (this.currentRead === 'Y') ? true : false;
          return (this.currentLanguage === item.bookDiv) && (isRead === item.isRead)
        }
      })
      this.isEEbooks = this.bookListOriginal.some(item => item.bookDiv === 'E');
    },
    toggleLanguage(language) {
      this.currentLanguage = language;
    },
    viewFinalComplete() {
    },
    openBookRun(type) {
      this.mixin_openBookRun(type);
    },
    openViewerPopup(info, item, type) {
      this.viewerInfo.modalData.info = info;
      this.viewerInfo.modalData.item = item;
      this.viewerInfo.modalType = type;
      this.viewerInfo.isModal = true;
    },
    closeViewerPopup(onlyClose) {
      this.viewerInfo.isModal = false;
      if (!onlyClose) {
        this.viewFinalComplete();
      }
    },
    replaceDefault(e) {
      e.target.src = require('@/assets/img/launcher-readingclub/common/thumbnail_default.png')
    }
  }
}
</script>