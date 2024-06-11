<template>
  <div class="schedule-wrap">
    <div class="sub-gnb">
      <div class="sub-gnb-left">
        <button type="button" class="btn-back" v-if="!isPath"><router-link :to="{ name : 'ReadingClubMainView' }"></router-link></button>
        <button type="button" class="btn-back" v-if="isPath === 'mypage'"><router-link :to="{ name : 'GrowingTree' }"></router-link></button>
        <button type="button" class="btn-back" v-if="isPath === 'weekly' "><router-link :to="{ name : 'mysuperbookWeek' }"></router-link></button>
        <button type="button" class="btn-back" v-if="isPath === 'monthly' "><router-link :to="{ name : 'mysuperbookMonth' }"></router-link></button>
      </div>
      <h1>학습 현황</h1>
      <div class="sub-gnb-right">
        <!-- TODO: 안내 팝업 연결 필요 -->
        <button type="button" class="btn-info"><router-link :to="{name: 'viewBridgeKind' ,query:{path:'guide-status'}}"><span></span>학습 현황 안내</router-link></button>
        <!--<button type="button" class="btn-vscan-schedule"><router-link to="">V스캔 시간표</router-link></button>-->
        <button type="button" class="btn-close" v-if="!isPath"><router-link :to="{ name : 'ReadingClubMainView' }"></router-link></button>
        <button type="button" class="btn-close" v-if="isPath === 'mypage'"><router-link :to="{ name : 'GrowingTree' }"></router-link></button>
        <button type="button" class="btn-close" v-if="isPath === 'weekly' "><router-link :to="{ name : 'mysuperbookWeek' }"></router-link></button>
        <button type="button" class="btn-close" v-if="isPath === 'monthly' "><router-link :to="{ name : 'mysuperbookMonth' }"></router-link></button>
      </div>
    </div>
    <div>
      <ul class="sub-menu-category-wrap">
      <!-- TODO: 클릭시 add class "active" -->
        <li class="menu-item" :class="[{active: isActive === 'reading'}]" @click="setActivate('reading')" ><router-link :to="{ name : 'readingStatusActiveCalendar'}"><span class="txt">독서 활동</span></router-link></li>
        <li class="menu-item" :class="[{active: isActive === 'attend'}]" @click="setActivate('attend')"><router-link :to="{ name : 'readingStatusAttend'}"><span class="txt">출석부</span></router-link></li>
      </ul>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import moment from "moment/moment";
import {mapGetters, mapMutations} from "vuex";

export default {
  data() {
    return {
      thisDate: '', // 'YYYY-MM-DD' 형식의 날짜
      year: '',
      month: '',
      isActive:'reading',
      //다른 페이지에서 진입 여부
      isPath: null
    }
  },
  computed: {
    ...mapGetters('readingStatusStorage', ['getDate']),
  },
  created() {
    if(this.$route.query.path === 'mypage'){
      this.isPath = 'mypage'
    }else if(this.$route.query.path === 'monthly'){
      this.isPath = 'monthly'
    }else if(this.$route.query.path === 'weekly') {
      this.isPath = 'weekly'
    }else this.isPath = null

    //마이 슈퍼북에서 넘어온 날짜가 있다면 날짜 저장
    if(this.$route.query.date){
      this.updateDate(moment(this.$route.query.date).format('YYYY-MM-DD'))
    } else this.setCurrentDate();

    if(window.location.href.match('active')){
      this.isActive = 'reading'
    } else this.isActive = 'attend'
  },
  methods: {
    ...mapMutations('readingStatusStorage', [
        'updateDate'
    ]),
    // 현재 날짜 세팅
    setCurrentDate() {
      const date = new Date();
      this.thisDate = moment(date).locale('ko').format('YYYY-MM-DD');
      if(this.getDate !== this.thisDate){
        this.updateDate(this.thisDate);
      }
    },
    setActivate(name) {
      this.isActive = name
    },
  },
}
</script>

<style scoped>

</style>