<template>
  <!-- 한글 도서관 : 검색하기 -->
  <div class="library sub library-search">
    <div class="sub-gnb">
      <div class="sub-gnb-left">
        <button type="button" @click="this.$router.go(-1)" class="btn-back">back</button>
      </div>
      <h1>한글 도서관</h1>
      <div class="sub-gnb-right">
        <button type="button" class="btn-close"><router-link :to="{ name : 'ReadingClubMainView' }">close</router-link></button>
      </div>
    </div>
    <div class="contents content-scroll-area"> <!-- :class="{'mg0' : isList}" -->
      <form class="select-search-form form-area">
        <div class="select-toggle-wrap">
          <div class="title-btn-wrap">
            <p class="toggle-title"><img src="@/assets/img/launcher-readingclub/common/img_tit_search_terms.webp" alt="상세 검색 조건" class="tit-search-terms-w"></p>
            <button type="button" @click="toggleOption" class="btn-toggle">
              <template v-if="isShow">접기<i class="ico ico-toggle-arr-up"></i></template>
              <template v-else>펼치기<i class="ico ico-toggle-arr-up down"></i></template>
            </button>
          </div>
          <!-- 검색 조건 화면  -->
          <div v-if="isShow">
            <div class="select-rdo-group">
              <!-- 도서 형태 Radio -->
              <fieldset>
                <legend>도서 형태 전체, 모션북, 이북 중 하나 선택</legend>
                <p class="form-title">도서 형태</p>
                <div class="radio-round-group circle">
                  <div class="radio-input">
                    <input type="radio" id="all" name="book-form" value="" checked v-model="selectedBookMode">
                    <label for="all">전체</label>
                  </div>
                  <div class="radio-input">
                    <input type="radio" id="motion-book" name="book-form" value="MO" v-model="selectedBookMode">
                    <label for="motion-book">모션북</label>
                  </div>
                  <div class="radio-input">
                    <input type="radio" id="e-book" name="book-form" value="EB" v-model="selectedBookMode">
                    <label for="e-book">이북</label>
                  </div>
                </div>
              </fieldset>
              <span class="border"></span>
              <!-- 권장 연령 Radio -->
              <fieldset>
                <legend>권장 연령 전체, 3세, 4세, 5세, 6세 이상 중 하나 선택</legend>
                <p class="form-title">권장 연령</p>
                <div class="radio-round-group circle">
                  <div class="radio-input">
                    <input type="radio" id="ageall" name="age-check" value="" checked v-model="selectedBookAge">
                    <label for="ageall">전체</label>
                  </div>
                  <div class="radio-input">
                    <input type="radio" id="age3" name="age-check" value="3" v-model="selectedBookAge">
                    <label for="age3">3세</label>
                  </div>
                  <div class="radio-input">
                    <input type="radio" id="age4" name="age-check" value="4" v-model="selectedBookAge">
                    <label for="age4">4세</label>
                  </div>
                  <div class="radio-input">
                    <input type="radio" id="age5" name="age-check" value="5" v-model="selectedBookAge">
                    <label for="age5">5세</label>
                  </div>
                  <div class="radio-input">
                    <input type="radio" id="age6" name="age-check" value="6" v-model="selectedBookAge">
                    <label for="age6">6세 이상</label>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
        </div>
        <div class="search-recent-wrap">
          <!-- 검색 폼 -->
          <div class="search-bar">
            <fieldset>
              <legend>한글도서관 도서 검색하기</legend>
              <div class="search-btn-group">
                <input type="text" id="searchText" placeholder="검색어를 입력하세요" v-model="searchText"
                       v-on:keyup.enter="getSearchBookButton"
                       @input="keywordChange($event)" autocomplete="off">
                <div class="btn-wrap">
                  <button class="delete" :class="{active: searchText.length > 0}"  type="button" @click="keywordReset"></button>
                  <button class="glass" type="button" @click="getSearchBook('all')"></button>
                </div>
              </div>
            </fieldset>
          </div>
          <!-- 최근 검색 단어 -->
          <template v-if="korLibrarySearchData !== null && !isSearch">
            <ul class="recent-word">
              <li v-for="item in korLibrarySearchData" :key="item">
                <p @click="getTagSearch(item)">{{ item }}</p>
                <!-- TODO: 클릭시 검색어 삭제 기능 추가 필요 -->
                <button @click="tagDelete(item)">X</button>
              </li>
            </ul>
          </template>
        </div>
      </form>

      <!-- 검색 완료 -->
      <div class="search-result" v-show="isSearch">
        <!-- 검색 결과 있을 때 -->
        <div v-show="isList">
          <p>총 <span>{{ bookTotalCount }}</span>권의 책을 찾았어요.</p>
          <form class="form-area">
            <fieldset>
              <legend></legend>
              <div class="book-icon"></div>
              <div class="dropdown-wrap">
                <div class="dropdown type-aqua-blue mr">
                  <v-select
                    label="cdVlNm"
                    :options="bookAlignItem"
                    v-model="selectedBookAlign"
                    :reduce="bookAlignItem => bookAlignItem.cdVl">
                    <template #open-indicator="{ attributes }">
                      <span v-bind="attributes">
                        <img src="@/assets/img/launcher-readingclub/common/icons/ico_dropdown_blue.webp" alt="검색 결과 정렬 메뉴">
                      </span>
                    </template>
                  </v-select>
                </div>
              </div>
            </fieldset>
          </form>
          <div class="book-list-wrap" >
            <!-- 책 목록 -->
            <ul class="book-list">
                <li v-for="(item, index) in bookListData" :key="item" class="list-item">
                  <div class="thumb-wrap">
                    <span class="sta-book check-read" v-if="item.isRead"></span> <!-- 읽음표시 -->
                    <div class="thumbnail">
                      <img :src="item.thumbUrl" @error="replaceDefault">
                    </div>
                    <div class="thumb-info">
                      <div class="book-kind">
                        <span :class="['motion-book', { 'show' : item.isMotionBook }]">모션북</span>
                        <span :class="['e-book', { 'show' : item.isEbook }]">이북</span>
                      </div>
                      <div class="thumb-bottom-right">
                        <span class="ico-guide" v-if="item.isGuide"></span>
                        <button class="save" @click="toggleStorage(index, item.bookId, item.isStorage)" :class="{ 'save-off' : item.isStorage }"></button> <!-- 담기 &빼기 -->
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
          </div>
        </div>
        <!-- 검색 결과 없을 때 -->
        <div v-show="!isList">
          <div class="book-list-wrap">
            <div class="no-data">
              <span></span>
            </div>
          </div>
        </div>
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
import TopButton from '@/components/launcher-readingclub/elements/top-button.vue'
import viewerModal from "@/components/launcher-readingclub/modals/model-viewer.vue";

