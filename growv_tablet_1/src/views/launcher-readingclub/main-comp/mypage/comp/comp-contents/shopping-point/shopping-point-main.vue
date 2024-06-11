<template>
  <div class="content-main shopping-point">
    <div class="main-top-area">
      <div class="shopping-point-view">
        <ul class="point-view-top info-half-list dot-list">
          <li class="list-item-tit">
            <p class="icon-txt">나의 포인트 <small>(<b>{{userInfo.info.studentName}}</b> 학생 기준)</small></p>
          </li>
          <li class="list-item remain-point">
            <p>잔여 포인트</p><em>{{insertDotNumber(pointRemaining)}}</em>
          </li>
        </ul>
        <ul class="info-half-list dot-list">
          <li class="list-item save-point"><p>적립 포인트</p><em>{{insertDotNumber(pointGet)}}</em></li>
          <li class="list-item use-point"><p>사용 포인트</p><em>{{insertDotNumber(pointUse)}}</em></li>
          <li class="list-item be-ex-point"><p>소멸 예정 포인트<small>(30일 이내 소멸 예정)</small></p><em>{{insertDotNumber(pointPlanExpired)}}</em></li>
          <li class="list-item ex-point"><p>소멸 포인트</p><em>{{insertDotNumber(pointExpired)}}</em></li>
        </ul>
      </div>
    </div>
    <div class="main-area">
      <!-- 기간 선택 -->
      <div class="table-top">
        <div class="btn-calendar type-trans-purple">
          <button type="button" @click="movePreviousMonth" :disabled="!moveIsPrevMonth" class="btn-prev">이전</button>
          <p class="txt-month">{{ moveDate }}</p>
          <button type="button" @click="moveNextMonth" :disabled="!moveIsNextMonth" class="btn-next">이후</button>
        </div>
        <p class="table-title">총 포인트 내역</p>
      </div>
      <!-- 상세 내역 테이블 -->
      <div class="table-wrap">
        <table v-if="listData">
          <tr>
            <th class="number">번호</th>
            <th class="div">구분</th>
            <th class="detail">상세</th>
            <th class="point">포인트</th>
            <th class="date">날짜</th>
          </tr>
          <tr v-for="(item,index) in listData" :key="item">
            <td class="number">{{totalDataCount-(index)}}</td>
            <td class="div">{{item.pointCategory}}</td>
            <td class="detail">{{item.pointDetailInfo}}</td>
            <td class="point">
              <template v-if="item.pointCategory === '적립' ">+</template>
              <template v-else>-</template>
              {{insertDotNumber(item.point)}}
            </td>
            <td class="date">{{item.pointDate}}</td>
          </tr>
        </table>
        <div class="btn-more-list addListBtn" v-show="isMoreButton">
          <button @click="handleMore">
            <img src="@/assets/img/launcher-readingclub/mypage/mp_btn_txtbtn_more.png" alt="더보기 버튼">
          </button>
        </div>
        <!-- 내용 없을 경우 -->
        <div class="no-list" v-if="totalDataCount === 0">
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
import moment from "moment";
import readingClubFactory from "@/api/reading-club/readingClub-factory";
import {mapGetters} from "vuex";
import numberMixin from "@/common/mixin/numberMixin";

const shoppingPointApi = readingClubFactory.get('mypage')

export default {
  mixins: [dataMixin, numberMixin],
  data() {
    return {
      //모달창 활성화 여부
      rewardShowModal: false,
      studentId:'',
      pageIndex:1,
      pageSize: 10,
      addCount:1,
      //전체 데이터 개수
      totalDataCount:0,
      isMoreButton :false,
      //사용,소멸 리스트내역
      listData: [],
      //포인트 내역
      pointGet:0,
      pointUse:0,
      pointPlanExpired:0,
      pointExpired:0,
      pointRemaining:0,
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
    this.getShoppingPointData();
  },
  watch: {
    //월이 바뀌면 바뀐 월 데이터 불러오기
    moveDate(oldMonth, newMonth) {
      if (oldMonth !== newMonth) {
        this.listData = [];
        this.totalDataCount = 0;
        this.pageIndex = 1;
        this.addCount = 1;
        this.isMoreButton = false;
        this.getShoppingListData();
      }
    },
  },
  methods: {
    //쇼핑포인트 데이터 받아오기
    getShoppingPointData() {
      const shoppingPoint = shoppingPointApi.getShoppingPoint(this.studentId)

      shoppingPoint.then((res)=>{
        let data = res.data.data
        this.pointGet = data.pointGet;
        this.pointUse = data.pointUse;
        this.pointPlanExpired = data.pointPlanExpired;
        this.pointRemaining = data.pointRemaining
        // this.pointData = data
      }).catch((err)=>{
        console.log(err)
      })
    },
    //쇼핑 포인트 사용 내역 받아오기
    getShoppingListData() {
      const params = {
        studentId : this.studentId,
        year: this.moveYear,
        month: this.moveMonth,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }

      const pointList = shoppingPointApi.getShoppingPointList(params);
      pointList.then((res)=>{
        //처음 데이터 받아 올 때만 실행
        if(this.pageIndex === 1){
          this.totalDataCount = res.data.data.count;
          this.checkMoreButton()
        }
        let list = res.data.data.list
        let newList = list.map((item) => {
          return {
            id: item.point_hist_uid,
            pointCategory: this.translatePointType(item.point_use_div),
            pointDetailInfo: item.point_ct,
            point: item.point_vl,
            pointDate: item.reg_dtm,
          };
        });
        Array.prototype.push.apply(this.listData, newList);
      }).catch((err)=>{
        console.log(err)
      })
    },
    //더보기 버튼 활성화 여부
    checkMoreButton() {
      if(this.totalDataCount > this.pageSize){
        this.isMoreButton = true
      }
    },
    handleMore() {
      this.addCount++
      //불러 와야하는 총 페이지 개수
      const totalIndex = Math.ceil(this.totalDataCount / this.pageSize);

      if(this.addCount <= totalIndex){
        this.pageIndex++
        this.getShoppingListData();
        if(this.addCount === totalIndex){
          this.isMoreButton = false
        }
      }
    },
    translatePointType(type){
      let category=''
      switch(type){
        case 'G':
          category = '적립'
          break;
        case 'U':
          category = '사용'
          break;
        case 'E':
          category = '소멸'
          break;
      }
      return category
    }
  },
};
</script>
