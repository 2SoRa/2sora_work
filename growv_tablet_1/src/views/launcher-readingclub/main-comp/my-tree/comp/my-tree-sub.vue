<template>
  <div class="my-tree sub" :class="['theme-' + selectedYear]">
    <!-- TODO : 월별 배경이미지 gnb에도 인라인 스타일 적용 필요 -->
    <div class="sub-gnb" v-if="treeData.monthBgImg" :style="{ backgroundImage : 'url('+ treeData.monthBgImg.fileUrl +')'}">
      <div class="sub-gnb-left">
        <button v-if="!isPath" type="button" @click="this.$router.go(-1)" class="btn-back"></button>
        <button v-if="isPath" type="button" class="btn-back"><router-link :to="{ name : 'GrowingTree' }"></router-link></button>
      </div>
      <h1>{{ translteMonth(selectedMonth) }}월 자람나무</h1>
      <div class="sub-gnb-right">
        <button type="button" class="btn-close">
          <template v-if="!isPath"><router-link :to="{ name : 'ReadingClubMainView' }">close</router-link></template>
          <template v-if="isPath"><router-link :to="{ name : 'GrowingTree' }">close</router-link></template>
        </button>
      </div>
    </div>
    <div class="content-scroll-area" v-if="treeData">
      <div class="sub-bg" :style="{ backgroundImage : 'url('+ treeData.monthBgImg.fileUrl +')'}">
        <div class="sub-title">
          <strong class="text">{{ treeData.monthMiNm }}</strong>
          <p class="text period">미션 기간 : <span>{{ selectedYear }}.{{ selectedMonth }}.01 ~ {{ selectedYear }}.{{ selectedMonth }}.{{ selectedMonthEnd }}</span></p>
          <div class="gauge-bar">
            <div class="mask" :style="{ width : selectedProgress + '%' }"></div>
          </div>
        </div>
        <!-- 미션 현황 -->
        <div class="side-info">
          <h2 class="text-blind">미션 현황</h2>
          <ul class="box-num-list">
            <li class="list-item">{{ attendCount }}</li>
            <li class="list-item" v-if="treeData.treeAct">
              {{ treeData.treeAct.growMissionCn <= 45 ? treeData.treeAct.growMissionCn : 45}}
            </li>
            <li class="list-item" v-else>0</li>
          </ul>
        </div>
        <template v-if="treeData">
          <div class="report-list-wrap attend">
            <h3 class="text-blind">출석 미션</h3>
            <ul class="col-list">
              <li v-for="(item, index) in 5" :key="index" :class="{ active : attendCount > index }">
                <img :src="treeData.monthAttendImg.fileUrl" alt="출석 미션 성공 썸네일">
              </li>
            </ul>
          </div>
          <div class="report-list-wrap normal">
            <h3 class="text-blind">일반 미션</h3>
            <ul class="col-list" v-if="treeData.treeAct">
              <li v-for="(item, index) in 45" :key="index" :class="{ active : treeData.treeAct.growMissionCn > index }">
                <img :src="treeData.monthMissionImg.fileUrl" alt="일반 미션 성공 썸네일">
              </li>
            </ul>
            <ul class="col-list" v-else>
              <li v-for="(item, index) in 45" :key="index">
                <img :src="treeData.monthMissionImg.fileUrl" alt="일반 미션 성공 썸네일">
              </li>
            </ul>
          </div>
        </template>
      </div>
      <!-- TODO : 미션 성공 시 클래스 추가 .onShow-->
      <template v-if="treeData.treeAct">
        <div class="flag-success text-blind" :class="{onShow : treeData.treeAct.growMissionCn >= 45 && treeData.treeAct.growAttendCn >= 20}">
          <h3>미션 성공!!!</h3>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import moment from "moment";
import readingClubFactory from "@/api/reading-club/readingClub-factory";
import {mapGetters} from "vuex";

const myTreeApi = readingClubFactory.get('myTree')
export default {
  name : 'myTreeSub',
  data() {
    return {
      treeData : '',
      studentId : null,
      isPath: false, //마이페이지로부터 진입 여부,
      attendCount:0,
    }
  },
  computed : {
    ...mapGetters(['userInfo']),
    selectedYear() {
      return this.$route.params.year;
    },
    selectedMonth() {
      return this.$route.params.month;
    },
    selectedMonthEnd() {
      return moment(this.selectedYear +'-'+this.selectedMonth).daysInMonth();
    },
    selectedProgress() {
      const date = new Date();
      if ((moment(date).format('YYYY') === this.selectedYear) && (moment(date).format('MM') === this.selectedMonth)) {
        return parseInt(moment(date).format('D') / this.selectedMonthEnd * 100 );
      } else {
        return 100;
      }
    }
  },
  created() {
    this.studentId = this.userInfo.info.studentId;
    this.getTreeMonth();
    if(this.$route.query.path === 'mypage'){
      this.isPath = true
    }
  },
  methods : {
    getTreeMonth() {
      const treeYearData = myTreeApi.getTreeMonth(this.studentId, this.selectedYear, this.selectedMonth);
      treeYearData.then((res) => {
        if (res.status === 200) {
          this.treeData = res.data.data;
          if (!this.treeData.treeAct) {
            this.attendCount = 0;
          } else {
            this.setAttendCount()
          }
        }
      })
    },
    //출석미션현황 개수 세팅
    setAttendCount() {
      if( this.treeData.treeAct.growAttendCn >= 20) {
        this.attendCount = 5;
        return;
      }
      if(this.treeData.treeAct.growAttendCn >= 15) {
        this.attendCount = 4;
        return;
      }
      if(this.treeData.treeAct.growAttendCn >= 10) {
        this.attendCount = 3;
        return;
      }
      if(this.treeData.treeAct.growAttendCn >= 5) {
        this.attendCount = 2;
        return;
      }
      if(this.treeData.treeAct.growAttendCn >= 3) {
        this.attendCount = 1;
        return;
      }
    },
    translteMonth(mon) {
      return Number(mon);
    }
  }
}
</script>
