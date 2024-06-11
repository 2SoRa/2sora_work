<template>
  <div class="monthly">
    <!-- 마이슈퍼북 : 월간리포트 -->
    <div class="period-top">
      <div class="btn-calendar type-trans-purple size-wide">
        <!-- TODO: 추후 데이터 추가 필요 임시 하드코딩 -->
        <!-- TODO : 이전 달 or 다음 달 없을 경우 button 상태 disabled -->
        <button type="button" class="btn-prev" @click="prevDate()" :disabled="!isPrev()">이전 달</button>
        <p class="txt-month">{{ currentMonth }}</p>
        <div class="info-period"><span>{{ currentMonthAll }}</span></div>
        <button type="button" class="btn-next" @click="nextDate()" :disabled="!isNext()">다음 달</button>
      </div>
    </div>
    <div class="content-scroll-area monthly">
      <div class="no-data" v-if="!isReport || queryMonth === '202309' ">
        월간 리포트는 매월 1일에 제공됩니다.<br>
        5권 이상 완독 시에만 월간 리포트를 제공합니다.
        <img src="@/assets/img/launcher-readingclub/common/img_nodata.webp">
      </div>
      <!-- 11월 1일 오픈 예정으로 추가될 월간 레포트 -->
      <div v-else>
        <!-- 출석 현황 -->
        <div class="sec-analysis col-2" v-if="chartDatas">
          <div class="side-area left">
            <h2 class="sec-title">출석 현황</h2>
            <ul class="dot-list">
              <li>이번 달의 출석 통계입니다.<br>(주말, 공휴일 포함)</li>
            </ul>
          </div>
          <div class="side-area right">
            <ul class="col-list col-3 attend-count">
              <li>
                <i class="ico ico-attend-report"></i>
              </li>
              <li>
                <p>출석일</p>
                <span class="type-blue">
              {{ chartDatas.attendanceStatus.attendCn }}일
            </span>
              </li>
              <li>
                <p>출석률</p>
                <span class="type-purple">
              {{ chartDatas.attendanceStatus.attendRate }}%
            </span>
              </li>
            </ul>
          </div>
        </div>
        <!-- 한글영역 분석 -->
        <div class="sec-analysis col-2 analysis-kor" v-if="chartDatas">
          <div class="side-area left">
            <h2 class="sec-title">한글 영역 분석</h2>
            <ul class="dot-list">
              <li>이번 달에 읽은 한글책의 주영역 목표와<br>
                달성률입니다.<br>
                (영역별 10점, 총 50점 목표)
              </li>
              <li>한 달 동안 읽은 책을 기준으로 하여<br>주간 리포트와 차이가 있을 수 있습니다.<br>
                (여러 번 완독 시 한 번만 집계)
              </li>
              <li><i class="ico ico-vbook-on"></i>표시는 V스캔 책을 포함하여 읽은<br>경우 제공합니다.</li>
            </ul>
          </div>
          <div class="side-area right">
            <div class="radar-chart-wrap">
              <ul class="row-list row-2 color-list">
                <li class="type-green">지난달</li>
                <li class="type-purple">이번 달</li>
              </ul>
              <div class="radar-chart">
                <Radar :data="chartData.chartDataRadar.data" :options="chartData.chartCommonOption"/>
                <!-- TODO: 레이더차트 라벨 영역 -->
                <ul class="radar-label-wrap">
                  <li v-for="item in chartData.chartDataRadar.chartRadarLabels" :key="item">
                    <i class="ico ico-vbook-off"
                       :class="{ 'ico-vbook-on' : chartDatas.koreaAreaAnalysis[item.eng] === 'Y' }"></i>
                    <p class="chart-title">{{ item.kor }}</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <!-- 한글 관심 주제 -->
        <div class="sec-analysis col-2" v-if="chartDatas">
          <div class="side-area left">
            <h2 class="sec-title">한글 관심 주제</h2>
            <ul class="dot-list">
              <li>많이 읽은 한글책의 키워드입니다.</li>
            </ul>
          </div>
          <div class="side-area right">
            <ul class="interest-subject">
              <li v-for="item in chartDatas.koreaAreaAnalysis.interestKorKeyword" :key="item">
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
        <!-- 읽은 책 분석 -->
        <div class="sec-analysis col-3" v-if="chartDatas">
          <div class="side-area left">
            <h2 class="sec-title">읽은 책 분석</h2>
            <ul class="dot-list">
              <li>이번 달 읽은 책의 통계입니다.</li>
            </ul>
            <ul class="indent-list size-half">
              <li>도서 : 이번 달에 완독한 도서 종(권)의 합<br>
                (여러 번 완독 시 한 번만 집계)
              </li>
              <li>완독 : 여러 번 완독한 횟수의 합</li>
