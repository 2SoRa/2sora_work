<template>
  <div class="schedule reading">
    <div class="calendar-area"  @scroll="handleScroll">

      <div class="fc">
    <!--    <div class="fc">-->
          <div class="fc-header-toolbar fc-toolbar fc-toolbar-ltr">
            <div class="fc-toolbar-chunk" ref="tooltip">
              <button type="button" @click="handelTooltip" class="fc-button fc-readingSchedule-button"></button>
            </div>
            <div class="fc-toolbar-chunk btn-calendar">
              <button class="btn-prev" @click="prevMonth" :disabled="isPrevMonth"></button>
              <h2 class="txt-month">{{year}}년 {{month}}월</h2>
              <button class="btn-next" @click="nextMonth" :disabled="isNextMonth"></button>
            </div>
            <div class="fc-toolbar-chunk">
              <div class="fc-button fc-listToggle-button calendar">
                <router-link :to="{ name : 'readingStatusActiveCalendar' }"></router-link>
              </div>
            </div>
          </div>
        <!--        목록 영역 -->
        <div class="list-area">
          <!-- 팝업창 -->
          <div class="popup-tooltip" v-show="tooltipOpen">
            <ul class="dot-list">
              <li class="list-item">조회한 기간 동안 몇 권을 읽었는지 표시해요.</li>
              <li class="list-item">한 권을 <span>여러 번</span> 읽어도 숫자가 <span>올라가요.</span></li>
<!--              <li class="list-item"><span>Oxford Readers 책은 추후 반영 예정입니다.</span></li>-->
            </ul>
            <button type="button" @click="handelTooltip" class="btn-close text-blind">닫기</button>
          </div>
    <!--      <p>날짜 : {{ getDate }}</p>-->
          <!--    전체,독서완료,독서중-->
          <form class="form-area">
            <fieldset>
              <legend>전체/독서완료/독서중</legend>
              <div class="radio-underbar-group">
                <div class="radio-input">
                  <input type="radio" id="all" name="list-check" value="A" v-model="readingState" checked>
                  <label for="all">전체</label>
                </div>
                <div class="radio-input">
                  <input type="radio" id="complete" name="list-check" value="Y" v-model="readingState" >
                  <label for="complete">독서 완료</label>
                </div>
                <div class="radio-input">
                  <input type="radio" id="ing" name="list-check" value="N" v-model="readingState">
                  <label for="ing">독서 중</label>
                </div>
              </div>
            </fieldset>
            <fieldset>
              <legend>순서 정렬 셀렉박스</legend>
              <div class="dropdown-wrap">
                <div class="dropdown">
                  <v-select
                      label="cdVlNm"
                      :options="readingOrderItem"
                      v-model="selectedReadingOrder"
                      :reduce="readingOrderItem => readingOrderItem.cdVl">
                    <template #open-indicator="{ attributes }">
                        <span v-bind="attributes">
                          <img src="@/assets/img/launcher-readingclub/common/icons/ico_dropdown_schdeule.webp" alt="arrow">
                        </span>
                    </template>
                  </v-select>
                </div>
              </div>
            </fieldset>
          </form>
          <div>
            <!-- 상세 내역 테이블 -->
            <div class="table-wrap">
              <table>
                <tr>
                  <th class="number">번호</th>
                  <th class="title">도서명</th>
                  <th class="date">마지막 읽은 날짜</th>
                  <th class="detail">독서 회차</th>
                </tr>
                <template v-if="totalDataCount !== 0">
                  <tr v-for="(item,index) in readingList" :key="item">
                    <td class="number">{{ totalDataCount-(index) }}</td>
                    <td class="title">{{ item.bookNm }}</td>
                    <td class="date">{{ item.readingTime }}</td>
                    <td class="detail">{{ item.readingCn === 0 ? '독서중' : item.readingCn +'번 읽음'}}</td>
                  </tr>
                </template>
                <tr v-else>
                  <td colspan="4" class="no-data">
                    <img src="@/assets/img/launcher-readingclub/schedule/bg_study_nodata.webp" alt="학습 이력이 없습니다.">
                  </td>
                </tr>
              </table>
            </div>
          </div>
          <div class="btn-more-list" v-show="isMoreButton">
            <button type="button" @click="handleMore"></button>
          </div>
        </div>
      </div>
      <div class="schedule-bottom"></div>
<!--  </div>-->
    </div>
    <p class="count-text">{{totalReading}}권</p>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";
import moment from "moment";
import readingClubFactory from "@/api/reading-club/readingClub-factory";

const readingListApi = readingClubFactory.get('readingActivity')

