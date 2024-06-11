<template>
  <div class="schedule status">
    <div class="gnb">
      <button class="back" @click="closeSchedule()"></button>
      <div class="gnb-title">
        <img src="@/assets/img/launcher/schedule/ttable_sub_navi_ico_l.png" alt="deco">
        <p>학습 현황</p>
        <img src="@/assets/img/launcher/schedule/ttable_sub_navi_ico_r.png" alt="deco">
      </div>
      <div class="gnb-right timetable">
        <span>
          <router-link :to="{ name: 'ScheduleMain' }">
            <img src="@/assets/img/launcher/schedule/ttable_btn_timetable.png" alt="timetable">
          </router-link>
        </span>
        <button class="btn" @click="closeSchedule()">
          <img src="@/assets/img/launcher/mypage/mp_navi_btn_close_b.png" alt="close">
        </button>
      </div>
    </div>
    <div class="study-plan learning-status">
      <div class="schedule-area">
        <div class="calendar-area">
          <FullCalendar :options="calendarOptions" />
        </div>
        <div class="schedule-bottom"></div>
      </div>
    </div>
  </div>
  <DetailModal :propsData="{detailShowModal, fullDate, year, month, date, dayText, isThisMonthPrev, isThisMonthNext}" @closePopup="closeDetailPopup" @showPrevDetail="showPrevDetail" @showNextDetail="showNextDetail"></DetailModal>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";
import '@fullcalendar/core/vdom' // solves problem with Vite
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import DetailModal from './comp-schedule-popup/schedule-status-detail-popup'

import learningFactory from '@/api/learning-factory';

const schedule = learningFactory.get('scheduleCode');

