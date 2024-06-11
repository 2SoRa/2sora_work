<template>
  <div class="library sub library-search eng">
    <div class="sub-gnb">
      <div class="sub-gnb-left">
        <button type="button" class="btn-back" @click="this.$router.go(-1)"></button>
      </div>
      <h1>영어 도서관</h1>
      <div class="sub-gnb-right">
        <button type="button" class="btn-close"><router-link :to="{ name: 'ReadingClubMainView' }">close</router-link></button>
      </div>
    </div>
    <div class="contents content-scroll-area"> <!-- :class="{'mg0' : isList}" -->
      <form class="select-search-form form-area">
        <div class="select-toggle-wrap">
          <div class="title-btn-wrap">
            <p class="toggle-title"><img src="@/assets/img/launcher-readingclub/common/img_tit_search_terms.webp" alt="상세 검색 조건" class="tit-search-terms-w"></p>
            <button type="button" @click="toggleBtn" class="btn-toggle">
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
                <div class="radio-round-group circle radio-row-2 gap-15">
                  <div class="radio-input">
                    <input type="radio" id="all" name="book-form" value="" checked v-model="selectedBookMode">
                    <label for="all">전체</label>
                  </div>
                  <div class="radio-input">
                    <input type="radio" id="motionBook" name="book-form" value="MO" v-model="selectedBookMode">
                    <label for="motionBook">모션북</label>
                  </div>
                  <div class="radio-input">
                    <input type="radio" id="ebook" name="book-form" value="EB" v-model="selectedBookMode">
                    <label for="ebook">이북</label>
                  </div>
                </div>