<!--              <li>* Oxford Readers 책은 추후 반영 예정입니다.</li>-->
            </ul>
          </div>
          <div class="side-area center">
            <div class="result-list-wrap amount-reading">
              <div class="result-top">
                <h3>전체 독서량</h3>
                <!-- TODO : 학습 현황 > 독서 활동의 해당 월 리스트를 조회함 -->
                <button type="button" class="btn-aqua">
                  <router-link :to="{ name: 'readingStatusActiveCalendar' , query:{date:queryMonth , path:'monthly'}}">독서 활동 보기</router-link>
                </button>
              </div>
              <ul class="col-list col-2 reading-info">
                <li><i class="ico ico-book"></i>도서 <span class="type-blue">{{
                    chartDatas.bookAnalysis.bookReadingCn
                  }}권</span>
                </li>
                <li><i class="ico ico-book-comp"></i>완독 <span>{{
                    chartDatas.bookAnalysis.bookReadingCompleteCn
                  }}회</span></li>
              </ul>
              <ul class="col-list col-2 book-info">
                <li>
                  <em>온라인 책</em>
                  <p>한글<span class="type-green">{{ chartDatas.bookAnalysis.korBookCn }}권</span></p>
                  <p>영어<span class="type-purple">{{ chartDatas.bookAnalysis.engBookCn }}권</span></p>
                </li>
                <li>
                  <em><i class="ico ico-vbook-on"></i>V스캔 책</em>
                  <p>한글<span class="type-green">{{ chartDatas.bookAnalysis.korScanBookCn }}권</span></p>
                  <p>영어<span class="type-purple">{{ chartDatas.bookAnalysis.engScanBookCn }}권</span></p>
                </li>
              </ul>
              <template
                v-if="chartDatas.bookAnalysis.bookReadingCn === 0 && chartDatas.bookAnalysis.preBookReadingCn === 0">
                <p class="comparison">읽은 책이 없어요.</p>
              </template>
              <template v-if="chartDatas.bookAnalysis.bookReadingCn > chartDatas.bookAnalysis.preBookReadingCn">
                <p class="comparison">지난달보다
                  <span>{{ chartDatas.bookAnalysis.bookReadingCn - chartDatas.bookAnalysis.preBookReadingCn }}권 더</span>
                  읽었어요.</p>
              </template>
              <template v-if="chartDatas.bookAnalysis.bookReadingCn < chartDatas.bookAnalysis.preBookReadingCn">
                <p class="comparison">지난달보다
                  <span>{{ chartDatas.bookAnalysis.preBookReadingCn - chartDatas.bookAnalysis.bookReadingCn }}권 덜</span>
                  읽었어요.</p>
              </template>
              <template
                v-if="(chartDatas.bookAnalysis.bookReadingCn !== 0 && chartDatas.bookAnalysis.preBookReadingCn !== 0) && (chartDatas.bookAnalysis.bookReadingCn === chartDatas.bookAnalysis.preBookReadingCn)">
                <p class="comparison">지난달만큼 읽었어요.</p>
              </template>
            </div>
          </div>
          <div class="side-area right">
            <div class="thumb-wrap has-float-flag">
              <p class="flag-round">가장 많이 읽은 책</p>
              <!-- TODO : 금주 가장 많이 읽은 책 썸네일 및 회차 노출, 없을 경우 디폴트 이미지(카피) 노출 -->
              <div v-if="chartDatas.bookAnalysis.mostReadBook">
                <div class="shadow-wrap">
                  <img :src="chartDatas.bookAnalysis.mostReadBook" @error="replaceDefault">
                </div>
                <span class="flag-number">{{ chartDatas.bookAnalysis.mostReadBookCn }}회</span>
              </div>
              <div v-else class="shadow-wrap no-data">
                <span>여러 번 읽은<br>책이 없어요.</span>
              </div>
            </div>
          </div>
        </div>
        <!-- 활동 분석 -->
        <div class="sec-analysis col-3" v-if="chartDatas">
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
                    <li>모션북 <span class="txt-per">{{ chartDatas.activityAnalysis.mbookRate }}%</span></li>
                    <li>이북 <span class="txt-per">{{ chartDatas.activityAnalysis.ebookRate }}%</span></li>
                  </ul>
                </li>
                <li>
                  <!-- TODO : 데이터 있을 경우 노출 -->
                  <div class="shadow-wrap type-circle" v-if="chartDatas.activityAnalysis.mbookRate > 0 || chartDatas.activityAnalysis.ebookRate > 0">
                    <Pie :data="{
                      datasets: [{
                        backgroundColor: ['#319ae4', '#fd5879'],
                        borderWidth:0,
                        data: [chartDatas.activityAnalysis.mbookRate, chartDatas.activityAnalysis.ebookRate],
                      }]
                    }"/>
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
                <ul class="col-list col-2">
                  <!-- TODO: 이번 달 독서시간 & 지난달 독서시간 표시 기능 추가 필요 -->
                  <li class="type-purple">
                    <em>이번 달</em>
                    <span>
                      {{ setTimer(chartDatas.activityAnalysis.bookReadingTime) }}
                    </span>
                  </li>
                  <li class="type-green">
                    <em>지난달</em>
                    <span>
                      {{ setTimer(chartDatas.activityAnalysis.preBookReadingTime) }}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <!-- 영어 레벨 분석 -->
        <div class="sec-analysis col-2" v-if="chartDatas">
          <div class="side-area left">
            <h2 class="sec-title">영어 레벨 분석</h2>
            <ul class="dot-list">
              <li>이번 달 읽은 영어책의 AR지수를<br/>
                기반으로 한 그래프와 분석 결과입니다.<br>
                (여러 번 완독 시 한 번만 집계)
              </li>
            </ul>
            <ul class="indent-list size-half">
