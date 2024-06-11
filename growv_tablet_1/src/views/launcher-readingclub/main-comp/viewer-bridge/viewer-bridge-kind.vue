<template>
  <div class="info-pop-wrap">
    <!-- 슈퍼픽 -->
    <div class="guide-content guide-superpick">
      <div class="sub-gnb">
        <div class="sub-gnb-right">
          <button type="button" class="btn-close"><router-link :to="{ name: 'superpickMain' }"></router-link></button>
        </div>
      </div>
    </div>

    <!-- 한글 도서관 -->
    <div class="guide-content guide-library">
      <div class="sub-gnb has-wave-bg">
        <h1>한글 도서관 안내</h1>
        <div class="sub-gnb-right">
          <button type="button" class="btn-close"><router-link :to="{ name: 'koreanLibraryKind' }"></router-link></button>
        </div>
      </div>
      <div class="contents">
        <h2 class="content-title">
          <img src="@/assets/img/launcher-readingclub/guide/guide_title_library.webp" alt="title">
        </h2>
<!--   출판사 있을 때     -->
<!--        <ul class="col-list col-4">-->
<!--          <li v-for="item in 4" :key="item"></li>-->
<!--        </ul>-->
        <ul class="col-list col-3 no-pub">
          <li v-for="item in 3" :key="item"></li>
        </ul>
      </div>
    </div>
    <!-- 영어도서관 -->
    <div class="guide-content guide-library eng">
      <div class="sub-gnb has-wave-bg">
        <h1>영어 도서관 안내</h1>
        <div class="sub-gnb-right">
          <button type="button" class="btn-close"><router-link :to="{ name: 'englishLibraryStep' }"></router-link></button>
        </div>
      </div>
      <div class="contents">
        <h2 class="content-title">
          <img src="@/assets/img/launcher-readingclub/guide/guide_title_library_eng.webp" alt="title">
        </h2>
        <ul class="col-list col-4">
          <li v-for="item in 4" :key="item"></li>
        </ul>
      </div>
    </div>
    <!-- 내 도서관 -->
    <div class="guide-content guide-mylibrary">
      <div class="sub-gnb has-wave-bg">
        <h1>내 도서관 안내</h1>
        <div class="sub-gnb-right">
          <button type="button" class="btn-close"><router-link :to="{ name: 'myLibraryTodayBook' }"></router-link></button>
        </div>
      </div>
      <div class="contents">
        <ul class="col-list col-3">
          <li v-for="item in 3" :key="item"></li>
        </ul>
      </div>
    </div>
    <!-- 학습현황 -->
    <div class="guide-content guide-status">
      <div class="sub-gnb has-wave-bg">
        <h1>학습 현황 안내</h1>
        <div class="sub-gnb-right">
          <button type="button" class="btn-close"><router-link :to="{ name: 'readingStatusAttend' }"></router-link></button>
        </div>
      </div>
      <div class="contents">
        <ul class="col-list col-3">
          <li v-for="item in 3" :key="item"></li>
        </ul>
      </div>
    </div>
    <!-- 마이슈퍼북 -->
    <div class="guide-content guide-mysuperbook">
      <div class="sub-gnb has-wave-bg">
        <h1>마이슈퍼북 안내</h1>
        <div class="sub-gnb-right">
          <button type="button" class="btn-close"><router-link :to="{ name: 'mysuperbookWeek' }"></router-link></button>
        </div>
      </div>
      <div class="contents">
        <ul class="col-list col-2">
          <li v-for="item in 2" :key="item"></li>
        </ul>
      </div>
    </div>
    <!-- 자람나무 -->
    <div class="guide-content guide-jaram">
      <div class="sub-gnb has-wave-bg">
        <h1>자람나무 안내</h1>
        <div class="sub-gnb-right">
          <button type="button" class="btn-close"><router-link :to="{ name: 'myTreeMain' }"></router-link></button>
        </div>
      </div>
      <div class="contents">
        <div class="content-title">
          <img src="@/assets/img/launcher-readingclub/guide/guide_title_jaram.webp" alt="title">
        </div>
        <ul class="col-list col-2">
          <li v-for="item in 2" :key="item"></li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return{
      path:'',
    }
  },
  mounted() {
    this.path = this.$route.query.path;
    this.setActivePath();
  },
  methods:{
    setActivePath() {
      let divSelect =  document.querySelector(`.${this.path}`)
      if(this.path === 'guide-library-eng'){
        let engSelect = document.querySelector(`.eng`)
        engSelect.classList.add('active')
      }else divSelect.classList.add('active')
    }
  }
}

</script>


