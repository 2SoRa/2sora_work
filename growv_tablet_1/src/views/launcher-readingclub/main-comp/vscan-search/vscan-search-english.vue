<template>
  <!-- V스캔 쇼핑몰 : 영어 도서관 -->
  <div class="search-mall eng">
    <div class="sub-gnb">
      <div class="sub-gnb-left black">
        <button type="button" class="btn-back"><router-link :to="{ name : 'ReadingClubMainView' }"></router-link></button>
      </div>

      <!--   상단 탭  -->
      <div class="switch type-text">
        <button class="switch-item">
            <router-link :to="{ name : 'searchKorean'}">한글 도서몰</router-link>
        </button>
        <button class="switch-item active">
          <router-link :to="{ name : 'searchEnglish'}">영어 도서몰</router-link>
        </button>
      </div>
      <div class="sub-gnb-right black">
        <button type="button" class="btn-vscan-search"><router-link :to="{ name : 'searchForm', query:{path: 'eng' }}"></router-link></button>
        <button type="button" class="btn-vscan-cart">
          <router-link :to="{ name : 'searchCart', query : { page : 'eng' , type : categoryActive }}">
          </router-link>
        </button>
        <button type="button" class="btn-close"><router-link :to="{ name : 'ReadingClubMainView' }"></router-link></button>
      </div>
    </div>
    <div class="menu">
      <div class="menu-area bottom-triangle type-purple">
        <ul class="depth-2">
          <template v-for="item in categoryItem" :key="item.id">
            <li class="menu-item" :class="{active: categoryActive === item.id}" @click="currentCategory(item.id)">
              {{ item.name }}<span></span></li>
          </template>
        </ul>
      </div>
    </div>
    <!--  리스트 영역 -->
    <div class="contents-area content-scroll-area"
         :class="{'autoHeight' : categoryActive === 0 || categoryActive === 1 || categoryActive === 2 }">
      <!-- TODO: 단계별에서만 보임(basic, intermeditate) -->
      <div class="menu-banner active">
        <template v-if="categoryActive === 3">
          <img src="@/assets/img/launcher-readingclub/search-mall/bnr_eng_step_01.webp" alt="basic">
        </template>
        <template v-if="categoryActive === 4">
          <img src="@/assets/img/launcher-readingclub/search-mall/bnr_eng_step_02.webp" alt="intermediate">
        </template>
      </div>
      <!--  TODO: 도서 리스트 영역    -->
      <div class="product-items-list" v-if="bookList && bookList.length > 0">
        <div class="book-card-item" v-for="item in bookList" :key="item">
          <div class="thumb-wrap">
            <div class="img-wrap" @click="showDetailView(item)">
              <img :src="item.item.url" :alt="item.item.name" @error="replaceDefault">
            </div>
            <div class="badge-wrap">
              <template v-for="item in item.badges" :key="item">
                <img v-if="item.name === 'dogjeom'" src="@/assets/img/launcher-readingclub/common/badge_exclusive.webp" alt="책 읽기 서비스 독점 뱃지">
                <img v-if="item.name === 'vscan'" src="@/assets/img/launcher-readingclub/common/badge_vscan.webp" alt="V스캔 뱃지">
              </template>
            </div>
            <!-- TODO : 장바구니 담기 불가인 경우 버튼 상태 disabled -->
            <button type="button" class="btn-cart" @click="addCart(item)" :class="{ 'disabled' : item.item.soldOut !== 0 || item.item.sales === 2}"></button>
          </div>
          <div class="book-info-wrap" @click="showDetailView(item)">
            <p class="pub">{{ item.item.brandName }}</p>
            <p class="title">
              {{ item.item.name }}
            </p>
          </div>
          <div class="tag-wrap rounded-outline-developer">
            <div class="tag ar">
              <template v-for="ars in item.attrs" :key="ars">
                <p class="tag-item step" :class="{ [ars.name.toLowerCase()] : ars.type === 5 && ars.gubun === 1}"
                   v-if="ars.type === 5 && ars.gubun === 1"> {{ ars.name }}</p>
              </template>
            </div>
            <div class="tag ar">
              <p class="tag-item level">
                {{ item.attrs[0].name }}
              </p><!--AR표시-->
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="book-list-wrap">
          <div class="no-data">
            <span></span>
          </div>
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
import detailViewModal from "@/components/launcher-readingclub/modals/modal-detail-view.vue";

