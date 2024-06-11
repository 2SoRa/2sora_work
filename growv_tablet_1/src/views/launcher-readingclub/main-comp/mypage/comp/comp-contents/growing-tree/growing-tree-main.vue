<template>
  <div class="content-main jaram-tree" @scroll="handleScroll">
    <div class="main-top-area">
      <div class="btn-calendar type-trans-purple">
        <!-- TODO : 이전 달 or 다음 달 없을 경우 button 상태 disabled -->
        <button type="button" class="btn-prev" @click="movePreviousMonth" :disabled="!moveIsPrevMonth">이전 달</button>
        <p class="txt-month">{{ moveDate }}</p>
        <button type="button" class="btn-next"  @click="moveNextMonth" :disabled="!moveIsNextMonth">다음 달</button>
      </div>
      <div class="my-jaram-view">
        <p class="icon-txt">나의 자람나무</p>
        <p class="txt-data"><span class="current">{{totalDataCount <=50 ? totalDataCount : 50}}</span><i class="txt-slash">/</i><span class="max">50</span></p>
        <button type="button" class="btn-link"><router-link :to="{path: `/my-tree/` + moveYear + `/` + moveMonth , query:{path:'mypage'}}"><p class="text-blind">바로가기</p></router-link></button>
      </div>
    </div>
    <div class="main-area">
      <!-- 적립 안내 버튼 및 팝업창-->
      <div class="table-top" ref="tooltip">
        <p class="table-title">상세 내역</p>
        <button type="button" @click="handelTooltip" class="btn-save-guide text-blind">적립 안내</button>
        <!-- TODO :
             적립 안내 버튼 눌렀을 떄 : popup-tooltip 열기
             툴팁 닫기 버튼, 화면 스크롤(제외될 수도 있음), 아무곳이나 눌렀을 때 : popup-tooltip 닫기
         -->
        <div class="popup-tooltip" v-show="tooltipOpen" >
          <ul class="dot-list">
            <li class="list-item">성공한 미션에 따라 1개씩 적립이 돼요. (월 최대 50개, 이월 불가)</li>
<!--            <li class="list-item no-indent">Oxford Readers 책은 아직 적립이 되지 않아요. (추후 서비스 예정)</li>-->
            <li class="list-item">출석 미션 : 3일, 5일, 10일, 15일, 20일 출석에 성공하면 1개씩 적립돼요.</li>
            <li class="list-item">일반 미션 : 매일 출석하거나, 책을 읽으면 1개씩 적립돼요. <br>같은 책은 여러번 읽어도 월 1개만 적립돼요. <br>(월마다 초기화)</li>
          </ul>
          <button type="button" @click="handelTooltip" class="btn-close text-blind">닫기</button>
        </div>
      </div>
      <!-- 상세 내역 테이블 -->
      <div class="table-wrap">
        <table>
          <tr>
            <th class="number">번호</th>
            <th class="point">적립</th>
            <th class="detail">상세내용</th>
            <th class="date">날짜</th>
          </tr>
          <tr v-show="totalDataCount !== 0" v-for="(item,index) in growTreeList" :key="index">
            <td class="number">{{totalDataCount-(index)}}</td>
            <!-- TODO: 획득한 학습 경로에 따라 (독서, 출석) 텍스트 노출 -->
            <td class="point">{{item.missionDiv === 'NM' ? '일반미션' : '출석미션'}}</td>
            <!-- TODO: 미션 상세 내용 노출 -->
            <td class="detail">{{item.missionNm}}</td>
            <td class="date">{{item.reg.dtm}}</td>
          </tr>
        </table>

<!--        <div v-show="isMoreButton" @click="handleMore" class="more-list addListBtn">-->
<!--          <button type="button"></button>-->
<!--        </div>-->

        <!-- 내용 없을 경우 -->
        <div class="no-list" v-show="totalDataCount === 0">
          <div class="no-list-content">
            <img src="@/assets/img/launcher-readingclub/common/cha_pop_nothing_ev.webp">
            <p>등록된 내용이 없습니다.</p>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import dataMixin from "@/common/mixin/dataMixin";
import moment from "moment/moment";
import readingClubFactory from "@/api/reading-club/readingClub-factory";
import {mapGetters} from "vuex";

const growTreeApi = readingClubFactory.get('mypage')

export default {
  mixins: [dataMixin],
  data() {
    return {
      growTreeList:[],
      // pagePerview: 2,
      countClick: 0,
      tooltipOpen : false,
      studentId:'',
      pageIndex:1,
      pageSize:10,
      totalDataCount:0,
      addCount:1,
      isMoreButton: false
    };
  },
  computed : {
    ...mapGetters(['userInfo']),
    moveNowDate : () => {
      const date = new Date();
      return moment(date).locale("ko").format("YYYY년 MM월");
    }
  },
  created() {
    this.studentId = this.userInfo.info.studentId;
  },
  mounted() {
    window.addEventListener('click', this.onClick);
  },
  watch: {
    //월이 바뀌면 바뀐 월 데이터 불러오기
    moveDate(oldMonth, newMonth) {
      if (oldMonth !== newMonth) {
        this.addCount = 1
        this.pageIndex = 1;
        this.isMoreButton = false;
        this.growTreeList = [];
        this.getData();
      }
    },
  },
  methods: {
    //데이터 받아오기
    getData() {
      const params = {
        studentId : this.studentId,
        yearMonth : this.moveYear+this.moveMonth,
        page: this.pageIndex,
        pageSize : this.pageSize
      }

      const growtreeList = growTreeApi.getGrowTreeList(params);
      growtreeList.then((res)=>{
        if(this.pageIndex === 1){
          this.totalDataCount = res.data.data?.length;
          this.checkMoreButton();
        }
        Array.prototype.push.apply(this.growTreeList, res.data.data);
      }).catch((err)=>{console.log(err)})

    },
    checkMoreButton() {
      if(this.totalDataCount > this.pageSize) {
        this.isMoreButton = true
      }
    },
    handleMore() {
      this.addCount++
      //불러 와야하는 총 페이지 개수
      const totalIndex = Math.ceil(this.totalDataCount / this.pageSize);

      if(this.addCount <= totalIndex){
        this.pageIndex++
        this.getData();
        if(this.addCount === totalIndex){
          this.isMoreButton = false
        }
      }
    },
    handelTooltip() {
      this.tooltipOpen = !this.tooltipOpen;
    },
    //외부 영역 클릭시 안내 창 닫힘
    onClick(event) {
      if (event.target.parentNode !== this.$refs.tooltip){
        this.tooltipOpen = false
      }
    },
    //스크롤시 안내 창 닫힘
    handleScroll() {
      setTimeout(()=>{
        this.tooltipOpen = false
      },200)
    }
  },
};
</script>

