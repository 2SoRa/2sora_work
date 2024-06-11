<template>
  <!-- 마이슈퍼북 : 주간리포트 -->
  <div class="period-top">
    <div class="btn-calendar type-trans-purple size-wide">
      <!-- TODO : 이전 달 or 다음 달 없을 경우 button 상태 disabled -->
      <button type="button" class="btn-prev" @click="prevDate()" :disabled="!isPrev()">이전 달</button>
      <p class="txt-month">{{ setDate }}</p>
      <div class="info-period"><span>{{ firstDay }}</span> ~ <span>{{ lastDay }}</span></div>
      <button type="button" class="btn-next" @click="nextDate()" :disabled="!isNext()">다음 달</button>
    </div>
  </div>
  <div class="content-scroll-area" v-if="weekData">
    <!-- 출석 현황 -->
    <div class="sec-analysis">
      <h2 class="sec-title">출석 현황</h2>
      <ul class="col-list col-7 attend-list">
        <li v-for="item in weekList" :key="item">
          <p>
            {{ item.name }}
          </p>
          <i class="ico ico-attend-default"
             :class="{ 'ico-attend-active' : weekData.attendanceStatus[item.column] === 'Y' }"></i>
        </li>
      </ul>
    </div>
    <!-- 한글 영역 분석 -->
    <div class="sec-analysis col-2">
      <div class="side-area left">
        <h2 class="sec-title">한글 영역 분석</h2>
        <ul class="dot-list">
          <li>이번 주에 읽은 한글책의 주영역 목표와 달성률입니다.</li>
          <li>한 주 동안 읽은 책을 기준으로 합니다.<br>
            (여러 번 완독 시 한 번만 집계)
          </li>
          <li><i class="ico ico-vbook-on"></i>표시는 V스캔 책을 포함하여 읽은 경우 제공합니다.</li>
        </ul>
      </div>
      <div class="side-area right">
        <ul class="col-list doughnut-chart-list col-3">
          <li v-for="(item, index) in chartDataKind" :key="item" :class="{ 'has-bg' : index === 0}">
            <div class="flag-round chart-title">{{ item.title }}</div>
            <div class="chart-wrap"
                 :class="{ 'sta-per-100' : (item.value === ((index === 0) ? 10 : 2)) && item.vscan === 'Y' }">
              <p class="txt-chart-per">
                {{ (item.value / ((index === 0) ? 10 : 2)) * 100 }}%
              </p>
              <Doughnut :data="{
                datasets: [
                  {
                    backgroundColor: [item.color, '#e5e5e5'],
                    borderWidth: 0,
                    data : item.data,
                    cutout: '70%'
                  }
                ]}" />
            </div>
            <div class="txt-chart-info">
              <em class="current">{{ item.value }}권</em>
              <p>/ 목표 <span>{{ index === 0 ? 10 : 2 }}권</span></p>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!-- 활동 분석 -->
    <div class="sec-analysis col-3">
      <div class="side-area left">
        <h2 class="sec-title">읽은 책 분석</h2>
        <ul class="dot-list">
          <li>이번 주 읽은 책의 통계입니다.</li>
        </ul>
        <ul class="indent-list">
          <li>도서 : 처음 완독한 도서 종(권)의 합</li>
          <li>완독 : 여러 번 완독한 횟수의 합</li>
