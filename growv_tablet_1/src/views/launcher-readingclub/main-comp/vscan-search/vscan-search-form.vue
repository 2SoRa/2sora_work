<template>
  <!-- V스캔 쇼핑몰 : 검색하기 -->
  <div class="vscan-search-form sub">
    <div class="sub-gnb">
      <div class="sub-gnb-left small black">
        <button type="button" @click="goPage" class="btn-back">back</button>
      </div>
      <h1>V스캔 전용몰 도서 검색</h1>
      <div class="sub-gnb-right small black">
        <button type="button" class="btn-vscan-cart">
          <router-link :to="{ name : 'searchCart'}">
          </router-link>
        </button>
        <button type="button" class="btn-close">
          <router-link :to="{ name : 'ReadingClubMainView' }"></router-link>
        </button>
      </div>
    </div>

    <div class="contents content-scroll-area">
      <form class="select-search-form form-area type-row">
        <div class="row-list">
          <div class="col-list">
            <div class="select-toggle-wrap square">
                <div class="select-rdo-group">
                  <!-- 상품 유형 Radio -->
                  <fieldset>
                    <legend>상품 유형 한글책, 영어책 중 하나 선택</legend>
                    <div class="radio-round-group circle"> <!-- gap-30 -->
                      <div class="radio-input">
                        <input type="radio" id="korean" name="lan-check" value="kor" v-model="selectedLan" >
                        <label for="korean">한글책</label>
                      </div>
                      <div class="radio-input">
                        <input type="radio" id="english" name="lan-check" value="eng" v-model="selectedLan">
                        <label for="english">영어책</label>
                      </div>
                    </div>
                  </fieldset>
                </div>
            </div>
            <div class="search-recent-wrap">
              <!-- 검색 폼 -->
              <div class="search-bar">
                <fieldset>
                  <legend>V스캔 전용몰 도서 검색하기</legend>
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
            </div>
          </div>
          <!-- 최근 검색 단어 -->
          <template v-if="shoppingSearchData !== null && !isSearch">
            <ul class="recent-word">
              <li v-for="item in shoppingSearchData" :key="item">
                <p @click="getTagSearch(item)">{{ item }}</p>
                <button @click="tagDelete(item)">X</button>
              </li>
            </ul>
          </template>
        </div>
      </form>

      <!-- 검색 완료  v-show="isSearch"-->
      <div class="search-result" v-show="isSearch">
        <!-- 검색 결과 있을 때 -->
        <div v-show="isList">
          <div class="col-list">
            <p>총 <span>{{ bookTotalCount }}</span>건이 검색되었습니다.</p>
            <form class="form-area">
              <fieldset>
                <legend>V스캔 도서 검색 결과</legend>
                <div class="book-icon"></div>
                <div class="dropdown-wrap">
                  <div class="dropdown type-gray">
                    <v-select
                      label="cdVlNm"
                      :options="bookAlignItem"
                      v-model="selectedBookAlign"
                      :reduce="bookAlignItem => bookAlignItem.cdVl">
                      <template #open-indicator="{ attributes }">
                        <span v-bind="attributes">
                          <img src="@/assets/img/launcher-readingclub/common/icons/ico_arrow_down.webp" alt="검색결과 정렬">
                        </span>
                      </template>
                    </v-select>
                  </div>
                </div>
              </fieldset>
            </form>
          </div>

          <!-- TODO : 도서 검색 결과 노출 -->
          <!-- TODO : 영어일 때 클래스 추가 -->
          <ul class="product-items-list" v-if="bookData && bookData.length > 0" :class="{'eng' : $route.query.lan === 'eng'}">
            <li class="book-card-item" v-for="item in bookData" :key="item">
              <div class="thumb-wrap">
                <div class="img-wrap" @click="showDetailView(item)">
                  <img :src="item.item.url" alt="도서 썸네일" @error="replaceDefault">
                </div>
                <div class="badge-wrap">
                  <template v-for="item in item.badges" :key="item">
                    <img v-if="item.name === 'dogjeom'"
                         src="@/assets/img/launcher-readingclub/common/badge_exclusive.webp" alt="책 읽기 서비스 독점 뱃지">
                    <img v-if="item.name === 'vscan'" src="@/assets/img/launcher-readingclub/common/badge_vscan.webp"
                         alt="V스캔 뱃지">
                  </template>
                </div>
                <button type="button" class="btn-cart blue" @click="addCart(item)" :class="{ 'disabled' : item.item.soldOut !== 0 || item.item.sales === 2}"></button>
              </div>
              <div class="book-info-wrap">
                <p class="pub">{{ item.item.brandName }}</p>
                <p class="title">{{ item.item.name }}</p>
              </div>
              <div class="tag-wrap rounded" :class="{'rounded-outline-developer' : $route.query.lan === 'kor'}">
                <!--한글 지수-->
                <div class="tag develop" v-show=" $route.query.lan === 'kor'">
                  <template v-for="ars in item.attrs" :key="ars">
                    <p class="tag-item" v-if="ars.type === 1  && ars.gubun === 1" :class="setTag(ars)">
                      {{ ars.name }}</p>
                    <p class="tag-item" v-if="ars.type === 1 && ars.gubun === 2" :class="setTag(ars)">{{ ars.name }}</p>
                  </template>
                </div>
                <!--영어 AR 지수-->
                <div class="tag ar" v-show=" $route.query.lan === 'eng'">
                  <template v-for="ars in item.attrs" :key="ars">
                    <p class="tag-item step" :class="{ [ars.name.toLowerCase()] : ars.type === 5 && ars.gubun === 1}"
                       v-if="ars.type === 5 && ars.gubun === 1"> {{ ars.name }}</p>
                  </template>
                  <p class="tag-item level">{{ setArName(item.attrs[0]?.name)}}</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <!-- 검색 결과 없을 때 -->
        <div class="no-data-wrap" v-show="!isList">
          <span class="result-text">검색 결과가 없습니다.</span>
        </div>
      </div>
      <TopButton></TopButton>
      <detailViewModal v-if="isDetailView" :propsData='viewData' @closePopup="closePopup"></detailViewModal>
    </div>
  </div>