<!--              <li>* Oxford Readers 책은 추후 반영 예정입니다.</li>-->
            </ul>
          </div>
          <div class="side-area right">
            <div class="bar-chart-wrap">
              <div class="level-div">
                <div class="tab">
                  <!-- TODO: click에 따라 active 클래스 추가 필요  >> 그에따라 데이터 값 바뀌어야함.           -->
                  <button type="button" :class="{ active : engLevel === 'b' }" @click="toggleEngLevel('b')">Basic</button>
                  <button type="button" :class="{ active : engLevel === 'i' }" @click="toggleEngLevel('i')">Intermediate</button>
                  <button type="button" :class="{ active : engLevel === 'a' }" @click="toggleEngLevel('a')">Advanced</button>
                </div>
                <ul class="col-list col-2 color-list">
                  <li class="type-green">지난달</li>
                  <li class="type-purple">이번 달</li>
                </ul>
              </div>
              <Bar ref="barChart" :data="chartData.chartDataBar.data" :options="chartData.chartBarOption"/>
            </div>
            <div class="result-list-wrap analysis-level">
              <div class="result-top">
                <h3>레벨 분석 결과</h3>
              </div>
              <ul class="col-list col-2">
                <li v-if="chartDatas.englishLevelAnalysis.bookReportReview">
                  <div v-html="chartDatas.englishLevelAnalysis.bookReportReview"></div>
                </li>
                <li v-else class="no-data">
                  <p>분석할 데이터가 없습니다.</p>
                </li>
                <li>
                  <p class="flag-round">노출 단어 수</p>
                  <span>{{ chartDatas.englishLevelAnalysis.exposeWordCn }}개</span>
                  <template v-if="chartDatas.englishLevelAnalysis.exposeWordCn > chartDatas.englishLevelAnalysis.preExposeWordCn">
                    <p>지난달보다
                      <span>{{ chartDatas.englishLevelAnalysis.exposeWordCn - chartDatas.englishLevelAnalysis.preExposeWordCn }}개 증가</span>
                    </p>
                  </template>
                  <template v-if="chartDatas.englishLevelAnalysis.exposeWordCn < chartDatas.englishLevelAnalysis.preExposeWordCn">
                    <p>지난달보다
                      <span>{{ chartDatas.englishLevelAnalysis.preExposeWordCn - chartDatas.englishLevelAnalysis.exposeWordCn }}개 감소</span>
                    </p>
                  </template>
                  <template v-if="chartDatas.englishLevelAnalysis.exposeWordCn === chartDatas.englishLevelAnalysis.preExposeWordCn">
                    <p>지난달과 동일</p>
                  </template>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <!-- 영어 관심 주제 -->
        <div class="sec-analysis col-2" v-if="chartDatas">
          <div class="side-area left">
            <h2 class="sec-title">영어 관심 주제</h2>
            <ul class="dot-list">
              <li>많이 읽은 영어책의 키워드입니다.</li>
            </ul>
          </div>
          <div class="side-area right">
            <ul class="interest-subject">
              <li v-for="item in chartDatas.englishLevelAnalysis.interestEngKeyword" :key="item">
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
        <!-- 월간 총평 -->
        <div class="sec-analysis col-2" v-if="chartDatas && chartDatas.etcMap.ageGroupAdvice">
          <div class="side-area left">
            <h2 class="sec-title">월간 총평</h2>
            <ul class="dot-list">
              <li>한글책을 기준으로 분석한 총평입니다.</li>
            </ul>
          </div>
          <div class="side-area right">
            <div class="total-comment">
              <div v-html="chartDatas.etcMap.ageGroupAdvice"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment/moment";
