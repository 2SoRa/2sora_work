<template>
<div class="assets-container">
  <h1>Assets</h1>
  <ul>
    <li>form : 체크박스, +- 제어 박스</li>
    <li>Tag : 주영역, 부영역 디자인, 사이즈 별 커스텀 요소 </li>
    <li>2depth menu</li>
    <li>product list</li>
  </ul>

  <h2>form 요소</h2>
  <div class="comp-wrap">
    <div class="comp-item">
      <h3>원형 체크박스.input-circle-chk</h3>
      <div class="input-circle-chk border-bd-gray">
        <input type="checkbox" id="agree">
        <label for="agree">전체 선택</label>
      </div>
    </div>
    <div class="comp-item">
      <h3>+- .input-quantity-group</h3>
      <div class="input-quantity-group">
        <input type="button" value="-" class="btn-minus" data-field="quantity">
        <input type="number" max="" value="1" name="quantity" class="input-current-num" readonly>
        <input type="button" value="+" class="btn-plus" data-field="quantity">
      </div>
    </div>
  </div>

  <h2>Tag</h2>
  <div class="comp-wrap">
    <div class="tag-wrap">
      <div class="tag">
        <img src="@/assets/img/launcher-readingclub/common/icons/ico_tag_society.webp" alt="사회성" class="tag-item">
        <img src="@/assets/img/launcher-readingclub/common/icons/ico_tag_language.webp" alt="언어" class="tag-item">
        <img src="@/assets/img/launcher-readingclub/common/icons/ico_tag_recognition.webp" alt="인지" class="tag-item">
        <img src="@/assets/img/launcher-readingclub/common/icons/ico_tag_emotion.webp" alt="정서" class="tag-item">
      </div>
      <div class="tag ar">
        <p class="tag-item step basic">Basic</p> <!--단계표시-->
        <p class="tag-item step intermediate">Intermediate</p>
        <p class="tag-item step advanced">Advanced</p>
        <p class="tag-item level">AR 1.0 ~ 1.8</p><!--AR표시-->
      </div>
    </div>
    <div class="tag-wrap shadow-box" style="max-width:500px">
      <div class="tag ar">
        <p class="tag-item step basic">Basic</p> <!--단계표시-->
        <p class="tag-item step intermediate">Intermediate</p>
        <p class="tag-item step advanced">Advanced</p>
        <p class="tag-item level">AR 1.0 ~ 1.3</p><!--AR표시-->
      </div>
    </div>
    <div class="tag-wrap rounded">
      <div class="tag ar">
        <p class="tag-item step basic">Basic</p> <!--단계표시-->
        <p class="tag-item step intermediate">Intermediate</p>
        <p class="tag-item step advanced">Advanced</p>
        <p class="tag-item level">AR 1.0 ~ 1.8</p><!--AR표시-->
      </div>
    </div>
    <div class="tag-wrap rounded size-big">
      <div class="tag ar">
        <p class="tag-item step basic">Basic</p> <!--단계표시-->
        <p class="tag-item step intermediate">Intermediate</p>
        <p class="tag-item step advanced">Advanced</p>
        <p class="tag-item level">AR 1.0 ~ 1.8</p><!--AR표시-->
      </div>
    </div>
    <div class="tag-wrap rounded">
      <div class="tag develop">
        <p class="tag-item general">general</p> <!--단계표시-->
        <p class="tag-item language">language</p>
        <p class="tag-item recognition">recognition</p>
        <p class="tag-item emotion">emotion</p>
        <p class="tag-item sociality">sociality</p>
        <p class="tag-item creativity">creativity</p>
      </div>
    </div>
    <div class="tag-wrap rounded size-big">
      <div class="tag develop">
        <p class="tag-item general">종합발달</p>
        <p class="tag-item language">언어발달</p>
        <p class="tag-item recognition">인지발달</p>
        <p class="tag-item emotion">정서발달</p>
        <p class="tag-item sociality">사회성발달</p>
        <p class="tag-item creativity">창의사고력</p>
      </div>
    </div>
    <div class="tag-wrap rounded-tail">
      <div class="tag develop">
        <p class="tag-item general">종합발달</p>
        <p class="tag-item language">언어발달</p>
        <p class="tag-item recognition">인지발달</p>
        <p class="tag-item emotion">정서발달</p>
        <p class="tag-item sociality">사회성발달</p>
        <p class="tag-item creativity">창의사고력</p>
      </div>
    </div>
    <div class="tag-wrap rounded-tail">
      <div class="tag ar">
        <p class="tag-item step basic">Basic</p> <!--단계표시-->
        <p class="tag-item step intermediate">Intermediate</p>
        <p class="tag-item step advanced">Advanced</p>
        <p class="tag-item level">AR 1.0 ~ 1.8</p><!--AR표시-->
      </div>
    </div>
    <div class="tag-wrap rounded rounded-outline-developer">
      <div class="tag develop">
        <p class="tag-item general">종합발달</p>
        <p class="tag-item language">언어발달</p>
        <p class="tag-item recognition">인지발달</p>
        <p class="tag-item emotion">정서발달</p>
        <p class="tag-item sociality">사회성발달</p>
        <p class="tag-item creativity">창의사고력</p>
      </div>
    </div>
    <div class="tag-wrap rounded rounded-outline-developer size-big">
      <div class="tag develop">
        <p class="tag-item general">종합발달</p>
        <p class="tag-item language">언어발달</p>
        <p class="tag-item recognition">인지발달</p>
        <p class="tag-item emotion">정서발달</p>
        <p class="tag-item sociality">사회성발달</p>
        <p class="tag-item creativity">창의사고력</p>
      </div>
    </div>
    <div class="tag-wrap rounded-more-big">
      <div class="tag">
        <p class="tag-item active">select</p> <!--선택되었을 때-->
        <p class="tag-item">default</p>
      </div>
    </div>
    <div class="tag-wrap rounded-more-big rounded-outline-bk">
      <div class="tag">
        <p class="tag-item active">select</p> <!--선택되었을 때-->
        <p class="tag-item">default</p>
      </div>
    </div>
  </div>

  <h2>2depth menu</h2>
  <!-- active 될 때 하단에 줄+삼각형 들어가야 될 때 bottom-triangle 클래스 추가,
    컬러에 따라 type-green type-purple 추가
    고정 사이즈일때 static-size 추가
    -->
  <!-- 기본형  -->
  <div class="menu-area bottom-triangle static-size">
    <ul class="depth-2">
      <li class="menu-item active">24~35개월<span></span></li>
      <li class="menu-item">4세</li>
      <li class="menu-item">5세</li>
      <li class="menu-item">6세 이상</li>
      <li class="menu-item">단행본</li>
    </ul>
  </div>
  <!--  초록색 타입 -->
  <div class="menu-area bottom-triangle type-green">
    <ul class="depth-2">
      <li class="menu-item active">24~35개월<span></span></li>
      <li class="menu-item">4세</li>
      <li class="menu-item">5세</li>
      <li class="menu-item">6세 이상</li>
      <li class="menu-item">단행본</li>
    </ul>
  </div>
  <div class="menu-area bottom-triangle type-purple">
    <ul class="depth-2">
      <li class="menu-item active">24~35개월<span></span></li>
      <li class="menu-item">4세</li>
      <li class="menu-item">5세</li>
      <li class="menu-item">6세 이상</li>
      <li class="menu-item">단행본</li>
    </ul>
  </div><br>
  <div class="menu-area bottom-line static-size">
    <ul class="depth-2">
      <li class="menu-item active">24~35개월<span></span></li>
      <li class="menu-item">4세</li>
      <li class="menu-item">5세</li>
      <li class="menu-item">6세 이상</li>
      <li class="menu-item">단행본</li>
    </ul>
  </div>
  <br> <br>


  <div class="main-gnb-tab">
    <button type="button" >스터디</button>
    <button type="button">슈퍼리딩</button>
  </div>