export default {
  components: {
    FullCalendar, // make the <FullCalendar> tag available
    DetailModal,
  },
  data() {
    return {
      detailShowModal: false,
      isBackMy: false,

      year: '',
      month: '',
      date: '',
      day: '',
      dayText: '',
      fullDate: '',

      isThisMonthPrev: true,
      isThisMonthNext: true,

      scheduleList: [],
      getEventData: [],
      tempList : [],
      getDetailData: [],

      calendarOptions: {
        plugins: [ dayGridPlugin, interactionPlugin ],
        // locale: 'en',
        initialView: 'dayGridMonth',
        // clickToCreate: false,
        firstDay: 1,
        // 이벤트 3개 이상일때 더보기
        // TODO: 이벤트 더보기 클릭 후 팝업 창 닫히지 않음
        dayMaxEvents: 3,
        // 달력 마지막 줄 삭제
        fixedWeekCount: false,
        // 달력칸 높이 자동 조정
        contentHeight: 'auto',
        headerToolbar: { //헤더 툴바 커스텀
          //TODO: 학습현황 컨텐츠 추가 가능한지 확인(progress)
          left: '',
          center: 'prev title next',
          right: ''
        },
        // 커스텀 버튼
        customButtons: {
          processSchedule: {
            text: '',
            click: function() {
              alert('이번달 학습현황 버튼 클릭');
            }
          },
          //TODO: 클릭시 담임선생님 쪽지로 이동
          modiSchedule: {
            text: '',
            click: function() {
              alert('clicked the custom button!');
            }
          },
          //TODO: 클릭시 학부모 인증 후 시간표 관리 페이지로 이동 / 이미 인증한 경우 버튼변경 / class = "end-schedule" 추가
          manageSchedule: {
            text: '',
            click: function (){
              this.classList.toggle('end-schedule');
            }
            // click: this.openWindowLecturePopup,
          }
        },
        businessHours:[{
          //daysOfWeek:[1,2,3,4,5] //요일 별로 표시하고 싶을 때 1~5는 월~금
        }],
        events: [],
        // hiddenDays: [0, 6], // TODO: 주말 달력에서 나오지 않게 하기로 확정되면 주석 해제 필요
        titleFormat : this.setTitleDate,
        // 이벤트 팝업 타이틀(날짜)변경
        dayPopoverFormat: function(date) {
          const year = date.date.year;
          const month = date.date.month + 1;
          const day = date.date.day;

          return year + "년 " + month + "월 " + day + "일";
        },
        dayHeaderContent: function (date) {
          let weekList = ["일", "월", "화", "수", "목", "금", "토"];
          return weekList[date.dow];
        },
        eventChange: function(arg){
          //allDay true로 바꾸면 end가 없어서 만듬
          if(arg.event.end == null){
            var end = new Date();
            end.setDate(arg.event.start.getDate()+1);
            arg.event.setEnd(end);
          }
        },
        dateClick: this.openDetailPopup,
        datesSet: this.getDateButton,
        eventOrder: true,// 이벤트 순서를 값 들어오는 순서대로
        moreLinkContent:function(args){
          return args.num;
        },
      },
    }
  },
  watch: {
    'year'() {
      this.getScheduleList();
    },
    'month'() {
      this.getScheduleList();
    }
  },
  created() {
    this.checkBackPage();

    setTimeout(() => {
      this.getScheduleList();
    }, 0);
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  methods: {
    ...mapMutations('scheduleStorage', ['storeDetailList']),

    // 마이페이지에서 왔는지 메인에서 왔는지 체크
    checkBackPage() {
      const urlParams = new URL(location.href).searchParams;
      const isMy = urlParams.get('backDiv');
      if (isMy == 'Y') {
        this.isBackMy = true;
      } else {
        this.isBackMy = false;
      }
    },
    getScheduleList() {
      const moment = require('moment');
      const today = moment(new Date(this.year + '-' + this.month + '-' + '01'));
      const data = {
        student_id : this.userInfo.info.studentId, // this.userInfo.info.studentId, 5259
        search_year : this.year,
        search_month : this.month,
        beginDate : today.startOf('month').format('YYYY-MM-DD'), // 화상 수업 내역 조회를 위한 param
        endDate : today.endOf('month').format('YYYY-MM-DD'), // 화상 수업 내역 조회를 위한 param
      }

      const list = schedule.getStatusList(data);
      list.then((res) => {
        if (res.status == 200) {
          const list = res.data.data.studyActPlanList;
          this.getEventData = list;
          this.scheduleList = res.data.data;

          // this.getAttendEventData = res.data.data.attendList; // TODO: 출석관련 필요시 주석 해제
          this.setDataList();
        }
      }).catch((error) => {
        console.log(error)
      });
    },
    setDataList() {
      this.tempList = [];

      for (let i = 0; i < this.getEventData.length; i++) {
        this.tempList.push({});
        for (let j = 0; j < this.tempList.length; j++) {
          if (i == j) {
            if (this.getEventData[i].study_course_nm == '이북영어' || this.getEventData[i].study_course_nm == '이북한글' || this.getEventData[i].study_course_nm == '모션영어' || this.getEventData[i].study_course_nm == '모션한글') {
              this.tempList[j].title = `${this.getEventData[i].subj_nm} > ${this.getEventData[i].study_course_nm}`;
            } else {
              this.tempList[j].title = `${this.getEventData[i].subj_nm} > ${this.getEventData[i].prog_nm}`;
            }
            this.tempList[j].date = this.getEventData[i].study_plan_dt;
            this.tempList[j].active = this.getEventData[i].act_yn;

            if (this.getEventData[i].subj_nm == '국어') {
              this.tempList[j].className = 'korean';
              if (this.tempList[j].active != 'N') {
                this.tempList[j].className = 'korean study';
              }
            } else if (this.getEventData[i].subj_nm == '수학') {
              this.tempList[j].className = 'math';
              if (this.tempList[j].active != 'N') {
                this.tempList[j].className = 'math study';
              }
            } else if (this.getEventData[i].subj_nm == '영어') {
              this.tempList[j].className = 'english';
              if (this.tempList[j].active != 'N') {
                this.tempList[j].className = 'english study';
              }
            } else if (this.getEventData[i].subj_nm == '슈퍼박스') {
              this.tempList[j].className = 'superbox';
              if (this.tempList[j].active != 'N') {
                this.tempList[j].className = 'superbox study';
              }
            } else if (this.getEventData[i].subj_nm == '특별학습') {
              this.tempList[j].className = 'special';
              if (this.tempList[j].active != 'N') {
                this.tempList[j].className = 'special study';
              }
            } else {
              this.tempList[j].className = 'other';

              if (this.tempList[j].active != 'N') {
                this.tempList[j].className = 'other study';
              }
            }
          }
        }
      }

      this.calendarOptions.events = this.tempList;
    },
    getDateButton() {
      this.checkMonth(); // 학습계획은 현재 기준으로 다음달까지만 잡을 수 있는 처리
      this.showConsultImg(); // 화상뱃지 표시
    },
    // 학습계획은 현재 기준으로 다음달까지만 잡을 수 있는 처리
    checkMonth() {
      const moment = require('moment');
      let currentYear = moment().year();
      let currentMonth = moment().month() + 1;

      let diff = (currentMonth - this.month) + (12 * (currentYear - this.year));

      let nextBtn = document.querySelector('.fc-next-button');
      if (diff <= -1) {
        nextBtn.classList.add('disable');
      } else {
        nextBtn.classList.remove('disable');
      }

      let prevBtn = document.querySelector('.fc-prev-button');
      if (diff >= 12) {
        prevBtn.classList.add('disable');
      } else {
        prevBtn.classList.remove('disable');
      }
    },
    showConsultImg() {
      // 화상뱃지 표기하기
      // const moment = require('moment');

      // 상담뱃지 전부 삭제 후 이벤트가 있는 곳에만 추가
      const counselBtn = document.querySelectorAll('.fc-daygrid-day-counseling.counsel');
      counselBtn.forEach((el) => {
        el.remove();
      });

      // 각 날짜와 화상 날짜 값을 비교해서 같은 곳에 화상뱃지 달기
      let eachDateWrap = document.querySelectorAll('.fc-daygrid-day');

      eachDateWrap.forEach((el) => {
        let thisDateTag = el;
        const eachDate = thisDateTag.getAttribute('data-date');
        if (this.scheduleList.meetingList !== undefined) {
          this.scheduleList.meetingList?.forEach((el) => {
            let dailyBtn = document.createElement("div");
            dailyBtn.setAttribute('class', 'fc-daygrid-day-counseling counsel');

            if (eachDate == el.start_dt) {
              thisDateTag.querySelector('.fc-daygrid-day-top').appendChild(dailyBtn);
              dailyBtn.setAttribute('data-date', el.start_dt);
            }
          });
        }

        // let thisDateTag = el;
        // let eachDate = String(moment(thisDateTag.getAttribute('data-date')).date()).padStart(2, '0');
        //
        // if (String(moment(thisDateTag.getAttribute('data-date')).month() + 1).padStart(2, '0') == this.month) {
        //   this.scheduleList.videolist?.forEach((el) => {
        //     let dailyBtn = document.createElement("div");
        //     dailyBtn.setAttribute('class', 'fc-daygrid-day-counseling counsel');
        //
        //     if (eachDate == el.check_dt) {
        //       thisDateTag.querySelector('.fc-daygrid-day-top').appendChild(dailyBtn);
        //       dailyBtn.setAttribute('data-date', el);
        //     }
        //   });
        // }
      });
    },
    showPrevDetail() {
      const moment = require('moment');
      this.fullDate = moment(this.fullDate).subtract('1', 'd').locale('ko').format('YYYY-MM-DD');

      this.openDetailPopup(this.fullDate, 'arrow');
    },
    showNextDetail() {
      const moment = require('moment');
      this.fullDate = moment(this.fullDate).add('1', 'd').locale('ko').format('YYYY-MM-DD');

      this.openDetailPopup(this.fullDate, 'arrow');
    },
    setTitleDate(date) {
      const year = date.date.year;
      const month = String(date.date.month + 1).padStart(2, '0');

      this.year = year;
      this.month = month;

      return year + "년 " + month + "월";
    },

    // 팝업 클릭시
    clickPopBtn() {
      document.querySelector('body').style.overflow = 'hidden';
    },
    // 상세보기 팝업 열기
    openDetailPopup(arg, string) {
      const moment = require('moment');

      if (string == 'arrow') {
        this.fullDate = arg;
        this.date = moment(this.fullDate).format('D');
        this.day = moment(this.fullDate).format('d');
      } else {
        this.fullDate = arg.dateStr;
        this.date = arg.date.getDate();
        this.day = arg.date.getDay();
      }

      if (this.day == 0) {
        this.dayText = '일';
      } else if (this.day == 1) {
        this.dayText = '월';
      } else if (this.day == 2) {
        this.dayText = '화';
      } else if (this.day == 3) {
        this.dayText = '수';
      } else if (this.day == 4) {
        this.dayText = '목';
      } else if (this.day == 5) {
        this.dayText = '금';
      } else if (this.day == 6) {
        this.dayText = '토';
      }

      if (this.month != moment(this.fullDate).format('M').padStart(2, '0')) {
        return;
      }

      // 화살표 막기
      if (this.fullDate == moment(this.fullDate).startOf('month').format('YYYY-MM-DD')) {
        this.isThisMonthPrev = false;
      } else {
        this.isThisMonthPrev = true;
      }

      // 화살표 막기
      if (this.fullDate == moment(this.fullDate).endOf('month').format('YYYY-MM-DD')) {
        this.isThisMonthNext = false;
      } else {
        this.isThisMonthNext = true;
      }

      this.clickPopBtn();
      this.getDetailList(string);
    },
    // 상세보기 팝업 닫기
    closeDetailPopup() {
      this.detailShowModal = false;
      this.getDetailData = [];
      document.querySelector('body').style.overflow = 'auto';
    },
    // 상세보기 내용 가져오기
    getDetailList(string) {
      const data = {
        student_id : this.userInfo.info.studentId,
        search_date : this.fullDate,
      }

      const list = schedule.getDetailConts(data);
      list.then((res) => {
        if (res.status == 200) {
          const list = res.data.data.studyActPlans;
          this.getDetailData = list;

          if (this.getDetailData && this.getDetailData.length == 0 && (string == '' || string == undefined)) {
            this.closeDetailPopup();
          } else if ((this.getDetailData && this.getDetailData.length != 0) || (this.getDetailData && (string != '' || string != undefined))) {
            this.storeDetailList(this.getDetailData);
            this.detailShowModal = true;
          }
        }
      }).catch((error) => {
        console.log(error)
      });
    },

    closeSchedule() {
      if (this.isBackMy) {
        document.location.href="/mypage.html"
      } else {
        // eslint-disable-next-line
        goGrowvAppPage("main");
      }
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/*TODO: 상담뱃지 일단 제거*/
.fc-daygrid-day-top .fc-daygrid-day-counseling {
  display: none;
}
</style>