import {mapGetters} from "vuex";
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
import {Bar, Pie, Radar} from 'vue-chartjs'
import readingClubFactory from "@/api/reading-club/readingClub-factory";

ChartJS.register(CategoryScale, LinearScale, BarElement, RadialLinearScale, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler)

const superBookApi = readingClubFactory.get('mySuperBook')
export default {
  components: {Pie, Radar, Bar},
  data() {
    return {
      isReport : false,
      chartDatas: null,
      chartData: {
        chartDataRadar: {
          chartRadarLabels: [
            {
              eng: 'languageAreaV',
              kor: '언어 발달'
            },
            {
              eng: 'recognizeAreaV',
              kor: '인지 발달'
            },
            {
              eng: 'socialityAreaV',
              kor: '사회성 발달'
            },
            {
              eng: 'sentimentsAreaV',
              kor: '정서 발달'
            },
            {
              eng: 'creativityAreaV',
              kor: '창의사고력'
            }
          ],
          data: {
            backgroundColor: ' #FFFFFF',
            labels: ['언어 발달', '인지 발달', '사회성 발달', '정서 발달', '창의사고력'],
            datasets: [
              {
                label: '지난달',
                backgroundColor: 'transparent',
                borderColor: '#00d3a2',
                pointBackgroundColor: '#00d3a2',
                pointBorderColor: '#00d3a2',
                pointBorderWidth: 3,
                order: 2,
              },
              {
                label: '이번달',
                // TODO: 5개 항목 모두 만점일때만 배경컬러 넣어줘야함.
                // backgroundColor: 'rgba(188, 29, 218, 0.2)',
                backgroundColor: 'transparent',
                borderColor: '#bc1dd9',
                pointBackgroundColor: '#bc1dd9',
                pointBorderColor: '#bc1dd9',
                pointBorderWidth: 3,
                order: 1,
              }
            ],
          },
        },
        chartDataBar: {
          data: {
            labels : ['0.1 ~ 0.5', '0.6 ~ 1.0', '1.1 ~ 1.8'],
            datasets: [
              {
                // label : '지난달',
                backgroundColor: '#00d3a2',
                borderColor: 'transparent',
                categoryPercentage: 0.7,
              },
              {
                // label : '이번달',
                backgroundColor: '#bc1dd9',
                borderColor: 'transparent',
                categoryPercentage: 0.7,
              },
            ]
          },
        },
        // Bar Chart Option
        chartBarOption: {
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              yAlign: 'bottom',
              displayColors: false,
              bodyFont: {size: 18},
              callbacks: {
                title: () => '',
              }
            }
          },
          scales: {
            x: {
              grid: {
                display: false,
                offset: true,
              },
              title: {
                display: true,
                position: 'right',
                align: 'end',
                backdropPadding: -30,
                color: '#656565',
                font: {size: 24},
                text: 'AR지수'
              },
              ticks: {
                font: {size: 24},
                color: '#292929',
              }
            },
            y: {
              min: 0,
              // max:10,
              border: {display: false},
              grid: {
                color: '#E5E5E5',
                borderWidth: 2
              },
              title: {
                display: true,
                position: 'left',
                align: 'end',
                color: '#656565',
                font: {size: 24},
                text: '독서량'
              },
              ticks: {
                font: {size: 24},
                color: '#292929',
                beginAtZero: true,
                stepSize: 10,
              }
            },
          }
        },
        // Radar Chart Option
        chartCommonOption: {
          chartArea: {
            backgroundColor: '#FFFFFF',
          },
          plugins: {
            legend: {display: false,},
          },
          spanGaps: true,
          scales: {
            r: {
              backgroundColor: '#FFFFFF',
              beginAtZero: true,
              max: 10,
              min: 0,
              ticks: {
                stepSize: 2,
                display: true,
                backdropColor: 'rgba(0,0,0,0)',
              },
              pointLabels: {display: false},
            }
          }
        }
      },
      engLevel: 'b',
      currentMonth : '',
      queryMonth : '',
      currentMonthAll : ''
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  created() {
    this.studentId = this.userInfo.info.studentId;
    this.queryMonth = new Date();
  },
  mounted() {
    this.setDate();
  },
  methods: {
    setDate() {
      this.chartDatas = null;
      this.currentMonth = moment(this.queryMonth).subtract('1','month').format('YYYY년 MM월');
      this.queryMonth = moment(this.queryMonth).subtract('1','month').format('YYYYMM');
      this.currentMonthAll  = moment(this.queryMonth).format('M월 1일') + ' ~ ' + moment(this.queryMonth).format('M월 ') + moment(this.queryMonth).daysInMonth() + '일';
      this.getSuperBookData();
    },
    setChartData() {
      this.setRadarData();
      this.setBarData();
      // 한글 키워드 뽑기
      if (typeof this.chartDatas.koreaAreaAnalysis.interestKorKeyword === 'string') {
        this.chartDatas.koreaAreaAnalysis.interestKorKeyword = this.dividerKeyword(this.chartDatas.koreaAreaAnalysis.interestKorKeyword);
      }
      // 영어 키워드 뽑기
      if (typeof this.chartDatas.englishLevelAnalysis.interestEngKeyword === 'string') {
        this.chartDatas.englishLevelAnalysis.interestEngKeyword = this.dividerKeyword(this.chartDatas.englishLevelAnalysis.interestEngKeyword);
      }
    },
    setRadarData() {
      // 한글 영역 분석 Radar 차트
      this.chartData.chartDataRadar.data.datasets[0].data = [
        this.chartDatas.koreaAreaAnalysis.preLanguageArea === 0 ? null : this.chartDatas.koreaAreaAnalysis.preLanguageArea,
        this.chartDatas.koreaAreaAnalysis.preRecognizeAreaScore === 0 ? null : this.chartDatas.koreaAreaAnalysis.preRecognizeAreaScore,
        this.chartDatas.koreaAreaAnalysis.preSocialityAreaScore === 0 ? null : this.chartDatas.koreaAreaAnalysis.preSocialityAreaScore,
        this.chartDatas.koreaAreaAnalysis.preSentimentsAreaScore === 0 ? null : this.chartDatas.koreaAreaAnalysis.preSentimentsAreaScore,
        this.chartDatas.koreaAreaAnalysis.preCreativityAreaScore === 0 ? null : this.chartDatas.koreaAreaAnalysis.preCreativityAreaScore
      ]
      this.chartData.chartDataRadar.data.datasets[1].data = [
        this.chartDatas.koreaAreaAnalysis.languageArea === 0 ? null : this.chartDatas.koreaAreaAnalysis.languageArea,
        this.chartDatas.koreaAreaAnalysis.recognizeArea === 0 ? null : this.chartDatas.koreaAreaAnalysis.recognizeArea,
        this.chartDatas.koreaAreaAnalysis.socialityArea === 0 ? null : this.chartDatas.koreaAreaAnalysis.socialityArea,
        this.chartDatas.koreaAreaAnalysis.sentimentsArea === 0 ? null : this.chartDatas.koreaAreaAnalysis.sentimentsArea,
        this.chartDatas.koreaAreaAnalysis.creativityArea === 0 ? null : this.chartDatas.koreaAreaAnalysis.creativityArea
      ]
      // 만점시 컬러 삽입
      const isPerfect = this.chartData.chartDataRadar.data.datasets[1].data.every(item => item === 10);
      if (isPerfect) {
        this.chartData.chartDataRadar.data.datasets[1].backgroundColor = 'rgba(188, 29, 218, 0.2)';
      }
    },
    setBarData() {
      switch(this.engLevel) {
        case 'b' :
          this.chartData.chartDataBar.data.datasets[0].data = [
            this.chartDatas.englishLevelAnalysis.preBookEngStep1Cn,
            this.chartDatas.englishLevelAnalysis.preBookEngStep2Cn,
            this.chartDatas.englishLevelAnalysis.preBookEngStep3Cn
          ]
          this.chartData.chartDataBar.data.datasets[1].data = [
            this.chartDatas.englishLevelAnalysis.bookEngStep1Cn,
            this.chartDatas.englishLevelAnalysis.bookEngStep2Cn,
            this.chartDatas.englishLevelAnalysis.bookEngStep3Cn
          ]
          this.chartData.chartDataBar.data.labels =  ['0.1 ~ 0.5', '0.6 ~ 1.0', '1.1 ~ 1.8'];
          break;
        case 'i' :
          this.chartData.chartDataBar.data.datasets[0].data = [
            this.chartDatas.englishLevelAnalysis.preBookEngStep4Cn,
            this.chartDatas.englishLevelAnalysis.preBookEngStep5Cn,
            this.chartDatas.englishLevelAnalysis.preBookEngStep6Cn
          ]
          this.chartData.chartDataBar.data.datasets[1].data = [
            this.chartDatas.englishLevelAnalysis.bookEngStep4Cn,
            this.chartDatas.englishLevelAnalysis.bookEngStep5Cn,
            this.chartDatas.englishLevelAnalysis.bookEngStep6Cn
          ]
          this.chartData.chartDataBar.data.labels =  ['1.3 ~ 2.0', '2.1 ~ 2.5', '2.6 ~ 3.0'];
          break;
        case 'a' :
          this.chartData.chartDataBar.data.datasets[0].data = [
            this.chartDatas.englishLevelAnalysis.preBookEngStep7Cn,
            this.chartDatas.englishLevelAnalysis.preBookEngStep8Cn,
            this.chartDatas.englishLevelAnalysis.preBookEngStep9Cn
          ]
          this.chartData.chartDataBar.data.datasets[1].data = [
            this.chartDatas.englishLevelAnalysis.bookEngStep7Cn,
            this.chartDatas.englishLevelAnalysis.bookEngStep8Cn,
            this.chartDatas.englishLevelAnalysis.bookEngStep9Cn
          ]
          this.chartData.chartDataBar.data.labels =  ['2.7 ~ 3.5', '3.6 ~ 4.0', '4.1~'];

          break;
      }
    },
    getSuperBookData() {
      const params = {
        "student_id": this.studentId,
        "search_date": this.queryMonth,
        "search_pre_date": moment(this.queryMonth).subtract('1','month').format('YYYYMM')
      }
      const superBookData = superBookApi.getSuperBookMonth(params);
      superBookData.then((res) => {
        if (res.status === 200) {
          this.chartDatas = res.data.data;
          if (this.chartDatas.bookAnalysis.bookReadingCompleteCn >= 5) {
            this.isReport = true;
          } else {
            this.isReport = false;
          }
          this.setChartData();
          this.setBarChartOptions();
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    setTimer(time) {
      if (!time || time === '0' || time === '') {
        return '0 시간';
      } else {
        const timer = time.split(':');
        if (timer[0] === '0') {
          return timer[1] + '분';
        } else {
          return timer[0].replace(/(^0+)/, "") + '시간 ' + timer[1].replace(/(^0+)/, "") + '분';
        }
      }
    },
    toggleEngLevel(level) {
      this.engLevel = level;
      this.setBarData();
      if (this.$refs.barChart) {
        let chart = this.$refs.barChart.chart;
        chart.data.datasets[0].data = this.chartData.chartDataBar.data.datasets[0].data;
        chart.data.datasets[1].data = this.chartData.chartDataBar.data.datasets[1].data;
        chart.data.labels = this.chartData.chartDataBar.data.labels;
        chart.update();
      }
      this.setBarChartOptions();
    },
    setBarChartOptions(){
      let isMaxLastMonth = this.chartData.chartDataBar.data.datasets[0].data.filter((el)=>el >= 10);
      let isMaxCurrentMonth = this.chartData.chartDataBar.data.datasets[1].data.filter((el)=>el >= 10);
      let maxNumber = (Math.max(...isMaxLastMonth,...isMaxCurrentMonth))

      if (this.$refs.barChart){
        //차트 값 바뀌면 업데이트
        let chart = this.$refs.barChart.chart;
        if( isMaxLastMonth.length !== 0 || isMaxCurrentMonth.length !== 0){
          chart.options.scales.y.ticks.stepSize = 10
          //최대 값 증 10단위가 있다면 max값 +10
          chart.options.scales.y.max = maxNumber % 10 == 0 ? maxNumber + 10 : null
        } else {
          chart.options.scales.y.ticks.stepSize = 1
          chart.options.scales.y.max = 10
        }
        chart.update();
      }else {
        //처음 랜더링 될 때 확인
        if( isMaxLastMonth.length !== 0 || isMaxCurrentMonth.length !== 0){
          this.chartData.chartBarOption.scales.y.ticks.stepSize = 10
          this.chartData.chartBarOption.scales.y.max =  maxNumber % 10 == 0 ? maxNumber + 10 : null
        } else  {
          this.chartData.chartBarOption.scales.y.ticks.stepSize = 1
          this.chartData.chartBarOption.scales.y.max = 10
        }
      }
    },
    isPrev() {
      return this.queryMonth !== '202309';
    },
    isNext() {
      return this.queryMonth !== moment().subtract('1','month').format('YYYYMM');
    },
    prevDate() {
      this.setDate();
    },
    nextDate() {
      this.chartDatas = null;
      this.currentMonth = moment(this.queryMonth).add('1','month').format('YYYY년 MM월');
      this.queryMonth = moment(this.queryMonth).add('1','month').format('YYYYMM');
      this.currentMonthAll  = moment(this.queryMonth).format('M월 1일') + ' ~ ' + moment(this.queryMonth).format('M월 ') + moment(this.queryMonth).daysInMonth() + '일';
      this.getSuperBookData();
    },
    dividerKeyword(arr) {
      if (arr) {
        const words = arr.split(',');
        return words;
      }
    },
    replaceDefault(e) {
      e.target.src = require('@/assets/img/launcher-readingclub/common/thumbnail_default.png')
    },
  }
}
</script>