const koreanLibraryApi = readingClubFactory.get('koreanLibrary')
export default {
  mixins : [
    functionMixin,
    viewerMixin
  ],
  data() {
    return {
      viewerInfo : {
        isModal : false,
        modalType : 'type',
        modalData : {}
      },
      studentId : '',
      searchText : '',
      bookListData : [],
      bookTotalCount : 0,
      isShow : true,
      isSearch : false,
      isList : false,
      bookAlignItem: [
        {
          cdVl: 'P',
          cdVlNm: '인기순',
        },
        {
          cdVl: 'R',
          cdVlNm: '최신순',
        },
        {
          cdVl: 'N',
          cdVlNm: '이름순',
        },
      ],
      selectedBookAlign : 'P',
      selectedBookMode : '',
      selectedBookAge : '',
      korLibrarySearchData : [],
      scrollData : {
        pageIndex : 1,
        pageSize : 15,
        isLoading : false
      },
      isScrollUp : false,
      lastScrollPosition : 0
    }
  },
  components : {
    TopButton,
    viewerModal
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  created() {
    this.studentId = this.userInfo.info.studentId;
  },
  mounted() {
    this.initTagSearch();
    this.addInfiniteScroll();
    this.hideKeyboard();
  },
  watch: {
    selectedBookAlign(oldValue, newValue) {
      if (oldValue !== newValue) {
        this.bookListData = [];
        this.scrollData.pageIndex = 1;
        this.getSearchBook();
      }
    }
  },
  methods: {
    isLastScroll() {
      return this.bookTotalCount === this.bookListData.length;
    },
    initTagSearch() {
      if(JSON.parse(localStorage.getItem('storageSearchText'))) {
        this.korLibrarySearchData = JSON.parse(localStorage.getItem('storageSearchText'));
      }
    },
    addInfiniteScroll() {
      document.querySelector('.content-scroll-area').addEventListener('scroll',this.setInfiniteScroll)
    },
    setInfiniteScroll() {
      if (!this.isLastScroll()) {
        const tg = document.querySelector('.content-scroll-area')
        if (tg.clientHeight + tg.scrollTop >= tg.scrollHeight - 10) {
          if (this.scrollData.isLoading === false) {
            this.scrollData.isLoading = true;
            this.scrollData.pageIndex++;
            this.getSearchBook();
          }
        }
      }
    },
    getSearchBookButton() {
      document.querySelector('.glass').click();
      const ipt = document.querySelector("#searchText");
      ipt.setAttribute('inputmode','none');
      ipt.setAttribute('readonly','readonly');
      setTimeout(() => {
        ipt.removeAttribute('inputmode');
        ipt.removeAttribute('readonly');
      },1000);
    },
    getSearchBook(type) {
      if (type === 'all') {
        this.bookListData = [];
        this.scrollData.pageIndex = 1;
      }
      if (this.searchText.length === 0) {
        alert('1글자 이상 검색해주세요.');
        return;
      }
      const params = {
        studentId: this.studentId,
        bookType: this.selectedBookMode,
        searchValue: this.searchText,
        searchAge: this.selectedBookAge,
        orderType: type === 'all' ? 'P' : this.selectedBookAlign,
        pageSize: this.scrollData.pageSize,
        pageIndex: type === 'all' ? 1 : this.scrollData.pageIndex
      }
      const librarySearchData = koreanLibraryApi.getKorLibrarySearch(params);
      librarySearchData.then((res) => {
        if (res.status === 200) {
          Array.prototype.push.apply(this.bookListData, res.data.data.items);
          this.bookTotalCount = res.data.data.totalCount;
          this.scrollData.isLoading = false;
          this.isResult();
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
      });
      this.isResultSearch();
    },
    isResultSearch() {
      this.isSearch = true;
      this.isShow = false;
    },
    isResult() {
      if (this.bookListData && this.bookListData.length > 0) {
        this.isList = true;
        this.tagSave();
      } else {
        this.isList = false;
      }
    },
    getTagSearch(tag) {
      this.searchText = tag;
      this.getSearchBook('all');
    },
    toggleOption() {
      this.isShow = !this.isShow;
    },
    viewComplete() {
    },
    keywordReset() {
      this.bookListData = null;
      this.searchText = '';
      this.isShow = true;
      this.isSearch = false;
      this.isList = false;
      this.selectedBookMode = '';
      this.selectedBookAge = '';
    },
    keywordChange(event) {
      if (event.target.value.length > 0) {
        document.querySelector('button.delete').classList.add('active');
      } else {
        document.querySelector('button.delete').classList.remove('active');
      }
    },
    tagSave() {
      //2글자 미만이면 저장하지 않음
      if(this.searchText.length <=1 && this.searchText.length !== 0 ) return;

      if (this.korLibrarySearchData?.indexOf(this.searchText) === -1) {
        if (this.searchText) {
          this.korLibrarySearchData.unshift(this.searchText);
          if (this.korLibrarySearchData.length > 5) {
            this.korLibrarySearchData.pop();
          }
        }
        localStorage.setItem('storageSearchText', JSON.stringify(this.korLibrarySearchData));
        // this.searchText = this.korLibrarySearchData[0]
      }
    },
    tagDelete(item) {
      const deleteIndex = this.korLibrarySearchData.indexOf(item);
      this.korLibrarySearchData.splice(deleteIndex, 1)
      localStorage.setItem('storageSearchText', JSON.stringify(this.korLibrarySearchData))
    },
    openContents(item) {
      const token = localStorage.getItem("accessToken");
      const url = window.location.href;
      let baseUrl = '';

      if (url.indexOf("https://stw.superv.com/") > -1) {
        baseUrl = 'https://study.superv.com'
      } else {
        baseUrl = 'https://dev-study.superv.com'
      }

      location.href = `intent:#Intent;package=${item.packageName};i.lectureKey=${item.study_lecture_id};i.studentId=${this.userInfo.info.studentId};S.baseUrl=${baseUrl};S.launchMode=default;S.authToken=${token};i.courseKey=${item.study_course_id};S.paymentKey=${item.paymentKey};S.audioFileUrl=${item.audioFileUrl};end`;
    },
    hideKeyboard() {
      const input = document.querySelector('.vs__selected-options .vs__search');
      input.setAttribute('inputmode', 'none');
      input.setAttribute('readonly', 'readonly');
    },
    replaceDefault(e) {
      e.target.src = require('@/assets/img/launcher-readingclub/common/thumbnail_default.png')
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
  }
}
</script>