<!--          <li>* Oxford Readers 책은 추후 반영 예정입니다.</li>-->
        </ul>
      </div>
      <!-- 읽은 책 분석 -->
      <div class="side-area center">
        <div class="result-list-wrap amount-reading">
          <div class="result-top">
            <h3>전체 독서량</h3>
            <!-- TODO : 학습 현황 > 독서 활동의 해당 월 리스트를 조회함 -->
            <button type="button" class="btn-aqua">
              <router-link :to="{name:'readingStatusActiveCalendar' , query:{ date:queryFirstDay, path:'weekly' }}">독서 활동 보기</router-link>
            </button>
          </div>
          <ul class="col-list col-2 reading-info">
            <!-- TODO : 읽은 도서 권, 회수 노출 -->
            <li><i class="ico ico-book"></i>도서 <span class="type-blue">{{ weekData.bookAnalysis.bookReadingCn }}권</span>
            </li>
            <li><i class="ico ico-book-comp"></i>완독 <span>{{ weekData.bookAnalysis.bookReadingCompleteCn }}회</span></li>
          </ul>
          <ul class="col-list col-2 book-info">
            <li>
              <em>온라인 책</em>
              <!-- TODO : V스캔 제외한 최초 완독한 도서 수량 노출 (한글, 영어 각각 집계) -->
              <p>한글<span class="type-green">{{ weekData.bookAnalysis.korBookCn }}권</span></p>
              <p>영어<span class="type-purple">{{ weekData.bookAnalysis.engBookCn }}권</span></p>
            </li>
            <li>
              <em><i class="ico ico-vbook-on"></i>V스캔 책</em>
              <!-- TODO : V스캔 책 최초 완독한 도서 수량 노출 (한글, 영어 각각 집계) -->
              <p>한글<span class="type-green">{{ weekData.bookAnalysis.korScanBookCn }}권</span></p>
              <p>영어<span class="type-purple">{{ weekData.bookAnalysis.engScanBookCn }}권</span></p>
            </li>
          </ul>
        </div>
      </div>
      <div class="side-area right">
        <div class="thumb-wrap has-float-flag">
          <p class="flag-round">가장 많이 읽은 책</p>
          <!-- TODO : 금주 가장 많이 읽은 책 썸네일 및 회차 노출, 없을 경우 디폴트 이미지(카피) 노출 -->
          <div v-if="weekData.bookAnalysis.mostReadBookCn > 0">
            <div class="shadow-wrap">
              <img :src="weekData.bookAnalysis.mostReadBook">
            </div>
            <span class="flag-number">{{ weekData.bookAnalysis.mostReadBookCn }}회</span>
          </div>
          <div v-else class="shadow-wrap no-data">
            <span>여러 번 읽은<br>책이 없어요.</span>
          </div>
        </div>
      </div>
    </div>
    <div class="sec-analysis col-3">
      <div class="side-area left">
        <h2 class="sec-title">활동 분석</h2>
        <ul class="dot-list">
          <li>독서 활동 통계입니다.</li>
        </ul>
        <ul class="indent-list">
          <li>독서 모드 : 도서 감상 시 사용한 학습 모드 비율</li>
          <li>독서 시간 : 완독한 모션북, 이북의 독서 시간의 합</li>
        </ul>
      </div>
      <div class="side-area center">
        <div class="result-list-wrap type-gray reading-mode">
          <div class="result-top">
            <h3>독서 모드</h3>
          </div>
          <ul class="col-list col-2 reading-mode-info">
            <li>
              <ul class="row-list row-3 mode-per-info">
                <!-- TODO : 독서 모드 별 활동 퍼센티지 노출 -->
                <li>모션북 <span class="txt-per">{{ weekData.activityAnalysis.mbookRate }}%</span></li>
                <li>이북 <span class="txt-per">{{ weekData.activityAnalysis.ebookRate }}%</span></li>