<br>
  <div class="switch type-green">
    <button class="switch-item active"><img src="@/assets/img/launcher-readingclub/search-mall/btn_search_mall_ko_active.webp" alt=""></button>
    <button class="switch-item"><img src="@/assets/img/launcher-readingclub/search-mall/btn_search_mall_eng_default.webp" alt=""></button>
  </div>
  <br>
  <div class="switch type-text">
    <button class="switch-item active">한글도서몰</button>
    <button class="switch-item">영어도서몰</button>
  </div>


  <h2>전용몰 상품 리스트</h2>
  <!--  TODO: 도서 리스트 영역    -->
  <div class="product-items-list">
    <div class="book-card-item">
      <div class="thumb-wrap">
        <div class="img-wrap">
          <img alt="도서 썸네일" style="width: 342px; height: 342px;">
        </div>
        <div class="badge-wrap">
            <img src="@/assets/img/launcher-readingclub/common/badge_exclusive.webp" alt="책 읽기 서비스 독점 뱃지">
            <img src="@/assets/img/launcher-readingclub/common/badge_vscan.webp" alt="V스캔 뱃지">
        </div>
        <!-- TODO : 장바구니 담기 불가인 경우 버튼 상태 disabled -->
        <button type="button" class="btn-cart blue"></button>
      </div>
      <div class="book-info-wrap">
        <p class="pub">출판사</p>
        <p class="title">책 제목</p>
      </div>
      <div class="tag-wrap rounded rounded-outline-developer">
          <div class="tag develop">
            <p class="tag-item language">언어발달</p>
            <p class="tag-item recognition">인지발달</p>
          </div>
      </div>
    </div>