<!--                <p class="select-info">Oxford Readers 검색은 전용 페이지를 이용해 주세요.</p>-->
              </fieldset>
              <span class="border"></span>
              <!-- AR 지수 Radio -->
              <fieldset>
                <legend>AR지수 전체, 1.0미만, 1.0~1.5, 1.6~2.0, 2.1~2.5, 2.6~3.0, 3.1~3.5, 3.6~4.0,  4.1이상 중 하나 선택</legend>
                <p class="form-title">AR 지수</p>
                <div class="radio-round-group circle radio-row-2 gap-15">
                  <div class="radio-input">
                    <input type="radio" id="allAR" name="book-ar" value="" checked v-model="selectedBookAR">
                    <label for="allAR">전체</label>
                  </div>
                  <div class="radio-input">
                    <input type="radio" id="1.0" name="book-ar" value="0~0.9" v-model="selectedBookAR">
                    <label for="1.0">1.0 미만</label>
                  </div>
                  <div class="radio-input">
                    <input type="radio" id="1.5" name="book-ar" value="1.0~1.5" v-model="selectedBookAR">
                    <label for="1.5">1.0~1.5</label>
                  </div>
                  <div class="radio-input">
                    <input type="radio" id="2.0" name="book-ar" value="1.6~2.0" v-model="selectedBookAR">
                    <label for="2.0">1.6~2.0</label>
                  </div>
                  <div class="radio-input">
                    <input type="radio" id="2.5" name="book-ar" value="2.1~2.5" v-model="selectedBookAR">
                    <label for="2.5">2.1~2.5</label>
                  </div>
                  <div class="radio-input">
                    <input type="radio" id="3.0" name="book-ar" value="2.6~3.0" v-model="selectedBookAR">
                    <label for="3.0">2.6~3.0</label>
                  </div>
                  <div class="radio-input">
                    <input type="radio" id="3.5" name="book-ar" value="3.1~3.5" v-model="selectedBookAR">
                    <label for="3.5">3.1~3.5</label>
                  </div>
                  <div class="radio-input">
                    <input type="radio" id="4.0" name="book-ar" value="3.6~4.0" v-model="selectedBookAR">
                    <label for="4.0">3.6~4.0</label>
                  </div>
                  <div class="radio-input">
                    <input type="radio" id="4.1" name="book-ar" value="4.1~" v-model="selectedBookAR">
                    <label for="4.1">4.1이상</label>
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
              <legend>영어도서관 도서 검색하기</legend>
              <div class="search-btn-group">
                <input type="text" id="searchText" placeholder="검색어를 입력하세요" v-model="searchText"
                       v-on:keyup.enter="getSearchBookButton"
                       @input="keywordChange($event)" autocomplete="off">
                <div class="btn-wrap">
                  <button class="delete" :class="{active: searchText.length > 0}" type="button" @click="keywordReset"></button>
                  <button class="glass" type="button" @click="getSearchBook('all')"></button>
                </div>
              </div>
            </fieldset>
          </div>
          <!-- 최근 검색 단어 -->
          <div v-if="engLibrarySearchData !== null && !isSearch">
            <ul class="recent-word">
              <li v-for="item in engLibrarySearchData" :key="item">
                <p @click="getTagSearch(item)">{{ item }}</p>
                <button @click="tagDelete(item)"></button>
              </li>
            </ul>
          </div>
        </div>
      </form>

      <!--  검색결과-->
      <div class="search-result" v-show="isSearch">
        <!-- TODO : V모드 적용 도서 체크박스, 모달 버튼 -->
        <div class="input-box-chk border-bd-gray vscan-chk-group">
          <input type="checkbox" id="vmodechk" v-model="isVmode" @change="toggleVmode">
          <label for="vmodechk">V모드 적용 도서</label>
          <button type="button" class="btn-question" @click="toggleVmodal"><i class="ico ico-question-pp"></i></button>
        </div>
        <div v-show="isList">
          <p>총 <span>{{bookTotalCount}}</span>권을 찾았어요.</p>
          <form class="form-area">
            <fieldset>
              <legend>V 모드 적용 체크박스 & 책 구분 & 정렬</legend>
              <div class="book-icon"></div>
              <div class="dropdown-wrap">
                <div class="dropdown type-aqua-blue mr purple">
                  <v-select
                      label="cdVlNm"
                      :options="bookAlignItem"
                      v-model="selectedBookAlign"
                      :reduce="bookAlignItem => bookAlignItem.cdVl">
                    <template #open-indicator="{ attributes }">
                <span v-bind="attributes">
                  <img src="@/assets/img/launcher-readingclub/common/icons/ico_dropdown_purple.webp" alt="검색 결과 정렬 메뉴">
                </span>
                    </template>
                  </v-select>
                </div>
              </div>
            </fieldset>
          </form>
          <div class="book-list-wrap">
            <!--  책 뿌려주기-->
            <div class="row-group">
              <ul class="book-list">
                <li v-for="(item,index) in bookListData" :key="item" class="list-item">
                  <div class="thumb-wrap">
                    <!-- 완독표시-->
                    <span class="sta-book" :class="{ 'check-read' : item.isRead }"></span>
                    <div class="thumbnail">
                      <img :src="item.thumbUrl" @error="replaceDefault">
                    </div>
                    <div class="thumb-info">
                      <div class="book-kind">
                        <span :class="{show : item.isMotionBook}" class="motion-book">모션북</span>
                        <span :class="{show : item.isEbook}" class="e-book">이북</span>
                      </div>
                      <div class="thumb-bottom-right">
                        <span class="ico-guide" v-if="item.isGuide"></span>
                        <button class="save" @click="toggleStorage(index, item.bookId, item.isStorage, 'english')" :class="{ 'save-off' : item.isStorage }"></button>
                      </div>
                    </div>
                    <div class="view" @click="mixin_openBook({ 'path' : 'R', 'entry' : 'EnglishLibrary', 'index' : `${index}` }, item)"></div>
                  </div>
                  <!--단계,AR표시-->
                  <div class="tag-wrap shadow-box">
                    <div class="tag ar">
                      <p v-if="item.bookEngStep === 'B'" class="tag-item step basic">Basic</p> <!--단계표시-->
                      <p v-if="item.bookEngStep === 'I'" class="tag-item step intermediate">Intermediate</p>
                      <p v-if="item.bookEngStep === 'A'" class="tag-item step advanced">Advanced</p>
                      <p class="tag-item level">AR {{item.arLevel}}</p><!--AR표시-->
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
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

    <!-- TODO : V 모드 보기 안내 팝업 -->
    <div class="info-pop-wrap pos-fixed" v-show="isVmodeShow">
      <div class="guide-content guide-vmode">
        <button type="button" class="btn-close" @click="toggleVmodal"><!-- 툴팁 닫기 --></button>
        <div class="contents">
          <img src="@/assets/img/launcher-readingclub/guide/guide_vmode.webp" alt="V 모드란?">
        </div>
      </div>
    </div>

    <viewerModal :propsData="{ viewerInfo }" @openBookRun="openBookRun" @openViewerPopup="openViewerPopup" @closeViewerPopup="closeViewerPopup"></viewerModal>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import readingClubFactory from "@/api/reading-club/readingClub-factory";
import functionMixin from "@/common/mixin/functionMixin";
import viewerMixin from "@/common/mixin/viewerMixin";
import TopButton from '@/components/launcher-readingclub/elements/top-button.vue'
import viewerModal from "@/components/launcher-readingclub/modals/model-viewer.vue";

