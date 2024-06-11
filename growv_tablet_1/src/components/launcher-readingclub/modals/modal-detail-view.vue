/* eslint-disable */
<template>
  <!-- V스캔 쇼핑몰 : 도서 상세 -->
  <div class="vscan-search-detail" :class="[{kor:detailData.type===1 || detailData.type===3 || detailData.type === 0} , {eng:detailData.type===2}]">
    <div class="sub-gnb pos-fixed border-none" style="z-index:200">
      <div class="sub-gnb-right">
        <button type="button" class="btn-close" @click="closeDetailView"></button>
      </div>
    </div>
    <div class="contents" v-show="detailData && !isLoading">
      <div class="contents-info-area">
        <!--<div class="info-desc"><i class="ico ico-exclam-mark"></i>도서 상세 정보는 홈페이지에서 볼 수 있어요!</div>-->
        <div class="detail-info-lr">
          <div class="side-area left">
            <div class="thumb-btn-wrap">
              <div class="img-wrap" @click="goDetailPage()" v-if="detailData.images">
                <img :src="detailData.images[0].url" alt="도서 썸네일">
              </div>
              <div class="badge-wrap" v-if="detailData.badges">
                <!-- TODO : 책 읽기 서비스, V스캔 여부에 따라 뱃지 이미지 노출 -->
                <template v-for="item in setBadge(detailData.badges)" :key="item">
                  <template v-if="item.name === 'dogjeom'">
                    <img src="@/assets/img/launcher-readingclub/common/badge_exclusive.webp" alt="책 읽기 서비스 독점 뱃지">
                  </template>
                  <template v-if="item.name === 'vscan'">
                    <img src="@/assets/img/launcher-readingclub/common/badge_vscan.webp" alt="V스캔 뱃지">
                  </template>
                </template>
              </div>
              <!-- TODO : old 미리보기 있는 경우 버튼 노출 -->
              <!--<button type="button" class="btn-preview" @click="showDetailView('video')">&lt;!&ndash;미리보기 버튼 &ndash;&gt;</button>-->
            </div>
            <!-- TODO : new 도서찾기 QR 코드, 비디오 플레이 버튼 추가될 예정 -->
            <ul class="box-rounded-list type-half">
              <li class="box-rounded" v-if="qrImage">
                <span class="txt">구매하기</span>
                <span class="item-qr">
                  <img :src="qrImage">
                </span>
              </li>
              <li class="box-rounded border-sky" v-if="previewVideo">
                <span class="txt">미리보기</span>
                <button type="button" class="btn-preview-play" @click="showDetailView()"></button>
              </li>
            </ul>
            <!-- TODO : 도서찾기 장바구니 버튼 추가될 예정 -->
            <div class="btn-wrap">
              <!-- TODO : 장바구니 담기 불가, 판매 예정일 경우 disabled 상태로 변경, txt 요소 텍스트 수정 (장바구니 담기 => 품절 or 판매예정)  -->
              <button type="button" class="btn-round-full has-shadow btn-static-cart" :class="{ 'disabled' : detailData.soldOut !== 0 || detailData.sales === 2}" @click="addCart()">
                <i class="ico ico-cart"></i>
                <span class="txt">
                  <template v-if="detailData.soldOut === 0 && detailData.sales !== 2">
                    장바구니 담기
                  </template>
                  <template v-if="detailData.soldOut === 1 || detailData.soldOut === 2">
                    {{ detailData.soldOut === 1 ? '품절' : '판매 예정' }}
                  </template>
                  <template v-if="detailData.sales === 2 && detailData.soldOut === 0">
                    판매 중지
                  </template>
                </span>
              </button>
            </div>
          </div>
          <div class="side-area right">
            <div class="book-info-wrap">
              <p class="txt-publish">{{ detailData.brandName }}</p>
              <em class="txt-book-name">{{ detailData.name }}</em>
              <div class="tag-wrap rounded rounded-outline-developer size-big">
                <div class="tag develop" v-if="dataAreaTag.length !== 0">
                  <p class="tag-item" :class="item.class" v-for="(item) in dataAreaTag" :key="item">{{ item.name }}</p>
                </div>
                <div class="tag ar" v-if="dataStepTag.length !== 0">
                  <p class="tag-item step" :class="item.class" v-for="(item) in dataStepTag" :key="item">{{ item.name }}</p> <!-- 단계표시 -->
                  <p class="tag-item level" v-if="strArNumber">{{  strArNumber }}</p><!--AR표시-->
                </div>
              </div>
              <div class="price-wrap size-big">
                <div class="price-item"><p>{{insertDotNumber(detailData.price)}}<span>원</span></p><small class="original">{{ detailData.price !== detailData.netPrice ? insertDotNumber(detailData.netPrice)+'원' : ''}}</small></div>
                <div class="price-item purple" v-if="detailData.avalPoint > 0 && detailData.lastPrice > 0">
                  <p>{{insertDotNumber(detailData.lastPrice)}}<span>원</span></p><small class="percent">포인트 적용가</small><p>{{setPointPercent(detailData)}}%</p>
                </div>
              </div>
              <div class="txt-wrap txt-ellipsis multi-line-4">
                <div class="txt-inline-wrap">
                  {{ detailData.description }}
                </div>
                <!-- TODO :. 디스크립션 4줄 이상일 경우에만 노출 -->
                <div class="btn-wrap" ref="btnWrap" style="display:none">
                  <button type="button" class="btn-round-96 btn-more-view" @click="showDetailView('text')">더보기</button>
                </div>
              </div>
              <!-- TODO : 추천연령, 글/그림, 수상내역 데이터 노출 필요 -->
              <div class="book-info-list-wrap">
                <dl class="list-row-group" v-if="dataRecommendAge">
                  <dt>추천 연령</dt><dd>{{ dataRecommendAge }}</dd>
                </dl>
                <dl class="list-row-group" v-if="strAuthor">
                  <dt>글/그림</dt><dd class="txt-ellipsis single-line">{{ strAuthor }}</dd>
                </dl>
                <dl class="list-row-group" v-if="strAward">
                  <dt>수상</dt>
                  <dd class="txt-ellipsis single-line">
                    {{ strAward.description }}
                  </dd>
                </dl>
                <!-- TODO : 영문일 경우 AR 지수 노출 -->
                <dl class="list-row-group" v-if="strArNumber">
                  <dt>AR지수</dt><dd>{{ strArNumber }}</dd>
                </dl>
              </div>
            </div>
            <div class="book-detail-img-wrap">
              <div v-html="detailData.detail">
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 세트 상품일 경우 관련 상품 리스트 노출 -->
      <div class="contents-product-area" v-show="detailData.products" ref="subBookArea">
        <form>
          <fieldset>
            <legend class="text-blind">세트 상품 개별 장바구니 담기</legend>
            <div class="product-items-total dot-title"><strong>총 {{productTotal}}권</strong></div>
            <div class="product-items-list">
              <div class="list-item" v-for="(item, index) in detailData.products" :key="item">
                <div class="input-circle-chk border-bd-white type-single">
                  <input type="checkbox" :id="`bookItem0${index}`" @click="setChekedBook(item)" checked>
                  <label :for="`bookItem0${index}`"></label>
                </div>
                <div class="book-card-item">
                  <div class="thumb-wrap">
                    <div class="img-wrap" @click="showDetailModal(item)">
                      <img :src="item.url" alt="도서 썸네일" @error="replaceDefault">
                    </div>
                    <div class="badge-wrap">
                      <template v-for="item in setBadge(item.badges)" :key="item">
                        <img v-if="item.name === 'dogjeom'" src="@/assets/img/launcher-readingclub/common/badge_exclusive.webp" alt="책 읽기 서비스 독점 뱃지">
                        <img v-if="item.name === 'vscan'" src="@/assets/img/launcher-readingclub/common/badge_vscan.webp" alt="V스캔 뱃지">
                      </template>
                    </div>
                    <button type="button" class="btn-cart blue" @click="addCart(item.id)"></button>
                  </div>
                  <div class="book-info-wrap">
                    <p class="pub">{{ item.brandName}}</p>
                    <p class="title">{{ item.name }}</p>
                  </div>
                  <div class="price-wrap">
                    <div class="price-item"><p>{{ insertDotNumber(item.price) }}<span>원</span></p><small class="original">{{ item.price !== item.netPrice ?  insertDotNumber(item.netPrice)+ '원' : '' }}</small></div>
                    <div class="price-item purple" v-if="item.avalPoint > 0 && item.lastPrice > 0">
                      <p>{{ insertDotNumber(item.lastPrice) }}<span>원</span></p><small>포인트 적용가</small><p>{{ item.discountPercent + item.pointPercent}}%</p>
                    </div>
                  </div>
                  <div class="tag-wrap rounded rounded-outline-developer">
                    <div class="tag develop">
                      <template v-for="ars in item.attrs" :key="ars">
                        <p class="tag-item" v-if="ars.type === 1  && ars.gubun === 1" :class="tagToClass(ars.name)">{{ars.name}}</p>
                        <p class="tag-item" v-if="ars.type === 1 && ars.gubun === 2" :class="tagToClass(ars.name)">{{ars.name}}</p>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="btn-wrap">
              <button type="button" class="btn-round-full has-shadow btn-static-cart" :class="{ 'disabled' : detailData.soldOut !== 0 || detailData.sales === 2}" @click="addCart()">
                <i class="ico ico-cart"></i>
                <span class="txt">
            <template v-if="detailData.sales === 2">
              판매 중지
            </template>
            <template v-else>
              {{ detailData.soldOut === 0 ? '장바구니 담기' : '' }}
              {{ detailData.soldOut === 1 ? '품절' : '' }}
              {{ detailData.soldOut === 2 ? '판매 예정' : '' }}
            </template>
          </span>
              </button>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
    <button type="button" class="btn-top" :class="{ show : isTopButton }" @click="moveScrollTop"></button>
    <contentDetailModal v-if="isContentDetailView" :propsData="{ detailViewInfo }" @closePopup="closePopup"></contentDetailModal>
    <!--로딩화면-->
    <div class="reading-loading-wrap" v-if="isLoading">
      <ul class="reading-loading-list">
        <li><img src="@/assets/img/launcher-readingclub/common/profile_thumb/profile_thumb_su.webp" alt="su"></li>
        <li><img src="@/assets/img/launcher-readingclub/common/profile_thumb/profile_thumb_wi.webp" alt="wi"></li>
        <li><img src="@/assets/img/launcher-readingclub/common/profile_thumb/profile_thumb_de.webp" alt="de"></li>
        <li><img src="@/assets/img/launcher-readingclub/common/profile_thumb/profile_thumb_ev.webp" alt="ev"></li>
        <li><img src="@/assets/img/launcher-readingclub/common/profile_thumb/profile_thumb_ne.webp" alt="ne"></li>
      </ul>
    </div>
  </div>