<!--                <li>오디오북 <span class="txt-per">{{ weekData.activityAnalysis.soundBookRate }}%</span></li>-->
              </ul>
            </li>
            <li>
              <!-- TODO : 데이터 있을 경우 노출 -->
              <div class="shadow-wrap type-circle"
                   v-if="weekData.activityAnalysis.mbookRate > 0 || weekData.activityAnalysis.ebookRate > 0 || weekData.activityAnalysis.soundBookRate > 0">
                <Pie :data="{
                   datasets: [
                    // {
                    //   backgroundColor: ['#319ae4', '#fd5879', '#fec014'],
                    //   borderWidth:0,
                    //   data: [weekData.activityAnalysis.mbookRate,weekData.activityAnalysis.ebookRate,weekData.activityAnalysis.soundBookRate],
                    // }
                    {
                      backgroundColor: ['#319ae4', '#fd5879'],
                      borderWidth:0,
                      data: [weekData.activityAnalysis.mbookRate,weekData.activityAnalysis.ebookRate],
                    }
                  ]
                }" :options="chartOption"/>
              </div>
              <div v-else class="shadow-wrap no-data type-circle">
                <span>읽은 책이 없어요.</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="side-area right">
        <div class="result-list-wrap reading-time">
          <div class="result-top">
            <h3>독서 시간</h3>
          </div>
          <div class="thumb-wrap shadow-wrap">
            <img src="@/assets/img/launcher-readingclub/my-superbook/img_book_clock.webp">
            <!-- TODO : 독서 시간 노출, 독서 시간 없을 경우 0분 노출 -->
            <span class="flag-number">{{ timer }} </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import {mapGetters} from "vuex";
import readingClubFactory from "@/api/reading-club/readingClub-factory";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  Filler,
  LinearScale, LineElement, ArcElement, PointElement, RadialLinearScale
} from 'chart.js'
import {Pie, Doughnut} from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, BarElement, RadialLinearScale, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler)
ChartJS.defaults.plugins.legend.display = false;

