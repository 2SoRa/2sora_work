<template>
  <!-- 한글 도서관 : 책 목록 -->
  <div class="library sub">
    <div class="sub-gnb">
      <div class="sub-gnb-left">
        <button type="button" @click="this.$router.go(-1)" class="btn-back"></button>
      </div>
      <h1 v-if="getKorCategory === 'age'">연령별</h1>
      <h1 v-else>{{ getKorSubCategory.name }}{{ getKorSubCategory.id === 'bookAgeCd' ? '세' : '' }}</h1>
      <div class="sub-gnb-right gap-0">
        <div class="btn-group">
          <button type="button" class="btn-my-book"><router-link :to="{ name : 'myLibraryTodayBook', query:{'path':'korean'} }">내 도서관</router-link></button>
          <button type="button" class="btn-search-link"><router-link :to="{ name : 'koreanLibrarySearch' }">돋보기</router-link></button>
        </div>
        <button type="button" class="btn-close"><router-link :to="{ name : 'ReadingClubMainView' }">close</router-link></button>
      </div>
    </div>
    <div class="contents">
      <div class="select-tab-menu-wrap" :class="{ 'no-sub' : getKorCategory === 'kind' || getKorCategory === 'keyword'}">
        <ul class="select-tab-list" v-if="getKorCategory === 'develop' || getKorCategory === 'pub' ">
          <!-- 연령대 선택 -->
          <li v-for="(item,index) in ageData" :key="index" @click="toggleAge(item.age)"
              :class="{ active : currentAge === item.age}">
            {{ item.label }}
          </li>
        </ul>
        <div class="book-icon"></div>
      </div>
      <div class="book-list-wrap content-scroll-area">
        <ul class="book-list" v-if="bookListData && bookListData.length > 0">
          <li v-for="(item, index) in bookListData" :key="item" class="list-item">
            <div class="thumb-wrap">
              <span class="sta-book" :class="{ 'check-read' : item.isRead }"></span>
              <div class="thumbnail">
                <img :src="item.thumbUrl" @error="replaceDefault" :alt="item.bookNm">
              </div>
              <div class="thumb-info">
                <div class="book-kind">
                  <span :class="['motion-book', { 'show' : item.isMotionBook }]">모션북</span>
                  <span :class="['e-book', { 'show' : item.isEbook }]">이북</span>
                </div>
                <div class="thumb-bottom-right">
                  <span class="ico-guide" v-if="item.isGuide"></span>
                  <button :class="['save',{ 'save-off' : item.isStorage }]" @click="toggleStorage(index, item.bookId, item.isStorage)"></button>
                </div>
              </div>
              <div class="view" @click="mixin_openBook({ 'path' : 'R', 'entry' : 'KoreanLibrary', 'index' : `${index}` }, item)"></div>
            </div>
            <div class="tag-wrap shadow-box">
              <div class="tag">
                <img v-if="item.mainAreaCd === '1'" src="@/assets/img/launcher-readingclub/library/kor/ico_tag_sociality.webp" alt="사회성" class="tag-item">
                <img v-if="item.mainAreaCd === '2'" src="@/assets/img/launcher-readingclub/library/kor/ico_tag_language.webp" alt="언어" class="tag-item">
                <img v-if="item.mainAreaCd === '3'" src="@/assets/img/launcher-readingclub/library/kor/ico_tag_recognition.webp" alt="인지" class="tag-item">
                <img v-if="item.mainAreaCd === '4'" src="@/assets/img/launcher-readingclub/library/kor/ico_tag_emotion.webp" alt="정서" class="tag-item">
                <img v-if="item.mainAreaCd === '5'" src="@/assets/img/launcher-readingclub/library/kor/ico_tag_creativity.webp" alt="창의사고" class="tag-item">
                <img v-if="item.subAreaCd === '1'" src="@/assets/img/launcher-readingclub/library/kor/ico_tag_sociality.webp" alt="사회성" class="tag-item">
                <img v-if="item.subAreaCd === '2'" src="@/assets/img/launcher-readingclub/library/kor/ico_tag_language.webp" alt="언어" class="tag-item">
                <img v-if="item.subAreaCd === '3'" src="@/assets/img/launcher-readingclub/library/kor/ico_tag_recognition.webp" alt="인지" class="tag-item">
                <img v-if="item.subAreaCd === '4'" src="@/assets/img/launcher-readingclub/library/kor/ico_tag_emotion.webp" alt="정서" class="tag-item">
                <img v-if="item.subAreaCd === '5'" src="@/assets/img/launcher-readingclub/library/kor/ico_tag_creativity.webp" alt="창의사고" class="tag-item">
              </div>
            </div>
          </li>
        </ul>
        <div v-if="isNodata" class="no-data"><span></span></div>
      </div>
      <TopButton></TopButton>
    </div>
    <viewerModal :propsData="{ viewerInfo }" @openBookRun="openBookRun" @openViewerPopup="openViewerPopup" @closeViewerPopup="closeViewerPopup"></viewerModal>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import readingClubFactory from "@/api/reading-club/readingClub-factory";