<!--  가격 표시  -->
    <div class="book-card-item">
      <div class="thumb-wrap">
        <div class="img-wrap">
          <img alt="도서 썸네일" style="width: 342px; height: 342px;">
        </div>
        <div class="badge-wrap">
            <img src="@/assets/img/launcher-readingclub/common/badge_exclusive.webp" alt="책 읽기 서비스 독점 뱃지">
            <img src="@/assets/img/launcher-readingclub/common/badge_vscan.webp" alt="V스캔 뱃지">
        </div>
        <button type="button" class="btn-cart blue"></button>
      </div>
      <div class="book-info-wrap">
        <p class="pub">출판사</p>
        <p class="title">책 제목</p>
      </div>
      <div class="price-wrap">
        <div class="price-item"><p class="discount">123,000<span>원</span></p><small class="original">300,000원</small></div>
        <div class="price-item purple"><p>100,000<span>원</span></p><small class="percent">포인트 적용가</small><p>30%</p></div>
      </div>
      <div class="tag-wrap rounded rounded-outline-developer">
          <div class="tag develop">
            <p class="tag-item language">언어발달</p>
            <p class="tag-item recognition">인지발달</p>
          </div>
      </div>
    </div>
    <!--  품절 표시  -->
    <div class="book-card-item">
      <div class="thumb-wrap">
        <div class="img-wrap">
          <img alt="도서 썸네일" style="width: 342px; height: 342px;">
        </div>
        <div class="badge-wrap">
          <img src="@/assets/img/launcher-readingclub/common/badge_exclusive.webp" alt="책 읽기 서비스 독점 뱃지">
          <img src="@/assets/img/launcher-readingclub/common/badge_vscan.webp" alt="V스캔 뱃지">
        </div>
        <button type="button" class="btn-cart blue" disabled></button>
      </div>
      <div class="book-info-wrap">
        <p class="pub">출판사</p>
        <p class="title">책 제목</p>
      </div>
      <div class="price-wrap sold-out">
        <div class="price-item"><p>판매 중지</p></div>
      </div>
      <div class="tag-wrap rounded rounded-outline-developer">
        <div class="tag develop">
          <p class="tag-item language">언어발달</p>
          <p class="tag-item recognition">인지발달</p>
        </div>
      </div>
    </div>
  </div>

  <h2>가격표</h2>
  <div class="flex">
    <div class="price-wrap">
      <div class="price-item"><p>123,000<span>원</span></p><small class="original">300,000원</small></div>
      <div class="price-item purple"><p>100,000<span>원</span></p><small>포인트 적용가</small><p>30%</p></div>
    </div>
    <div class="price-wrap size-middle">
      <div class="price-item"><p>123,000<span>원</span></p><small class="original">300,000원</small></div>
      <div class="price-item purple"><p>100,000<span>원</span></p><small>포인트 적용가</small><p>30%</p></div>
    </div>
    <div class="price-wrap size-big">
      <div class="price-item"><p>123,000<span>원</span></p><small class="original">300,000원</small></div>
      <div class="price-item purple"><p>100,000<span>원</span></p><small>포인트 적용가</small><p>30%</p></div>
    </div>
  </div>

    <!-- TODO : 프로모션 안내 팝업 -->
    <div class="modal-mall-promotion"> <!--  -->
      <div class="whole-modal">
        <div class="whole-modal-dim"></div>
        <div class="whole-modal-content">
          <div class="contents">
            <button type="button" class="close type-alpha" @click="closePromotion"></button>
            <button type="button" class="btn-goto-mall" @click="goEventPageTab('0')">
              <img src="@/assets/img/launcher-readingclub/search-mall/popup/btn_goto_mall.webp" alt="전용몰 오픈! 전용몰 페이지로 바로가기">
            </button>
            <ol class="col-list col-3">
              <li>
                <button type="button" class="" @click="goEventPageTab('1')">
                  <img src="@/assets/img/launcher-readingclub/search-mall/popup/mall_pop_item_1.webp" alt="이벤트 01. 페파피그 전집 100세트 한정 보러가기">
                </button>
              </li>
              <li>
                <button type="button" class="" @click="goEventPageTab('2')">
                  <img src="@/assets/img/launcher-readingclub/search-mall/popup/mall_pop_item_2.webp" alt="이벤트 02. 연령별 베스트셀러 포인트 30% 적용혜택">
                </button>
              </li>
              <li>
                <button type="button" class="">
                  <img src="@/assets/img/launcher-readingclub/search-mall/popup/mall_pop_item_3.webp" alt="이벤트 03. 10만원 이상 구매자 전원 슈퍼리딩 캐릭터 스케치북 5set 증정">
                </button>
              </li>
            </ol>
          </div>
          <!-- 5일간 다시 보지 않기 체크박스 -->
          <div class="input-circle-chk border-bd-gray">
            <input type="checkbox" id="cartItem2" v-model="noPopup"><label for="cartItem2">5일간 다시 보지 않기</label>
          </div>
        </div>
      </div>
    </div>
