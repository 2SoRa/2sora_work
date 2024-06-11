<template>
  <!-- 내 도서관 : 보관함 -->
  <div class="category-select-wrap hide-eng">
    <ul class="tab-menu-list">
      <li class="list-item">
        <button type="button" @click="handleLanguage('K')" :class="{ active : this.currentLanguage === 'K'}"><span
          class="txt">한글책</span></button>
      </li>
      <li class="list-item">
        <button type="button" @click="handleLanguage('E')" :class="{ active : this.currentLanguage === 'E'}"><span
          class="txt">영어책</span></button>
      </li>
    </ul>
  </div>
  <div class="content-scroll-area storage">
    <div class="desc-area">
      <small class="float-desc">도서관에서 담은 책만 볼 수 있어요. <br>오늘의 책은 도서관에서 검색하여 담아 주세요.</small>
    </div>
    <div class="book-list-wrap">
      <ul class="book-list" v-if="bookListData && bookListData.length > 0">
        <li class="list-item" v-for="(item, index) in bookListData" :key="item">
          <div class="thumb-wrap check-read">
            <span class="sta-book" :class="{ 'check-read' : item.isRead }"></span>
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
                <button type="button" class="save" @click="toggleStorage(index, item.bookId, item.isStorage)"
                        :class="{ 'save-off' : item.isStorage }"></button>
              </div>
            </div>
            <div v-if="currentLanguage === 'K' " class="view" @click="mixin_openBook({ 'path' : 'R', 'entry' : 'KoreanLibrary', 'index' : `${index}` }, item)"></div>
            <div v-if="currentLanguage === 'E' " class="view" @click="mixin_openBook({ 'path' : 'R', 'entry' : 'EnglishLibrary', 'index' : `${index}` }, item)"></div>
          </div>
          <div class="tag-wrap" >
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
      <div v-else class="no-data">
        <span class="text-blind">보관된 책이 없습니다</span>
      </div>
    </div>
    <TopButton></TopButton>
    <viewerModal :propsData="{ viewerInfo }" @openBookRun="openBookRun" @openViewerPopup="openViewerPopup" @closeViewerPopup="closeViewerPopup"></viewerModal>
  </div>
</template>

<script>
import readingClubFactory from "@/api/reading-club/readingClub-factory";
import {mapGetters} from "vuex";
import functionMixin from "@/common/mixin/functionMixin";
import viewerMixin from "@/common/mixin/viewerMixin";
import TopButton from '@/components/launcher-readingclub/elements/top-button.vue'
import viewerModal from "@/components/launcher-readingclub/modals/model-viewer.vue";

const myLibrary = readingClubFactory.get('myLibrary');
export default {
  mixins: [
    functionMixin,
    viewerMixin,
  ],
  data() {
    return {
      viewerInfo : {
        isModal : false,
        modalType : 'type',
        modalData : {}
      },
      studentId : null,
      currentLanguage: 'K',
      bookListData: [],
      bookTotalCount: 0,
      scrollData: {
        pageIndex: 0,
        pageSize: 15,
        isLoading: false
      },
      isScrollUp: false,
      lastScrollPosition: 0,
    }
  },
  components : {
    viewerModal,
    TopButton
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  created() {
    this.studentId = this.userInfo.info.studentId;
    this.getStorageData();
  },
  mounted() {
    this.addInfiniteScroll();
  },
  watch: {
    currentLanguage(oldValue, newValue) {
      if (oldValue !== newValue) {
        this.bookListData = [];
        this.scrollData.pageIndex = 0;
        this.getStorageData();
      }
    }
  },
  methods: {
    handleLanguage(language) {
      this.currentLanguage = language;
    },
    addInfiniteScroll() {
      document.querySelector('.content-scroll-area').addEventListener('scroll', this.setInfiniteScroll)
    },
    setInfiniteScroll() {
      if (!this.isLastScroll()) {
        const tg = document.querySelector('.content-scroll-area')
        if (tg.clientHeight + tg.scrollTop >= tg.scrollHeight-1) {
          if (this.scrollData.isLoading === false) {
            this.scrollData.pageIndex++;
            this.getStorageData();
          }
        }
      }
    },
    isLastScroll() {
      return this.bookTotalCount === this.bookListData.length;
    },
    getStorageData() {
      const params = {
        studentId: this.userInfo.info.studentId,
        bookDiv: this.currentLanguage,
        pageIndex: this.scrollData.pageIndex,
        pageSize: this.scrollData.pageSize
      }
      this.scrollData.isLoading = true;
      const storageApi = myLibrary.getStorageList(params);
      storageApi.then((res) => {
        if (res.status === 200 && res.data.data) {
          Array.prototype.push.apply(this.bookListData, res.data.data.items);
          this.bookTotalCount = res.data.data.totalCount;
          this.scrollData.isLoading = false;
        }
      }).catch((error) => {
        console.log(error)
      });
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