import functionMixin from "@/common/mixin/functionMixin";
import viewerMixin from "@/common/mixin/viewerMixin";
import viewerModal from '@/components/launcher-readingclub/modals/model-viewer.vue';
import TopButton from '@/components/launcher-readingclub/elements/top-button.vue'

const koreanLibraryApi = readingClubFactory.get('koreanLibrary');
export default {
  mixins: [
    functionMixin,
    viewerMixin
  ],
  data() {
    return {
      viewerInfo : {
        isModal : false,
        modalType : 'type',
        modalData : {},
      },
      studentId : '',
      currentAge : '',
      ageData : [
        {
          age : '',
          label : '전체'
        },
        {
          age : '3',
          label : '3세'
        },
        {
          age : '4',
          label : '4세'
        },
        {
          age : '5',
          label : '5세'
        },
        {
          age : '6',
          label : '6세 이상'
        }
      ],
      bookListData : [],
      bookTotalCount : 0,
      scrollData : {
        pageIndex : 1,
        pageSize : 15,
        isLoading : false
      },
      isScrollUp: false,
      lastScrollPosition: 0,
      isNodata : false
    }
  },
  components : {
    viewerModal,
    TopButton
  },
  computed: {
    ...mapGetters(['userInfo']),
    ...mapGetters('koreanLibraryStorage', ['getKorCategory', 'getKorSubCategory'])
  },
  created() {
    this.studentId = this.userInfo.info.studentId;
    this.currentAge = (this.getKorSubCategory.id === 'bookAgeCd') ? this.getKorSubCategory.name : '';
  },
  mounted() {
    this.getKorLibrary();
    this.addInfiniteScroll();
  },
  methods: {
    addInfiniteScroll() {
      document.querySelector('.content-scroll-area').addEventListener('scroll',this.setInfiniteScroll)
    },
    setInfiniteScroll() {
      if (!this.isLastScroll()) {
        const element = document.querySelector('.content-scroll-area')
        if (element.clientHeight + element.scrollTop >= element.scrollHeight - 10) {
          if (this.scrollData.isLoading === false) {
            this.scrollData.isLoading = true;
            this.scrollData.pageIndex++;
            this.getKorLibrary();
          }
        }
      }
    },
    isLastScroll() {
      return this.bookTotalCount === this.bookListData.length;
    },
    getKorLibrary() {
      const params = {
        searchType: this.translateType(this.getKorCategory),
        searchValue: this.getKorSubCategory.id,
        studentId: this.studentId,
        searchAge: this.currentAge,
        pageSize: this.scrollData.pageSize,
        pageIndex: this.scrollData.pageIndex
      }
      const libraryData = koreanLibraryApi.getKorLibrary(params);
      libraryData.then((res) => {
        if (res.status === 200) {
          Array.prototype.push.apply(this.bookListData, res.data.data.items);
          this.bookTotalCount = res.data.data.totalCount;
          if (this.bookTotalCount === 0) { this.isNodata = true }
          this.scrollData.isLoading = false;
          // 스크롤 추가로 + 150
          if (this.scrollData.pageIndex !== 1) {
            const element = document.querySelector('.content-scroll-area')
            let t = element.scrollTop;
            setTimeout(function () {
              element.scrollTo({top: t + 150, behavior: 'smooth'})
            }, 10);
          }
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    translateType(type) {
      let label = '';
      switch (type) {
        case 'kind' :
          label = 'brancheKor';
          break;
        case 'develop' :
          label = 'bookArea';
          break;
        case 'keyword' :
          label = 'keyword';
          break;
        case 'pub' :
          label = 'publisherKor';
          break;
        case 'age' :
          label = 'bookAgeCd';
          break;
      }
      return label;
    },
    toggleAge(age) {
      this.currentAge = age;
      this.bookListData = [];
      this.scrollData.pageIndex = 1;
      this.getKorLibrary();
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