const englishLibraryApi = readingClubFactory.get('englishLibrary')
export default {
  mixins: [functionMixin,viewerMixin],
  data() {
    return {
      viewerInfo : {
        isModal : false,
        modalType : 'type',
        modalData : {}
      },
      studentId:'',
      searchText:'',
      bookListData: [],
      //상세검색조건 펼치기 여부
      isShow: true,
      isList:false,
      isStorage: true,
      isSearch: false,
      bookData: '1',
      selectedBookMode:'',
      selectedBookAR:'',
      engLibrarySearchData:[],
      isScrollUp: false,
      lastScrollPosition: 0,
      bookTotalCount: 0,
      pageIndex:1,
      isLoading : false,
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
        {
          cdVl: 'L',
          cdVlNm: '단계 낮은 순',
        }
      ],
      selectedBookAlign: 'P',
      isVmode : false,
      isVmodeShow : false
    };
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
  },
  mounted() {
    if(JSON.parse(localStorage.getItem('engStorageSearchText'))) {
      this.engLibrarySearchData = JSON.parse(localStorage.getItem('engStorageSearchText'));
    }
    this.addInfiniteScroll();
    this.hideKeyboard();
  },
  watch: {
    selectedBookAlign(oldValue,newValue) {
      if(oldValue !== newValue){
        this.bookListData = [];
        this.pageIndex = 1;
        this.getSearchBook();
      }
    },
  },
  methods: {
    isLastScroll() {
      return this.bookTotalCount === this.bookListData.length;
    },
    addInfiniteScroll() {
      document.querySelector('.content-scroll-area').addEventListener('scroll',this.setInfiniteScroll)
    },
    setInfiniteScroll() {
      if (!this.isLastScroll()){
        const tg = document.querySelector('.content-scroll-area');
        if (tg.clientHeight + tg.scrollTop >= tg.scrollHeight-10) {
          if (this.isLoading === false) {
            this.isLoading = true;
            this.pageIndex++;
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
        this.pageIndex = 1;
        this.selectedBookAlign = 'P';
        this.bookListData = [];
        this.isVmode = false;
      }
      if (this.searchText.length === 0) {
        alert('1글자 이상 검색해주세요.');
        return;
      }
      const params = {
        studentId: this.studentId,
        bookType: this.selectedBookMode,
        searchValue: this.searchText,
        arLevels: this.selectedBookAR,
        orderType: this.selectedBookAlign,
        pageSize: 15,
        pageIndex:this.pageIndex,
        vmodeYn:this.isVmode ? 'Y' : 'N'
      }
      const librarySearchData = englishLibraryApi.getEngLibrarySearch(params);
      librarySearchData.then((res) => {
        Array.prototype.push.apply(this.bookListData, res.data.data.items);
        this.bookTotalCount = res.data.data.totalCount;
        this.isLoading = false;
        this.isResult();

        // 스크롤 추가로 + 150
        if (this.pageIndex !== 1) {
          const element = document.querySelector('.content-scroll-area')
          let t = element.scrollTop;
          setTimeout(function () {
            element.scrollTo({top: t + 150, behavior: 'smooth'})
          }, 10);
        }
      }).catch((error) => {
        console.log(error)
      })
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
        this.tagSave();
      }
    },
    getTagSearch(tag) {
      this.searchText = tag;
      this.getSearchBook('all');
    },
    keywordChange(event) {
      if (event.target.value.length > 0) {
        document.querySelector('button.delete').classList.add('active');
      } else {
        document.querySelector('button.delete').classList.remove('active');
      }
    },
    keywordReset() {
      this.bookListData = null;
      this.searchText = '';
      this.isShow = true;
      this.isSearch = false;
      this.isList = false;
      this.selectedBookAlign = 'P';
      this.selectedBookMode = '';
      this.selectedBookAge = '';
    },
    tagSave() {
      //2글자 미만이면 저장하지 않음
      if(this.searchText.length <=1 && this.searchText.length !== 0 ) return;

      if (this.engLibrarySearchData?.indexOf(this.searchText) === -1) {
        if (this.searchText) {
          this.engLibrarySearchData.unshift(this.searchText);
          if (this.engLibrarySearchData.length > 5) {
            this.engLibrarySearchData.pop();
          }
        }
        localStorage.setItem('engStorageSearchText', JSON.stringify(this.engLibrarySearchData));
        // this.searchText = this.engLibrarySearchData[0]
      }
    },
    tagDelete(item) {
      const deleteIndex = this.engLibrarySearchData.indexOf(item);
      this.engLibrarySearchData.splice(deleteIndex, 1)
      localStorage.setItem('engStorageSearchText', JSON.stringify(this.engLibrarySearchData))
    },
    //상세조건 펼치기 여부
    toggleBtn() {
      this.isShow = !this.isShow;
    },
    hideKeyboard() {
      const input = document.querySelector('.vs__selected-options .vs__search');
      input.setAttribute('inputmode','none');
      input.setAttribute('readonly','readonly');
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
    },

    toggleVmode() {
      this.bookListData = [];
      this.pageIndex = 1;
      this.getSearchBook();
      setTimeout(function () {
        document.querySelector('.content-scroll-area').scrollTo({top: 0})
      }, 1000);
    },
    toggleVmodal() {
      this.isVmodeShow = !this.isVmodeShow;
    }
  }
};
</script>