const bookListApi = readingClubFactory.get('vscanSearch');
export default {
  mixins: [
    functionMixin
  ],
  data() {
    return {
      categoryItem: [ // 상위카테고리
        {
          id: 0,
          name: '리더스'
        },
        {
          id: 1,
          name: '조작북'
        },
        {
          id: 2,
          name: '그림책'
        },
        // {
        //   id: 3,
        //   name: '영어 이벤트'
        // },
        {
          id: 3,
          name: 'Basic'
        },
        {
          id: 4,
          name: 'Intermediate'
        },
      ],
      categoryActive: null,
      bookList: [],
      scrollData: {
        pageIndex: 0,
        pageSize: 20,
      },
      bookTotalCount: 0,
      viewData : null,
      isToast: false,
      isDetailView: false,
    }
  },
  watch: {
    'categoryActive'(oldV, newV) {
      if (oldV !== newV) {
        this.scrollData.pageIndex = 0;
        const element = document.querySelector('.content-scroll-area')
        element.scrollTo({top: 0, behavior: 'smooth'})
        this.removeInfiniteScroll();
        setTimeout(function () {
          window.$vm.addInfiniteScroll();
        }, 500);
        this.bookList = [];
        this.getBookList();
      }
    },
  },
  created() {
    if (this.$route.query.page === 'eng' && this.$route.query.type >= 0) {
      this.categoryActive = parseInt(this.$route.query.type);
    }
  },
  mounted() {
    window.$vm = this;
    if (!this.categoryActive) {
      this.categoryActive = 0;
    }
    this.addInfiniteScroll();
  },
  components: {
    detailViewModal,
    TopButton
  },
  computed : {
    urlPage() {
      return (this.$route.query.page === 'eng' && this.$route.query.type >= 0) ? parseInt(this.$route.query.type) : false;
    }
  },
  methods: {
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
      this.sendCart(params);
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
        //장바구니 중복 체크
        const cartData = await this.getCartData();
        if(cartData) {
          if(this.cartCheck(cartData, params.id)) {
            this.showToast('이미 장바구니에 있습니다. ');
            return false;
          }else {
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
    /* 현재 카테고리 세팅 */
    currentCategory(id) {
      this.categoryActive = id;
    },
    /* 무한 스크롤 이벤트 연결 */
    addInfiniteScroll() {
      document.querySelector('.content-scroll-area').addEventListener('scroll', this.setInfiniteScroll)
    },
    /* 무한 스크롤 이벤트 해제 */
    removeInfiniteScroll() {
      document.querySelector('.content-scroll-area').removeEventListener('scroll', this.setInfiniteScroll)
    },
    /* 무한 스크롤 이벤트 체크 */
    setInfiniteScroll() {
      if (!this.isLastScroll()) {
        const element = document.querySelector('.content-scroll-area')
        if (element.clientHeight + element.scrollTop >= element.scrollHeight - 10) {
          if (this.scrollData.isLoading === false) {
            this.scrollData.isLoading = true;
            this.scrollData.pageIndex++;
            this.getBookList();
          }
        }
      }
    },
    /* 무한 스크롤 이벤트 여부 */
    isLastScroll() {
      return this.bookTotalCount === this.bookList.length;
    },
    /* 목록 가져오기 */
    getBookList() {
      const params = {
        pageSize: this.scrollData.pageSize,
        pageIndex: this.scrollData.pageIndex,
        pageSort: 'recent',
        pageEnd: false,
        category: this.categoryItem[this.categoryActive].name,
        // category:  '조작북',
        accessToken: localStorage.getItem("accessToken"),
      }
      const bookList = bookListApi.getProductList(params)
      bookList.then((res) => {
        if (res.data.data.code === 200) {
          Array.prototype.push.apply(this.bookList, res.data.data.data);
          this.bookTotalCount = res.data.data.totalCount;
          this.scrollData.isLoading = false;
          this.setBadges();

          // 스크롤 추가로 + 150
          if (this.scrollData.pageIndex !== 0) {
            const element = document.querySelector('.content-scroll-area')
            let t = element.scrollTop;
            setTimeout(function () {
              element.scrollTo({top: t + 150, behavior: 'smooth'})
            }, 10);
          }
        }
      }).catch((err) => console.log(err))
    },
    setBadges() {
      const order = ['dogjeom', 'vscan']
      this.bookList.map((el) => {
        return el.badges.sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name))
      })
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
  }
}
</script>