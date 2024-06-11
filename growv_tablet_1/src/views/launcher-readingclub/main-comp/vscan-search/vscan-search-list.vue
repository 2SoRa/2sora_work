<template>
  <div class="contents-area content-scroll-area" :class="{'small-height' : currentLanguage === 'kor' && currentActive === 4 && bookTotalCount < 9, 'cateShow': categories[currentLanguage][currentActive].children}">
    <div v-show="categories[currentLanguage][currentActive].img" class="menu-banner" :class="{ active : categories[currentLanguage][currentActive].img}" >
        <img :src='`${categories[currentLanguage][currentActive].img}`' :alt="`${categories[currentLanguage][currentActive].id}`">
    </div>
    <div class="mall-div-book" v-if="categories[currentLanguage][currentActive].children" :class="{'hide' : isScrollActive && bookTotalCount >=9}">
      <div class="tag-wrap rounded-more-big rounded-outline-bk active">
        <div class="tag">
          <template v-for="item in categories[currentLanguage][currentActive].children" :key="item.id">
            <p :class="{ 'active' : item.id == currentActiveSub }" class="tag-item"
               @click="currentActiveSub = item.id; changeCategorySub(item.id)">{{ item.name }}</p>
          </template>
        </div>
      </div>
      <div class="dropdown-wrap">
        <div class="dropdown type-gray">
          <v-select
              label="cdVlNm"
              :options="bookAlignItem"
              v-model="selectedBookAlign"
              :reduce="bookAlignItem => bookAlignItem.cdVl">
            <template #open-indicator="{ attributes }">
                        <span v-bind="attributes">
                          <img src="@/assets/img/launcher-readingclub/common/icons/ico_arrow_down.webp" alt="arrow">
                        </span>
            </template>
          </v-select>
        </div>
      </div>
    </div>
    <!--  TODO: 도서 리스트 영역    -->
    <div class="product-items-list">
      <div class="book-card-item" v-for="item in bookData" :key="item">
        <div class="thumb-wrap">
          <div class="img-wrap" @click="showDetailView(item)">
            <img :src="item.item.url" alt="도서 썸네일" @error="replaceDefault">
          </div>
          <div class="badge-wrap">
            <template v-for="item in item.badges" :key="item">
              <img v-if="item.name === 'dogjeom'" src="@/assets/img/launcher-readingclub/common/badge_exclusive.webp" alt="책 읽기 서비스 독점 뱃지">
              <img v-if="item.name === 'vscan'" src="@/assets/img/launcher-readingclub/common/badge_vscan.webp" alt="V스캔 뱃지">
            </template>
          </div>
          <button type="button" class="btn-cart blue" :class="{ 'disabled' : item.item.soldOut !== 0 || item.item.sales === 2}" @click="addCart(item)"></button>
        </div>
        <div class="book-info-wrap">
          <p class="pub">{{item.item.brandName}}</p>
          <p class="title">{{item.item.name}}</p>
        </div>
        <div class="price-wrap" v-if="!(item.item.soldOut === 1 || item.item.soldOut === 2 || item.item.sales === 2)">
          <div class="price-item"><p>{{insertDotNumber(item.item.price)}}<span>원</span></p><small class="original">{{ item.item.price !== item.item.netPrice ?  insertDotNumber(item.item.netPrice)+'원':'' }}</small></div>
          <div class="price-item purple" v-if="item.item.avalPoint > 0 && item.item.lastPrice > 0">
            <p>{{insertDotNumber(item.item.lastPrice)}}<span>원</span></p><small class="percent">포인트 적용가</small><p>{{setPointPercent(item.item)}}%</p>
          </div>
        </div>
        <!-- TODO : 가격 표기 숨김상태 추가 -->
        <div class="price-wrap sold-out" v-else>
          <div class="price-item"><p>{{setSoldOutName(item.item)}}</p></div>
        </div>
        <div class="tag-wrap rounded" :class="{'rounded-outline-developer' : currentLanguage === 'kor'}">
          <template v-if="currentLanguage === 'kor'">
            <div class="tag develop">
              <template v-for="ars in item.attrs" :key="ars">
                <p class="tag-item" v-if="ars.type === 1  && ars.gubun === 1" :class="setTag(ars)">{{ars.name}}</p>
                <p class="tag-item" v-if="ars.type === 1 && ars.gubun === 2" :class="setTag(ars)">{{ars.name}}</p>
              </template>
            </div>
          </template>
          <template v-if="currentLanguage === 'eng'">
            <div class="tag ar">
              <template v-for="ars in item.attrs" :key="ars">
                <p class="tag-item step" :class="{ [ars.name.toLowerCase()] : ars.type === 5 && ars.gubun === 1}"
                   v-if="ars.type === 5 && ars.gubun === 1"> {{ ars.name }}</p>
              </template>
            </div>
              <div class="tag ar">
                <p class="tag-item level">
                  {{ setArName(item.attrs[0]?.name)}}
                </p><!--AR표시-->
              </div>
          </template>
        </div>
      </div>
    </div>
    <TopButton/>
    <DetailViewModal v-if="isDetailView" :propsData='viewData' :setBookId='setBookId' @closePopup="closePopup" @openSubPopup="openSubPopup"/>
  </div>