const superBookApi = readingClubFactory.get('mySuperBook')
export default {
  data() {
    return {
      studentId: null,
      timer: null,
      weekList: [
        {
          name: '월요일',
          column: "moSticker"
        },
        {
          name: '화요일',
          column: "tuSticker"
        },
        {
          name: '수요일',
          column: "weSticker"
        },
        {
          name: '목요일',
          column: "thmSticker"
        },
        {
          name: '금요일',
          column: "fiSticker"
        },
        {
          name: '토요일',
          column: "saSticker"
        },
        {
          name: '일요일',
          column: "suSticker"
        }
      ],
      weekData: null,
      chartDataKind: [
        {
          // weekData.koreaAreaAnalysis.totalArea
          name: 'totalArea',
          title: '전체 독서',
          color: '#464646',
          data: null,
          value: null,
          vscan: null
        },
        {
          name: 'languageArea',
          title: '언어 발달',
          color: '#ffc014',
          data: null,
          value: null,
          vscan: 'languageAreaV'
        },
        {
          name: 'sentimentsArea',
          title: '정서 발달',
          color: '#90be2d',
          data: null,
          value: null,
          vscan: 'sentimentsAreaV'
        },
        {
          name: 'socialityArea',
          title: '사회성 발달',
          color: '#1f8dff',
          data: null,
          value: null,
          vscan: 'socialityAreaV'
        },
        {
          name: 'recognizeArea',
          title: '인지 발달',
          color: '#fc5f83',
          data: null,
          value: null,
          vscan: 'recognizeAreaV'
        },
        {
          name: 'creativityArea',
          title: '창의사고력',
          color: '#7a4ec7',
          data: null,
          value: null,
          vscan: 'creativityAreaV'
        }
      ],
      chartOption: {
        plugins: {
          legend: {
            display: false,
            position: "bottom",
            align: "center"
          },
        }
      },
      thisDate: '',
      setDate : '',
      firstDay: '',
      lastDay: ''
    }
  },
  components: {
    Pie,
    Doughnut
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  watch: {
    'thisDate'() {
      this.getSuperBookData();
    },
  },
  created() {
    this.studentId = this.userInfo.info.studentId;
  },
  mounted() {
    this.thisDate = new Date();
    this.setCurrentDate();
  },
  methods: {
    setChartData() {
      this.chartDataKind.forEach((item, index) => {
        const unit = (index === 0) ? 10 : 2;
        item.value = this.weekData.koreaAreaAnalysis[item.name];
        item.vscan = this.weekData.koreaAreaAnalysis[item.vscan] ? this.weekData.koreaAreaAnalysis[item.vscan] : null;
        item.data = [
          (this.weekData.koreaAreaAnalysis[item.name] / unit) * 100,
          100 - ((this.weekData.koreaAreaAnalysis[item.name] / unit) * 100)
        ];
      });
    },
    setCurrentDate() {
      this.queryFirstDay = moment(this.thisDate).isoWeekday(1).format("YYYY-MM-DD");
      this.queryEndDay = moment(this.thisDate).isoWeekday(7).format("YYYY-MM-DD");
      this.firstDay = moment(this.thisDate).isoWeekday(1).format("MM월 DD일");
      this.lastDay = moment(this.thisDate).isoWeekday(7).format("MM월 DD일");
      this.getWeek(this.thisDate);
      this.isNext();
      this.isPrev();
    },
    getSuperBookData() {
      const params = {
        "student_id": this.studentId,
        "search_sdate": this.queryFirstDay,
        "search_edate": this.queryEndDay
      }
      const superBookData = superBookApi.getSuperBookWeek(params);
      superBookData.then((res) => {
        if (res.status === 200) {
          this.weekData = res.data.data;
          if (this.weekData.activityAnalysis.bookReadingTime !== '0') {
            const timer = this.weekData.activityAnalysis.bookReadingTime.split(':');
            if (timer[0] === '00') {
              this.timer = timer[1] + '분';
            } else {
              this.timer =  timer[0].replace(/(^0+)/, "") + '시간 ' + timer[1].replace(/(^0+)/, "") + '분';
            }
          } else this.timer = '0 시간'
          this.setChartData();
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    getWeekLength(date) {
      var d = new Date(date), month = d.getMonth(), count = 0;
      d.setDate(1);
      while (d.getDay() !== 1) {
        d.setDate(d.getDate() + 1);
      }
      while (d.getMonth() === month) {
        count++;
        d.setDate(d.getDate() + 7);
      }
      return count;
    },
    getWeek(date) {
      const weekMonth = date.getWeekOfMonth();
      if (weekMonth === 0) {
        const lastMonth = moment(date).subtract('1','month').format('YYYY-MM-DD');
        if (date.getMonth() === 0) {
          this.setDate = date.getFullYear() + '년 ' + (date.getMonth() + 1) + '월 ' + (weekMonth + 1) + '주차';
        } else {
          this.setDate = date.getFullYear() + '년 ' + date.getMonth() + '월 ' + this.getWeekLength(lastMonth) + '주차';
        }
      } else {
        if (date.getMonth() === 0) {
          this.setDate = date.getFullYear() + '년 ' + (date.getMonth() + 1) + '월 ' + (weekMonth + 1) + '주차';
        } else {
          this.setDate = date.getFullYear() + '년 ' + (date.getMonth() + 1) + '월 ' + weekMonth + '주차';
        }
      }
    },
    isPrev() {
      return '2023-10-09' !== moment(this.queryFirstDay).format('YYYY-MM-DD');
    },
    isNext() {
      return  moment(this.thisDate).add('1', 'week').isoWeekday(1).format("YYYY-MM-DD") <= moment().format('YYYY-MM-DD')
    },
    nextDate() {
      this.thisDate = new Date(moment(this.thisDate).add('1', 'week').format('YYYY-MM-DD'));
      this.setCurrentDate();
    },
    prevDate() {
      this.thisDate = new Date(moment(this.thisDate).subtract('1', 'week').format('YYYY-MM-DD'));
      this.setCurrentDate();
    },
    replaceDefault(e) {
      e.target.src = require('@/assets/img/launcher-readingclub/common/thumbnail_default.png')
    },
  }
}
// 몇주차까지 있는지 받기
Date.prototype.getWeekOfMonth = function() {
  var firstWeekday = new Date(this.getFullYear(), this.getMonth(), 1).getDay() - 1;
  if (firstWeekday < 0) firstWeekday = 6;
  var offsetDate = this.getDate() + firstWeekday - 1;
  return Math.floor(offsetDate / 7);
}
</script>