</div>
</template>
<script>
export default {
  data() {
    return {
      noPopup: false
    }
  },
  methods:{
    closePromotion() {
      this.$emit('closePromotion',this.noPopup);
    },
    goEventPageTab() {
      //TODO : 영어 도서몰 > 영어이벤트
      this.currentLanguage = 'eng';
      this.currentActive = 3;
      this.currentActiveSub = 0;

      this.$router.push({
        name:'searchList',
        params:{
          lang: this.currentLanguage,
          active: this.currentActive,
          subactive: this.currentActiveSub
        },
      })
    }
  }
}
</script>
<style scoped>
.assets-container {text-align:left;}
h1 {font-size:48px;}
h2 {
  position:relative;
  font-size:36px; margin-top:50px;
  padding:30px;
  border-top:18px solid #f2f2f2;
  &:before {
    display:inline-block;
    content:'';
    position:relative;
    width:4px; height:4px;
    top:-8px; margin-right:14px;
    border-radius:50%;
    background-color:#292929;
  }
}
h3 {font-size:14px; margin:20px 0;}
.comp-wrap {
  display:flex; flex-wrap:wrap;
  max-width:90%; padding:30px; margin:0 auto; border-radius:12px; background:#fff;
  text-align:center;
}
.comp-item {
  position:relative;
  padding:20px;
  &:after {
    display:block;
    content:'';
    position:absolute;
    width:2px; height:100%;
    top:0; right:0;
    background-color:#fff;
  }
  &:last-child {
    &:after {display:none;}
  }
}
.flex { display: flex; gap: 30px; }
</style>