</template>
<script>
import readingClubFactory from "@/api/reading-club/readingClub-factory";
const bookListApi = readingClubFactory.get('vscanSearch');
import TopButton from "@/components/launcher-readingclub/elements/top-button.vue";
import functionMixin from "@/common/mixin/functionMixin";
import DetailViewModal from "@/components/launcher-readingclub/modals/modal-detail-view.vue";
import numberMixin from "@/common/mixin/numberMixin";

import {mapGetters} from "vuex";
export default {
  mixins: [
    functionMixin,
    numberMixin
  ],
  data() {
    return {
      bookData:[],
      secBook:[],
      bookTotalCount:0,
      isToast: false,
      viewData : null,
      isDetailView: false,
      scrollData : {
        pageIndex : 0,
        pageSize : 20,
        isLoading : false
      },
      isScrollUp : false,
      lastScrollPosition : 0,
      isScrollActive: false,
      categories: {
        // 한글 도서몰 카테고리
        kor: [
          {
            id: 0,
            name: '24~35개월',
            img:require("@/assets/img/launcher-readingclub/search-mall/bnr_kor_age_3.webp")//3세
          },
          {
            id: 1,
            name: '4세',
            img:require("@/assets/img/launcher-readingclub/search-mall/bnr_kor_age_4.webp")//4세
          },
          {
            id: 2,
            name: '5세',
            img:require("@/assets/img/launcher-readingclub/search-mall/bnr_kor_age_5.webp")//5세
          },
          {
            id: 3,
            name: '6세 이상',
            img:require("@/assets/img/launcher-readingclub/search-mall/bnr_kor_age_6.webp")//6세
          },
          // {
          //   id: 4,
          //   name: '한글 이벤트',
          //   img:''
          // },
          {
            id: 4,
            name: '단행본',
            img:'',
            children: [
              {id: 0, name: '전체'},
              {id: 1, name: '국내 창작'},
              {id: 2, name: '해외 창작'},
              {id: 3, name: '베스트셀러'},
              {id: 4, name: '말놀이'},
              {id: 5, name: '옛이야기'},
              {id: 6, name: '자연 탐구'},
              {id: 7, name: '명작 그림책'},
              {id: 8, name: '문화 예술'},
            ]
          },
        ],
        // // 영어 도서몰 카테고리
        eng: [
          {
            id: 0,
            name: '리더스',
            img:''
          },
          {
            id: 1,
            name: '조작북',
            img:''
          },
          {
            id: 2,
            name: '그림책',
            img:''
          },
          // {
          //   id: 3,
          //   name: '영어 이벤트',
          //   img:''
          // },
          {
            id: 3,
            name: 'Basic',
            img:require("@/assets/img/launcher-readingclub/search-mall/bnr_eng_step_01.webp")
          },
          {
            id: 4,
            name: 'Intermediate',
            img:require("@/assets/img/launcher-readingclub/search-mall/bnr_eng_step_02.webp")
          },
        ]
      },
      bookAlignItem: [
        {
          cdVl: 'popular',
          cdVlNm: '인기순',
        },
        {
          cdVl: 'recent',
          cdVlNm: '최신순',
        },
      ],
      selectedBookAlign: 'popular',
      currentActiveSub: 0,
      setBookId:null
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    currentLanguage() {
      return this.$route.params.lang;
    },
    currentActive() {
      return this.$route.params.active;
    },

  },
  watch:{

    'selectedBookAlign'(newValue, oldValue) {
      if(newValue !== oldValue && oldValue) {
        this.resetData();
        this.getBookList();
        this.addInfiniteScroll();
      }
    },
    'currentActive'() {
      if(this.$route.params.lang === 'kor') {
        this.currentActiveSub = 0;
      }
    },
    '$route'(to,go) {
      //단행본, 도서 정렬일 때 키보드 숨기기
      if(this.$route.params.lang === 'kor' && this.$route.params.active == 5 ){
        setTimeout(() => {
          this.hideKeyboard();
        },0)
      }
      if(to.path !== go.path) {
        this.resetData();
        this.getBookList();
        this.addInfiniteScroll();
      }
    },
  },
  created() {
    this.checkShoppingMall();
    this.currentActiveSub = this.$route.params.subactive;
  },
  mounted() {
    this.getBookList();
    this.addInfiniteScroll();
    this.scrollActive();
  },
  components:{
    DetailViewModal,
    TopButton,
  },
  methods:{
    // 도서몰 3뎁스 변경
    changeCategorySub(id) {
      this.currentActiveSub = id;
      this.$router.push({
        name: 'searchList',
        params : {
          lang : this.currentLanguage,
          active : this.currentActive,
          subactive : id
        }
      })
    },
    /* 장바구니 데이터 가져오기 */
    async getCartData() {
      const params = {
        'accessToken' : localStorage.getItem("accessToken")
      }
      const cartData = await bookListApi.getCartList(params);
      return cartData.status === 200 ? cartData.data.data.data : false;
    },
    checkShoppingMall() {
      const params = {
        'parentId' : this.userInfo.info.parentId
      }
      const isShopping = bookListApi.searchInit(params);
      isShopping.then((res) => {
        if (res.data.data.result === 'N') {
          setTimeout(() => {
            this.showToast('모바일 웹 슈퍼리딩 홈페이지에서 <br>최초 로그인 1회 진행 후, 서비스 이용이 가능해요.');
          },1000);
        }
      })
    },
    isLastScroll() {
      return this.bookTotalCount === this.bookData.length;
    },
    addInfiniteScroll() {
      document.querySelector('.content-scroll-area').addEventListener('scroll',this.setInfiniteScroll)
    },
    removeInfiniteScroll() {
      document.querySelector('.content-scroll-area').removeEventListener('scroll', this.setInfiniteScroll)
    },
    setInfiniteScroll() {
      if (!this.isLastScroll()) {
        const tg = document.querySelector('.content-scroll-area')
        if (tg.clientHeight + tg.scrollTop >= tg.scrollHeight - 100) {
          if (this.scrollData.isLoading === false) {
            this.scrollData.isLoading = true;
            this.scrollData.pageIndex++;
            this.getBookList();
          }
        }
      }
    },
    resetData() {
      this.bookData = [];
      this.secBook = [];
      this.scrollData.isLoading = false;
      this.scrollData.pageIndex = 0;
      this.bookTotalCount = 0;
      this.removeInfiniteScroll();
    },
    replaceDefault(e) {
      e.target.src = require('@/assets/img/launcher-readingclub/common/thumbnail_default.png')
    },
    async getBookList() {
      const params = {
        pageSize: this.scrollData.pageSize,
        pageIndex:  this.scrollData.pageIndex,
        // pageSort: this.categoryActive !== 4 ?  'recent' : this.selectedBookAlign,
        pageSort: this.$route.params.active == 5 ? this.selectedBookAlign : 'recent',
        category: !this.categories[this.currentLanguage][this.currentActive].children ? this.categories[this.currentLanguage][this.currentActive].name : this.currentActiveSub == 0 ? '단행본' : this.categories[this.currentLanguage][this.currentActive].children[this.currentActiveSub].name,
        accessToken: localStorage.getItem("accessToken"),
      }
      await Promise.all([
        bookListApi.getProductSet(params),
        bookListApi.getProductList(params)
      ]).then((res) => {
        this.bookTotalCount = res[0].data.data.totalCount + res[1].data.data.totalCount;
        // console.log(this.bookTotalCount)
        this.scrollData.isLoading = false;
        let first = [];
        first.push(...res[0].data.data.data, ...res[1].data.data.data)
        let total = first.length + this.secBook.length
        //20개 이하일 시
        if (this.bookTotalCount <= this.scrollData.pageSize) {
          Array.prototype.push.apply(this.bookData, first);
        }
        //20개 이상이고 처음 로딩시 || 세트,단행본 중 값이 하나만 있을 경우
        else if (this.bookTotalCount > this.scrollData.pageSize && this.secBook.length == 0) {
          let sliceData = first.slice(0, this.scrollData.pageSize)
          this.secBook = first.slice(this.scrollData.pageSize, first.length)
          Array.prototype.push.apply(this.bookData, sliceData);
        }
        //다음 로딩
        else if(this.secBook.length !== 0 && this.bookTotalCount !== this.bookData.length){
          let temp = [];
          temp.push(...this.secBook, ...first)
          let sliceData = temp.slice(0, this.scrollData.pageSize)
          this.secBook = temp.slice(this.scrollData.pageSize, total)
          Array.prototype.push.apply(this.bookData, sliceData);
        }
        //마지막 로딩이면 남아있던 데이터 모두 삽입
        else if ( this.bookTotalCount === this.bookData.length) {
          Array.prototype.push.apply(this.bookData, this.secBook);
        }
        this.setBadges();

      }).catch((err) => console.log(err))
      // console.log(this.bookTotalCount)
    },
    setBadges() {
      const order = ['dogjeom', 'vscan']
      this.bookData.map((el) => {
        return el.badges.sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name))
      })
    },
    setTag({name}) {
      if(name === '인지발달') return 'recognition';
      if(name === '사회성발달') return 'sociality';
      if(name === '종합발달') return 'general';
      if(name === '정서발달') return 'emotion';
      if(name === '창의사고력') return 'creativity';
      if(name === '언어발달') return 'language';
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
    setSoldOutName(item) {
      let soldOut = '';

      if (item.soldOut === 1 || item.soldOut === 2) {
        soldOut = item.soldOut === 1 ? '품절' : '판매 예정';
      } else if (item.sales === 2 && item.soldOut === 0) {
        soldOut = '판매 중지';
      }
      return `${soldOut}`
    },
    /*포인트 할인율*/
    setPointPercent(item) {
      let discountPercent = 0;
      if(item.gubun == 1) { //단행본 도서일 경우
        discountPercent = item.discountPercent + item.pointPercent
      }
      if(item.gubun == 2) { //세트 도서일 경우
        discountPercent = Math.round(((item.netPrice - item.lastPrice) / item.netPrice) * 100)
      }

      return discountPercent;
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
      if (!this.isToast) {
        const setBookDetail = await bookListApi.getProductSetDetail({
          'id': id,
          'accessToken': localStorage.getItem("accessToken"),
        });
        // 장바구니 중복 체크
        let cartCount = 0;
        const cartData = await this.getCartData();

        new Promise((resolve) => {
          setBookDetail.data.data.data.products.forEach((el, index) => {
            const params = {
              'accessToken': localStorage.getItem("accessToken"),
              'id': el.id,
              'isCheck': 1,
              'quan': 1
            }
            if (!cartData.some(item => el.id === item.item.id)) {
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
    cartCheck(arr, singleId) {
      return singleId ? arr.some(item => singleId === item.item.id) : arr.some(item => this.detailData.id === item.item.id);
    },
    /* 토스트 메시지 완료 */
    toastComplete() {
      this.isToast = false;
    },
    //상세페이지
    showDetailView(item) {
      if(item.item.gubun === 2) {
        this.setBookId = item.item.id
      }else this.setBookId = null

      this.viewData = item;
      this.isDetailView = true;
    },
    //세트 상품 중 하위도서 상세페이지 열기
    openSubPopup(subBookInfo) {
      this.viewData = subBookInfo;
      this.isDetailView = true;
    },
    closePopup() {
      this.isDetailView = false;
    },
    hideKeyboard() {
      const input = document.querySelector('.vs__selected-options .vs__search');
      input.setAttribute('inputmode', 'none');
      input.setAttribute('readonly', 'readonly');
    },
    scrollActive() {
      let lastScrollY = 0;
      const contents = document.querySelector('.content-scroll-area');
      contents.addEventListener('scroll', () => {
        let scrollY = contents.scrollTop;

        const scrollUp = scrollY < lastScrollY;

          // console.log(scrollY, contents.offsetHeight, this.isScrollActive);
        if ( scrollUp || scrollY <= 0 ) {
          this.isScrollActive = false;
        } else {
          this.isScrollActive = true;
        }
          lastScrollY = scrollY;
          // console.log(this.isScrollActive)
      })
    }

    /* 네이처 주석 (위에 조건문 빼야함) */
    // scrollActive() {
    //   let lastScrollY = 0;
    //
    //   let mallBtnEl = document.querySelector('.mall-div-book');
    //   let mallBtnsH = mallBtnEl.clientHeight;
    //   // 타이밍
    //   let hideDist = 0.7;
    //
    //   const contents = document.querySelector('.content-scroll-area');
    //
    //   contents.addEventListener('scroll', () => {
    //     let scrollY = contents.scrollTop;
    //     const scrollUp = scrollY < lastScrollY;
    //
    //     // hide & show
    //     if (scrollY >= (mallBtnsH*hideDist)) {
    //       mallBtnEl.classList.add('hide');
    //     } else {
    //       mallBtnEl.classList.remove('hide');
    //     }
    //
    //     // fixed show (scroll up & down )
    //     if (scrollUp) {
    //       if(scrollY >= mallBtnsH) {
    //         console.log('up');
    //         mallBtnEl.classList.add('fixed', 'show');
    //       } else if(scrollY === 0) {
    //         mallBtnEl.classList.remove('fixed');
    //       }
    //     } else {
    //       console.log('down');
    //       mallBtnEl.classList.remove('fixed', 'show');
    //     }
    //
    //     // save last scroll
    //     lastScrollY = scrollY;
    //   })
    // }
  }
}
</script>