export default {
  data() {
    return {
      year: '',
      month: '',
      readingList : [],
      //전체, 독서완료,독서중 상태
      readingState:'A',
      selectedReadingOrder:'R',
      tooltipOpen: false,
      //월별 독서량
      totalReading:0,
      //데이터 총 검색 결과
      totalDataCount:null,
      isNextMonth: false,
      isPrevMonth: false,
      pageSize:10,
      //초기 페이지인덱스값
      pageIndex:1,
      addCount:1,
      //더보기 버튼 활성화
      isMoreButton: false,
      //v-select options
      readingOrderItem:[
        {
          cdVl: 'R',
          cdVlNm: '최근 읽은 순',
        },
        {
          cdVl: 'M',
          cdVlNm: '많이 읽은 순',
        },
        {
          cdVl: 'F',
          cdVlNm: '적게 읽은 순',
        },
      ],
    }
  },
  computed: {
    ...mapGetters('readingStatusStorage', ['getDate']),
    ...mapGetters(['userInfo']),
  },
  watch: {
    'getDate'(newValue, oldValue) {
      if (newValue !== oldValue && oldValue) {
        this.readingState = 'A';
        this.selectedReadingOrder ='R';
        this.resetPageData();
        this.getReadingList();
      }
    },
    'readingState'(newValue, oldValue) {
      if (newValue !== oldValue && oldValue) {
        this.resetPageData();
        this.getReadingList();
      }
    },
    'selectedReadingOrder'(newValue, oldValue) {
      if (newValue !== oldValue && oldValue) {
        this.resetPageData();
        this.getReadingList();
      }
    }
  },
  created() {
    this.setCalendarDate();
  },
  mounted() {
    this.getReadingList();
    this.hideKeyboard();
    this.checkMonth();
    window.addEventListener('click', this.onClick);
  },
  methods: {
    ...mapMutations('readingStatusStorage', [
      'updateDate'
    ]),
    resetPageData() {
      this.pageIndex = 1;
      this.isMoreButton = false;
      this.readingList = [];
      this.addCount = 1;
      this.totalDataCount = null;
    },
    setCalendarDate() {
      this.year = moment(this.getDate).format('YYYY')
      this.month =  moment(this.getDate).format('MM')
    },
    getReadingList(more) {
      const params = {
        studentId: this.userInfo.info.studentId,
        searchYear: this.year,
        searchMonth: this.month,
        stateRead: this.readingState,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        orderType:this.selectedReadingOrder
      }

      const readingList = readingListApi.getReadingList(params);
      readingList.then((res)=>{
        //처음 실행시에만 총 독서수와 총 아이템개수를 가져온다
        if(this.pageIndex === 1){
          this.totalReading = res.data.data.readSum;
          this.totalDataCount = res.data.data.totalCount;
          this.checkMoreButton()
        }
        //처음 실행시
        if(!more){
          return this.readingList = res.data.data.items;
        }
        //더보기 버튼 눌렀을 경우
        if(more){
          return Array.prototype.push.apply(this.readingList,res.data.data.items)
        }
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
    prevMonth() {
      if(this.isPrevMonth === false){
      const thisDate = moment(this.getDate).subtract('1', 'M').locale('ko').format('YYYY-MM-DD');

      this.year = moment(thisDate).format('YYYY');
      this.month = moment(thisDate).format('MM');

      this.updateDate(thisDate);
      this.checkMonth();
      }
    },
    nextMonth() {
      if(this.isNextMonth === false){
        const thisDate = moment(this.getDate).add('1', 'M').locale('ko').format('YYYY-MM-DD');

        this.year = moment(thisDate).format('YYYY');
        this.month = moment(thisDate).format('MM');

        this.updateDate(thisDate);
        this.checkMonth();
      }
    },
    //달 체크하기
    checkMonth() {
      const date = new Date();
      let currentYear = date.getFullYear();
      let currentMonth = date.getMonth() + 1;

      let diff = (currentMonth - this.month) + (12 * (currentYear - this.year));
      //TODO: 현재달까지만 막아두었음 추후 다음달까지로 변경
      if (diff <= 0) {
        this.isNextMonth = true
      } else {
        this.isNextMonth = false
      }
      //이전 버튼은 학습일 시작 달까지만 확인 가능
      if((this.year === (moment(this.userInfo.info.learnStartDt).subtract(1,'month').format("YYYY"))) && (this.month === moment(this.userInfo.info.learnStartDt).subtract(1,'month').format("MM")) ){
        this.isPrevMonth = true
      }else {
        this.isPrevMonth = false
      }
    },
    //더보기 버튼
    handleMore() {
      this.addCount++
      //불러 와야하는 총 페이지 개수
      const totalIndex = Math.ceil(this.totalDataCount / this.pageSize);

      if(this.addCount <= totalIndex){
        this.pageIndex++
        this.getReadingList('more');
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
      },100)
    },
    hideKeyboard() {
      const input = document.querySelector('.vs__selected-options .vs__search');
      input.setAttribute('inputmode','none');
      input.setAttribute('readonly','readonly');
    },
  },
}
</script>
