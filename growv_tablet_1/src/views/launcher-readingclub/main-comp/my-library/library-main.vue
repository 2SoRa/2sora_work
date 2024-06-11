<template>
  <!-- 내 도서관 : 메인 -->
  <div class="my-library">
    <div class="sub-gnb">
      <div class="sub-gnb-left">
        <button type="button" class="btn-back" v-if="!isPath"><router-link :to="{ name : 'ReadingClubMainView' }"></router-link></button>
        <button type="button" class="btn-back" v-if="isPath" @click="this.$router.go(-1)"></button>
      </div>
        <h1>내 도서관</h1>
      <div class="sub-gnb-right">
        <button type="button" class="btn-info"><router-link :to="{name: 'viewBridgeKind' ,query:{path:'guide-mylibrary'}}"><span></span>내 도서관 안내</router-link></button>
        <button type="button" class="btn-close" v-if="!isPath"><router-link :to="{ name : 'ReadingClubMainView' }"></router-link></button>
        <button type="button" class="btn-close" v-if="isPath" @click="this.$router.go(-1)"></button>
      </div>
    </div>
    <div class="contents">
      <ul class="sub-menu-category-wrap">
        <li :class="{ active : currentTab === 'myLibraryTodayBook'}" class="menu-item">
          <a @click="this.$router.replace({name:'myLibraryTodayBook'})">
            <span class="txt">오늘의 책</span>
          </a>
        </li>
        <li :class="{ active : currentTab === 'myLibraryStorage'}" class="menu-item">
          <a @click="this.$router.replace({ name: 'myLibraryStorage'})">
            <span class="txt">보관함</span>
          </a>
        </li>
        <li :class="{ active : currentTab === 'myLibraryVscan'}" class="menu-item active-type-red">
          <a @click="this.$router.replace({ name: 'myLibraryVscan'})">
            <span class="logo vscan text-blind">V스캔</span><span class="txt">구매</span>
          </a>
        </li>
      </ul>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
     isPath:false
    }
  },
  //한글 도서관, 영어 도서관에서 진입 할 경우 표시하기
  created() {
    if(this.$route.query.path){
      this.isPath = true
    }
  },
  computed : {
    currentTab() {
      return this.$route.name;
    },
  },
}
</script>