</template>
<script>
import TopButton from "@/components/launcher-readingclub/elements/top-button.vue";
import readingClubFactory from "@/api/reading-club/readingClub-factory";
import functionMixin from "@/common/mixin/functionMixin";
import DetailViewModal from "@/components/launcher-readingclub/modals/modal-detail-view.vue";
import getShoppingBooksMixin from "@/common/mixin/getShoppingBooksMixin";

const bookListApi = readingClubFactory.get('vscanSearch')
export default {
  mixins: [
    functionMixin,getShoppingBooksMixin
  ],
  data() {
    return {
      searchText: '',
      bookData: [],
      secBook:[],
      shoppingSearchData: [],
      bookTotalCount: null,
      isShow: true,
      isSearch: false,
      isList: false,
      isToast: false,
      bookAlignItem: [
        {
          cdVl: 'recent',
          cdVlNm: '최신순',
        },
        {
          cdVl: 'popular',
          cdVlNm: '인기순',
        }
      ],
      selectedLan: 'kor',
      selectedBookAlign: 'recent',
      scrollData: {
        pageIndex: 0,
        pageSize: 20,
        isLoading: false
      },
      viewData: null,
      isScrollUp: false,
      lastScrollPosition: 0,
      isDetailView: false,
      path:'' //이전페이지 진입경로
    }
  },
  components: {
    DetailViewModal,
    TopButton,
  },
  watch: {
    selectedBookAlign(newValue, oldValue) {
      if ((oldValue !== newValue && newValue) && (this.$route.query.align !== newValue)) {
        this.bookData = [];
        this.secBook = [];
        this.scrollData.pageIndex = 0;
        this.getSearchBook();
      }
    },
  },
  created() {
    if(this.$route.query.path) {
      this.path = this.$route?.query.path
    }
    if(!this.$route.query.path) {
      this.path = 'ReadingClubMainView'
    }
    if(this.$route.query.align) {
      this.holdSearchValues();
    }
  },
  mounted() {
    //처음 진입시에만 태그 노출
    if(this.$route.query.path || this.$route.query.length == undefined) {
      this.initTagSearch();
    }
    this.addInfiniteScroll();
    this.hideKeyboard();
  },
  methods: {
    //장바구니페이지에서 나왔을 때 검색값 유지
    holdSearchValues() {
      this.isSearch = true
      this.selectedLan = this.$route.query.lan;
      this.searchText = this.$route.query.searchText;
      this.selectedBookAlign = this.$route.query.align;
      this.isShow = false;
      this.getSearchBook('all');
    },
    setTag({name}) {
      if (name === '인지발달') return 'recognition';
      if (name === '사회성발달') return 'sociality';
      if (name === '종합발달') return 'general';
      if (name === '정서발달') return 'emotion';
      if (name === '창의사고력') return 'creativity';
      if (name === '언어발달') return 'language';
      return ''
    },
    setArName(name) {
      if(!name) return;
      if(!name.includes('.')) {
        return name + '.0'
      }else if(name.includes('AR 0~') ) {
        return name.replaceAll(/AR 0/gi,'AR 0.0')
      }
      else return name
    },
    /* 장바구니 담기 */
    addCart(item) {
      if (item.item.soldOut === 1) {
        if (!this.isToast) {
          this.isToast = true;
          this.showToast('품절이에요');
        }
        return;
      }
      if (item.item.soldOut === 2) {
        if (!this.isToast) {
          this.isToast = true;
          this.showToast('판매 예정이에요');
        }
        return;
      }
      if (item.item.sales === 2) {
        if (!this.isToast) {
          this.isToast = true;
          this.showToast('판매 중지되었어요');
        }
        return;
      }
        //세트 상품일 경우 세트 상세 조회
      if(item.item.gubun === 2) {
        return this.addSetBooksCart(item.item.id)
      }
      const params = {
        'accessToken': localStorage.getItem("accessToken"),
        'id': item.item.id,
        'isCheck': 1,
        'quan': 1
      }
      this.sendCart(params)
    },
    /*세트 상품 장바구니 담기*/
    async addSetBooksCart(id) {
      if(!this.isToast) {
        const setBookDetail = await bookListApi.getProductSetDetail({
          'id': id,
          'accessToken': localStorage.getItem("accessToken"),
        });
        // 장바구니 중복 체크
        let cartCount = 0;
        const cartData = await this.getCartData();

        new Promise((resolve) => {
          setBookDetail.data.data.data.products.forEach((el,index)=> {
            const params = {
              'accessToken': localStorage.getItem("accessToken"),
              'id':el.id ,
              'isCheck': 1,
              'quan': 1
            }

            if(!cartData.some(item => el.id === item.item.id)) {
              bookListApi.addCartItem(params);
              cartCount++;
            }
            if (index === setBookDetail.data.data.data.products.length - 1) resolve();
          })
        }).then(() => {
          if (cartCount > 0) {
            this.showToast('장바구니에 담았어요.');
          } else {
            this.showToast('이미 장바구니에 있습니다.');
          }
        })
      }
    },
    async sendCart(params) {
      if (!this.isToast) {
        this.isToast = true;
        // 장바구니 중복 체크
        const cartData = await this.getCartData();
        if (cartData) {
          if (this.cartCheck(cartData, params.id)) {
            this.showToast('이미 장바구니에 있습니다. ');
            return false;
          } else {
            const cartSave = bookListApi.addCartItem(params);
            cartSave.then((res) => {
              if (res.data.data.code === 200) {
                this.showToast('장바구니에 담았어요.');
              } else {
                this.showToast('모바일 웹 슈퍼리딩 홈페이지에서 <br>최초 로그인 1회 진행 후, 서비스 이용이 가능해요.');
              }
            })
          }
        }
      }
    },
    /* 장바구니 데이터 가져오기 */
    async getCartData() {
      const params = {
        'accessToken' : localStorage.getItem("accessToken")
      }
      const cartData = await bookListApi.getCartList(params);
      return cartData.status === 200 ? cartData.data.data.data : false;
    },
    cartCheck(arr, singleId) {
      return singleId ? arr.some(item => singleId === item.item.id) : arr.some(item => this.detailData.id === item.item.id);
    },
    /* 토스트 메시지 완료 */
    toastComplete() {
      this.isToast = false;
    },
    isLastScroll() {
      return this.bookTotalCount === this.bookData.length;
    },
    addInfiniteScroll() {
      document.querySelector('.content-scroll-area').addEventListener('scroll', this.setInfiniteScroll)
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
    toggleOption() {
      this.isShow = !this.isShow;
    },
    keywordReset() {
      this.bookData = [];
      this.secBook = [];
      this.searchText = '';
      this.isShow = true;
      this.isSearch = false;
      this.isList = false;
      this.selectedLan = 'kor';
    },
    keywordChange(event) {
      if (event.target.value.length > 0) {
        document.querySelector('button.delete').classList.add('active');
      } else {
        document.querySelector('button.delete').classList.remove('active');
      }
    },
    getSearchBook(type) {
      if (type === 'all') {
        this.bookData = [];
        this.secBook = [];
        this.scrollData.pageIndex = 0;
      }
      const params = {
        pageSize: this.scrollData.pageSize,
        pageIndex: this.scrollData.pageIndex,
        pageSort: this.selectedBookAlign,
        category: '',
        keyword: this.searchText,
        fillter: this.selectedLan,
        accessToken: localStorage.getItem("accessToken"),
      }
      this.getAllBook(params, 'search');
      this.isResultSearch();
    },
    isResultSearch() {
      this.isSearch = true;
      this.isShow = false;
    },
    isResult() {
      if (this.bookData && this.bookData.length > 0) {
        this.isList = true;
        this.tagSave();
      } else {
        this.isList = false;
      }
      this.$router.push({query:{lan:this.selectedLan, searchText:this.searchText, align:this.selectedBookAlign ,path:this.path}})
    },
    tagSave() {
      //2글자 미만이면 저장하지 않음
      if (this.searchText.length <= 1 && this.searchText.length !== 0) return;

      if (this.shoppingSearchData?.indexOf(this.searchText) === -1) {
        if (this.searchText) {
          this.shoppingSearchData.unshift(this.searchText);
          if (this.shoppingSearchData.length > 5) {
            this.shoppingSearchData.pop();
          }
        }
        localStorage.setItem('ShoppingSearchText', JSON.stringify(this.shoppingSearchData));
      }
    },
    getSearchBookButton() {
      document.querySelector('.glass').click();
      const ipt = document.querySelector("#searchText");
      ipt.setAttribute('inputmode', 'none');
      ipt.setAttribute('readonly', 'readonly');
      setTimeout(() => {
        ipt.removeAttribute('inputmode');
        ipt.removeAttribute('readonly');
      }, 1000);
    },
    getTagSearch(tag) {
      this.searchText = tag;
      this.getSearchBook();
    },
    tagDelete(item) {
      const deleteIndex = this.shoppingSearchData.indexOf(item);
      this.shoppingSearchData.splice(deleteIndex, 1)
      localStorage.setItem('ShoppingSearchText', JSON.stringify(this.shoppingSearchData))
    },
    initTagSearch() {
      if (JSON.parse(localStorage.getItem('ShoppingSearchText'))) {
        this.shoppingSearchData = JSON.parse(localStorage.getItem('ShoppingSearchText'));
      }
    },
    hideKeyboard() {
      const input = document.querySelector('.vs__selected-options .vs__search');
      input.setAttribute('inputmode', 'none');
      input.setAttribute('readonly', 'readonly');
    },
    replaceDefault(e) {
      e.target.src = require('@/assets/img/launcher-readingclub/common/thumbnail_default.png')
    },
    showDetailView(item) {
      this.viewData = item;
      this.isDetailView = true;
    },
    closePopup() {
      this.isDetailView = false;
    },
    goPage() {
      if(this.path === 'ReadingClubMainView') return this.$router.push({name: this.path})
      
      this.$router.push({name: 'searchList' ,
        params : {
          lang: this.path,
          active: 0,
          subactive: 0
        }})
    }
  }
}
</script>