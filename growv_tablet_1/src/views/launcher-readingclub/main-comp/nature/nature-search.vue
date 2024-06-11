<template>
  <div class="library sub library-search">
    <div class="sub-gnb">
      <div class="sub-gnb-left">
        <button type="button" @click="this.$router.go(-1)" class="btn-back">back</button>
      </div>
      <h1>자연 관찰 도서 검색</h1>
      <div class="sub-gnb-right">
        <button type="button" class="btn-close"><router-link :to="{ name : 'natureMain' }">close</router-link></button>
      </div>
    </div>
    <div class="contents">
      <div class="search">
        <div class="search-box">
          <!-- 검색 폼 -->
          <div class="search-bar">
            <form class="form-area">
              <fieldset>
                <legend>검색어 입력</legend>
                <input type="text" id="searchText" placeholder="검색어를 입력하세요" v-model="searchText"
                       @input="keywordChange($event)">
                <div class="btn-wrap ">
                  <button class="delete" type="button" @click="keywordReset"></button>
                  <button class="glass disabled" type="button" @click="getSearchBook"></button>
                </div>
              </fieldset>
            </form>
          </div>
          <!-- 최근 검색 단어 -->
          <template v-if="korLibrarySearchData !== null">
            <ul class="recent-word">
              <li v-for="item in korLibrarySearchData" :key="item">
                <p @click="getTagSearch(item)">
                  {{ item }}
                </p>
                <!-- TODO: 클릭시 검색어 삭제 기능 추가 필요 -->
                <button @click="tagDelete(item)">X</button>
              </li>
            </ul>
          </template>
        </div>
      </div>
      <div class="search-result book-list-wrap" v-if="isSearch">
        <!-- 검색 결과 있을 때 -->
        <template v-if="isList">
          <p>총 <span>N</span>권의 책을 찾았어요.</p>
          <form class="form-area">
            <fieldset>
              <legend></legend>
              <div class="book-icon"></div>
              <div class="dropdown-wrap">
                <div class="dropdown type-aqua-blue">
                  <v-select
                    label="cdVlNm"
                    :options="bookAlignItem"
                    v-model="selectedBookAlign"
                    :reduce="bookAlignItem => bookAlignItem.cdVl">
                    <template #open-indicator="{ attributes }">
                      <span v-bind="attributes">
                        <img src="@/assets/img/launcher-readingclub/common/icons/ico_dropdown_arr_down.webp">
                      </span>
                    </template>
                  </v-select>
                </div>
              </div>
            </fieldset>
          </form>
          <div class="content-scroll-area auto-height">
            <div class="row-group">
              <ul class="book-list">
                <li v-for="(item, index) in bookListData" :key="item" class="list-item">
                  <div class="thumb-wrap">
                    <span class="sta-book check-read" v-if="item.isRead"></span>
                    <div class="thumbnail">
                      <img :src="item.image">
                    </div>
                    <div class="thumb-info">
                      <div class="book-kind">
                        <span :class="{show : item.isMotionBook}" class="motion-book">모션북</span>
                        <span :class="{show : item.isEbook}" class="e-book">이북</span>
                      </div>
                      <button class="save" @click="toggleStorage(index, item.bookId, item.isStorage)" :class="{ 'save-off' : !item.isStorage }"></button>
                    </div>
                    <!-- TODO: 도서 연결 기능 추가 필요 -->
                    <div class="view" @click="$openBook(item.bookId)"></div>
                  </div>
                  <div class="tag-wrap shadow-box">
                    <!-- TODO: api 나오면 그때 두개만 나오게 처리 추가 필요 -->
                    <div class="tag">
                      <img src="@/assets/img/launcher-readingclub/library/kor/ico_tag_sociality.webp" alt="사회성" class="tag-item">
                      <img src="@/assets/img/launcher-readingclub/library/kor/ico_tag_emotion.webp" alt="정서" class="tag-item">
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="no-data">
            <span></span>
          </div>
        </template>
      </div>
      <button class="btn-top" :class="{ show : isScrollUp }" @click="moveTop"></button>
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import readingClubFactory from "@/api/reading-club/readingClub-factory";
import functionMixin from "@/common/mixin/functionMixin";

const natureApi = readingClubFactory.get('nature');
export default {
  mixins : [ functionMixin ],
  data() {
    return {
      studentId: '',
      searchText: '',
      bookListData: null,
      isSearch: false,
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
      selectedBookAlign: 'P',
      isScrollUp: false,
      lastScrollPosition: 0,
      korLibrarySearchData: [],
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  created() {
    this.studentId = this.userInfo.info.studentId;
  },
  mounted() {
    if (localStorage.getItem('storageSearchText')) {
      this.korLibrarySearchData = JSON.parse(localStorage.getItem('storageSearchText'));
    }
  },
  watch: {
    selectedBookAlign() {
      this.getSearchBook();
    }
  },
  methods: {
    getSearchBook() {
      if (this.searchText) {
        const params = {
          studentId: this.studentId,
          searchValue: this.searchText,
          orderType: this.selectedBookAlign,
          pageSize: 10,
          pageIndex: 1
        }
        const natureSearchData = natureApi.getNatureSearch(params);
        natureSearchData.then((res) => {
          if (res.status === 200) {
            this.bookListData = res.data.data.items;
            this.isResult();
          }
        }).catch((err) => {
          console.log(err)
        });
        this.isResultSearch();
      }
    },
    getTagSearch(tag) {
      this.searchText = tag;
      this.getSearchBook();
    },
    isResultSearch() {
      this.isSearch = true;
    },
    isResult() {
      if (this.bookListData && this.bookListData.length > 0) {
        this.isList = true;
        this.tagSave();
      } else {
        this.isList = false;
      }
    },
    keywordChange(event) {
      if (event.target.value.length > 0) {
        document.querySelector('button.delete').classList.add('active');
        document.querySelector('button.glass').classList.remove('disabled');
      } else {
        document.querySelector('button.delete').classList.remove('active');
        document.querySelector('button.glass').classList.add('disabled');
      }
    },
    keywordReset() {
      this.searchText = '';
      this.isSearch = false;
      this.isList = false;
      this.bookListData = null;
      document.querySelector('#searchText').focus();
    },
    tagSave() {
      if (this.korLibrarySearchData.indexOf(this.searchText) === -1) {
        if (this.searchText) {
          this.korLibrarySearchData.unshift(this.searchText);
          if (this.korLibrarySearchData.length > 5) {
            this.korLibrarySearchData.pop();
          }
        }
        localStorage.setItem('storageSearchText', JSON.stringify(this.korLibrarySearchData));
        this.searchText = this.korLibrarySearchData[0]
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
    moveTop() {
      document.querySelector('.contents').scrollTo({top: 0, behavior: 'smooth'});
    },
    showTopBtn() {
      const contents = document.querySelector('.contents');
      contents.addEventListener('scroll', () => {
        const currentScrollPosition = contents.pageYOffset || contents.scrollTop
        if (currentScrollPosition < 0) {
          return
        }
        if (Math.abs(currentScrollPosition - this.lastScrollPosition) < 60) {
          return
        }
        this.isScrollUp = currentScrollPosition > this.lastScrollPosition
        this.lastScrollPosition = currentScrollPosition
      })
    },
  }
}
</script>