</template>
<script>
import readingClubFactory from "@/api/reading-club/readingClub-factory";
import contentDetailModal from '@/components/launcher-readingclub/modals/parts/content-detail-modal.vue';
import functionMixin from "@/common/mixin/functionMixin";
import numberMixin from "@/common/mixin/numberMixin";


const searchApi = readingClubFactory.get('vscanSearch')

export default {
  mixins: [
    functionMixin,
    numberMixin
  ],
  data() {
    return {
      apiData : {},
      detailViewInfo : {
        modalData : null,
      },
      isContentDetailView : false,
      isExclusive : false,        // 독점 체크
      isVscan : false,            // V스캔 체크
      isSetProduct : false,       // 세트 상품 체크
      productTotal : 0,          // 세트 상품 토탈 갯수
      productId : null,           // 상품 ID
      detailData : {},            // 상품 상세 데이터 정보
      dataRecommendAge : null,
      dataAreaTag : [],
      dataStepTag : [],
      dataArTag : [],
      dataAuthor : [],
      dataAwards : [],
      dataProduct : [],
      strAuthor : '',
      strArNumber : '',
      strAward : '',
      isToast : false,
      checkedBook:[],
      isTopButton : false,
      qrImage : null,
      previewVideo : null,
      isSubBook: false,
      bookId: null,
      isLoading: true
    }
  },
  props : {
    propsData : {
      viewData : Object,
    },
    setBookId:Number
  },
  components : {
    contentDetailModal
  },
  watch: {
    'propsData'() {
      //세트도서의 하위 도서 상세보기
      this.isSubBook = true;
      this.resetData();
      this.bookId = this.propsData.id;
      this.getProductDetail();
    },
  },
  mounted() {
    this.checkedBook = [];
    this.getProductDetail();
    this.toggleTopButton();
    setTimeout(() => {
      this.isLoading = false;
    },450);
  },
  methods : {
    resetData() {
      this.dataAuthor = [];
      this.dataAreaTag = []
      this.dataStepTag = [];
      this.checkedBook = [];
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
      },450);
    },
    /* QR 가져오기 */
    getQR() {
      let qrData = '';
      if (this.detailData.products) {
        qrData = searchApi.getQrSetData(this.detailData.id);
      } else {
        qrData = searchApi.getQrData(this.detailData.id);
      }
      qrData.then((res) => {
        if (res.data) {
          const b64 = btoa(String.fromCharCode(...new Uint8Array(res.data))),
            imgData = "data:" + res.headers['content-type'] + ";base64," + b64;
          this.qrImage = imgData;
        }
      }).catch((err) => {
        console.log(err);
      })
    },
    /* 장바구니 데이터 가져오기 */
    async getCartData() {
      const params = {
        'accessToken' : localStorage.getItem("accessToken")
      }
      const cartData = await searchApi.getCartList(params);
      return cartData.status === 200 ? cartData.data.data.data : false;
    },
    /* 토스트 메시지 완료 */
    toastComplete() {
      this.isToast = false;
    },
    /* 장바구니 담기 */
    async addCart(singleId) {
      if (this.detailData.soldOut === 1) {
        if (!this.isToast) {
          this.isToast = true;
          this.showToast('품절이에요');
        }
        return;
      }
      if (this.detailData.soldOut === 2) {
        if (!this.isToast) {
          this.isToast = true;
          this.showToast('판매 예정이에요');
        }
        return;
      }
      if (this.detailData.sales === 2) {
        if (!this.isToast) {
          this.isToast = true;
          this.showToast('판매 중지되었어요');
        }
        return;
      }
      //여러개의 책을 선택했을 경우
      if(this.checkedBook.length !== 0 && !singleId) {
       return this.addSetBooksCart()
      }
      if(this.checkedBook.length === 0 && !singleId && this.detailData.products) {
        this.showToast('세트 도서를 선택해 주세요.');
        return false;
      }
      if (!this.isToast) {
        const params = {
          'accessToken': localStorage.getItem("accessToken"),
          'id': singleId ? this.setParamBookId(singleId) : this.setParamBookId(),
          'isCheck': 1,
          'quan': 1
        }
        this.isToast = true;
        // 장바구니 중복 체크
        const cartData = await this.getCartData();
        if (cartData) {
          if (this.cartCheck(cartData, singleId)) {
            this.showToast('이미 장바구니에 있습니다. ');
            return false;
          } else {
            const cartSave = searchApi.addCartItem(params);
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
    setParamBookId(singleId) {
      let id = '';
      if(this.bookId && !singleId) { // 하위도서 상세보기,하위도서에서 상위 도서로 넘어 갈 경우
        id = this.bookId
      }else { // 하위도서 중 개별선택 했을경우 singlId, 아닌 경우 단행본 책아이디
        id = singleId ? singleId : this.detailData.id
      }
      return id;
    },
    cartCheck(arr, singleId) {
      return singleId ? arr.some(item => singleId === item.item.id) : arr.some(item => this.detailData.id === item.item.id);
    },
    /*하위 도서 선택 했을 경우 장바구니 담기*/
    async addSetBooksCart() {
      if (!this.isToast) {
        // 장바구니 중복 체크
        let cartCount = 0;
        const cartData = await this.getCartData();
        this.isToast = true;
        new Promise( (resolve) => {
          this.checkedBook.forEach((el,index)=>{
            const params = {
              'accessToken': localStorage.getItem("accessToken"),
              'id': this.checkedBook[index].id ,
              'isCheck': 1,
              'quan': 1
            }
            if (!cartData.some(item => this.checkedBook[index].id === item.item.id)) {
              searchApi.addCartItem(params);
              cartCount++;
            }
            if (index === this.checkedBook.length - 1) resolve();
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
    /* 도서 상세 정보 가져오기 */
    getProductDetail() {
      let productDetail = '';
      const params = {
        'accessToken' : localStorage.getItem("accessToken"),
        'id' : this.bookId ? this.bookId :this.propsData.item.id // 세트 도서 중 하위 도서 책 상세보기일 경우 , 하위도서에서 상위 도서로 넘어 갈 경우 bookId
      }

      if(this.propsData.item?.gubun == 1 || this.isSubBook ) { //  단행본 , 세트 도서 중 하위 도서 책 상세보기일 경우
        productDetail = searchApi.getProductDetail(params);
      }else { // 세트상품일 경우
        productDetail = searchApi.getProductSetDetail(params);
      }

      productDetail.then((res) => {
        if (res.data.data.code === 200) {
          this.detailData = res.data.data.data;
          // attrs (추천연령, 작가, 영역, AR지수, 단계 데이터 값 셋팅)
          this.detailData.attrs.forEach((item) => {
            // 2 : 추천 연령 (국문/영문 공통)
            if (item.type === 2) {
              this.dataRecommendAge = item.name;
            }
            // 4 : 작가 (국문/영문 공통)
            else if (item.type === 4) {
              this.dataAuthor.push(item.name);
            }
            // 1 : 영역 (국문)
            else if (item.type === 1) {
              this.dataAreaTag.push({
                'name': item.name,
                'class': this.tagToClass(item.name),
              });
            }
            // 3 : AR 지수 (영문)
            else if (item.type === 3) {
              this.strArNumber = this.setArName(item.name);
            }
            // 5 : 단계 (영문)
            else if (item.type === 5) {
              this.dataStepTag.push({
                'name': item.name,
                'class': this.tagToClass(item.name),
              });
            }
          });
          // 상품 정보
          if ( this.detailData.products) {
            this.productTotal = this.detailData.products.length;
            this.checkedBook = this.detailData.products;
          }
          this.strAuthor = this.dataToString(this.dataAuthor);
          this.previewVideo = this.detailData.previewUrl;
          this.descriptionHeight();
          this.getAward();
          this.getQR();
        }
      });
    },
    getAward() {
      const isAward = this.detailData.badges.find(item => item.name === 'awards');
      this.strAward = isAward;
    },
    // 데스크립션 높이
    descriptionHeight() {
      setTimeout(() => {
        const h = document.querySelector('.txt-inline-wrap').clientHeight;
        if (h > 218) {
          this.$refs.btnWrap.style.display = "flex";
        }
      },50);
    },
    // 데이터 변환
    tagToClass(name) {
      let result;
      switch (name) {
        case '종합발달' :
          result = 'general';
        break;
        case '언어발달' :
          result = 'language';
          break;
        case '인지발달' :
          result = 'recognition';
          break;
        case '정서발달' :
          result = 'emotion';
          break;
        case '사회성발달' :
          result = 'sociality';
          break;
        case '창의사고력' :
          result = 'creativity';
          break;
        case 'Basic' :
          result = 'basic';
          break;
        case 'Intermediate' :
          result = 'intermediate';
          break;
        case 'Advanced' :
          result = 'advanced';
          break;
      }
      return result;
    },
    setBadge(badge) {
      const order = ['dogjeom', 'vscan'];
      return badge.sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name))
    },
    setArName(name){
      if(!name) return;
      if(!name.includes('.')) {
        return name + '.0'
      }else if(name.includes('AR 0~') ) {
        return name.replaceAll(/AR 0/gi,'AR 0.0')
      }
      else return name
    },
    /*포인트 할인율*/
    setPointPercent(item) {

      let discountPercent = 0;
      if(!item.products) { //단행본 도서일 경우
        discountPercent = item.discountPercent + item.pointPercent
      }
      if(item.products) { //세트 도서일 경우
        discountPercent = Math.round(((item.netPrice - item.lastPrice) / item.netPrice) * 100)
      }
      return discountPercent;
    },
    dataToString(data) {
      let result = '';
      data.forEach((item, index) => {
        if(index >= this.dataAuthor.length-1) {
          result += item;
        } else {
          result += item+', ';
        }
      });
      return result;
    },
    //체크된 세트 상품 도서들
    setChekedBook(item) {
      if(this.checkedBook.filter(el => el.id === item.id ).length !== 0 ){
        this.checkedBook = this.checkedBook.filter(el => el.id !== item.id )
      } else this.checkedBook.push(item)
    },
    // popup
    showDetailView(text) {
      //소개글 더보기
      if(text) {
        this.detailViewInfo.modalData = {
         text : this.detailData.description
        }
      }
      //미리보기
      if(!text) {
        this.detailViewInfo.modalData = {
          image : this.detailData.url,
          video : this.previewVideo
        }
      }
      this.isContentDetailView = true;
    },
    showDetailModal(item) {
      this.$emit('openSubPopup', item)
    },
    closePopup() {
      this.isContentDetailView = false;
    },
    closeDetailView() {
      //하위도서 => 상위 도서로 넘어갈 때
      if(this.setBookId && this.isSubBook) {
        this.isSubBook = false;
        this.bookId = this.setBookId;
        this.resetData();
        this.getProductDetail();
        setTimeout(()=>{
          this.$refs.subBookArea.scrollIntoView();
        },450);
        return;
      }
      this.$emit('closePopup');
    },
    replaceDefault(e) {
      e.target.src = require('@/assets/img/launcher-readingclub/common/thumbnail_default.png')
    },
    moveScrollTop() {
      document.querySelector('.vscan-search-detail').scrollTo({top: 0, behavior: 'smooth'});
    },
    toggleTopButton() {
      const contents = document.querySelector('.vscan-search-detail');
      contents.addEventListener('scroll', () => {
        const currentScrollPosition = contents.pageYOffset || contents.scrollTop
        if (currentScrollPosition > 60) {
          this.isTopButton = true;
        } else {
          this.isTopButton = false;
        }
      })
    }
  }
};
</script>