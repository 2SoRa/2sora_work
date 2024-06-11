<template>
  <!-- V스캔 쇼핑몰 : 메인 Layout -->
  <div class="search-mall" :class="{ 'eng' : currentLanguage === 'eng' }">
    <!-- 쇼핑몰 도서 찾기 Header -->
    <div class="sub-gnb">
      <div class="sub-gnb-left small black">
        <button type="button" class="btn-back">
          <router-link :to="{ name : 'ReadingClubMainView' }"></router-link>
        </button>
      </div>
      <!--   상단 탭  -->
      <div class="switch type-text">
        <button class="switch-item" :class="{ 'active' : currentLanguage === 'kor' }" @click="toggleLanguage('kor')">
          한글 도서몰
        </button>
        <button class="switch-item" :class="{ 'active' : currentLanguage === 'eng' }" @click="toggleLanguage('eng')">
          영어 도서몰
        </button>
      </div>
      <div class="sub-gnb-right small black">
        <button type="button" class="btn-vscan-search">
          <router-link :to="{ name : 'searchForm', query:{path: currentLanguage } }"></router-link>
        </button>
        <button type="button" class="btn-vscan-cart">
          <router-link :to="{ name : 'searchCart', query : { page : 'kor' }}">
          </router-link>
        </button>
        <button type="button" class="btn-close">
          <router-link :to="{ name : 'ReadingClubMainView' }"></router-link>
        </button>
      </div>
    </div>
    <!-- 쇼핑몰 도서 찾기 2뎁스 -->
    <div class="menu">
      <div class="menu-area bottom-line static-size">
        <ul class="depth-2">
          <template v-for="item in categories[currentLanguage]" :key="item.id">
            <li class="menu-item" :class="{ 'active' : item.id === currentActive }" @click="currentActive = item.id; changeCategory(item.id);">
              {{ item.name }}<span></span></li>
          </template>
        </ul>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isPopup : true,
      noPopup : false,
      currentLanguage: 'kor',
      currentActive: 0,
      currentActiveSub: 0,
      categories: {
        // 한글 도서몰 카테고리
        kor: [
          {
            id: 0,
            name: '24~35개월'
          },
          {
            id: 1,
            name: '4세'
          },
          {
            id: 2,
            name: '5세'
          },
          {
            id: 3,
            name: '6세 이상'
          },
          // {
          //   id: 4,
          //   name: '한글 이벤트'
          // },
          {
            id: 4,
            name: '단행본',
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
        // 영어 도서몰 카테고리
        eng: [
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
        ]
      },
    }
  },
  created() {
    this.setParams();
    this.$router.push({
      name: 'searchList',
      params : {
        lang : this.currentLanguage,
        active : this.currentActive,
        subactive : this.currentActiveSub
      }
    });
    this.checkPopup();
  },
  methods: {
    // 프로모션 팝업 쿠키 체크
    checkPopup() {
      // 쿠키 체크
      const cookiedata = document.cookie;
      if ( cookiedata.indexOf("isPromotionPopup=active") < 0 ){
        this.isPopup = true;
      } else this.isPopup = false;
    },
    // 프로모션 팝업 닫기
    closePromotion() {
      if (this.noPopup) {
        var todayDate = new Date();
        todayDate.setDate( todayDate.getDate() + 7 );
        document.cookie = "isPromotionPopup=active;path=/;expires=" + todayDate.toGMTString() + ";"
      }
      this.isPopup = false;
    },
    setParams() {
      this.currentLanguage = this.$route.params.lang ? this.$route.params.lang : 'kor';
      this.currentActive = this.$route.params.active ? parseInt(this.$route.params.active) : 0;
      this.currentActiveSub = this.$route.params.subactive ? parseInt(this.$route.params.subactive) : 0;
    },
    // 도서몰 1뎁스 변경 (한글,영어)
    toggleLanguage(type) {
      this.currentLanguage = type;
      this.currentActive = 0;
      this.$router.push({
        name: 'searchList',
        params : {
          lang : type,
          active : 0,
          subactive : 0
        }
      })
    },
    // 도서몰 2뎁스 변경
    changeCategory(id) {
      this.currentActive = id;
      this.currentActiveSub = 0;
      this.$router.push({
        name: 'searchList',
        params : {
          lang : this.currentLanguage,
          active : id,
          subactive : 0
        }
      })
    },
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
    // goEventPageTab(id) {
    //   //한글 도서몰 > 24 ~ 35개월
    //   if(id == 0) {
    //     this.currentLanguage = 'kor';
    //     this.currentActive = 0;
    //     this.currentActiveSub = 0;
    //   }
    //   //영어 도서몰 > 페피피그 특가
    //   if(id == 1 ) {
    //     this.currentLanguage = 'eng'
    //     this.currentActive = 5;
    //     this.currentActiveSub = 0;
    //   }
    //   //한글 도서몰 > 한글 이벤트
    //   if(id == 2) {
    //     this.currentLanguage = 'kor';
    //     this.currentActive = 4;
    //     this.currentActiveSub = 0;
    //   }
    //
    //   this.$router.push({
    //     params:{
    //       lang: this.currentLanguage,
    //       active: this.currentActive,
    //       subactive: this.currentActiveSub
    //     },
    //   })
    //
    //   this.isPopup = false;
    // }
  }
}
</script>