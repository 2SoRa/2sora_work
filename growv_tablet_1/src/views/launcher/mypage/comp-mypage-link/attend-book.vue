<template>
  <div class="mypage attend-book">
    <div class="gnb">
      <div class="gnb-title">
        <img src="@/assets/img/launcher/mypage/mp_sub_navi_ico_l.png" alt="deco">
        <p>출석부</p>
        <img src="@/assets/img/launcher/mypage/mp_sub_navi_ico_r.png" alt="deco">
      </div>
      <div class="gnb-right">
        <button class="btn" @click="closeAttendBook()">
          <img src="@/assets/img/launcher/mypage/mp_navi_btn_close_b.png" alt="close">
        </button>
      </div>
    </div>
    <div class="content">
      <div class="study-plan learning-status">
        <div class="schedule-area">
          <div class="calendar-area">
            <FullCalendar :options="calendarOptions" />
          </div>
          <div class="schedule-bottom"></div>
        </div>
      </div>
      <div class="attend-info">
        <ul>
          <!-- 이번달 출석 비타민 보여주기         -->
          <li>{{ getEventData.attendVitaMonthSum }}<p class="coin"></p></li>
          <!-- 총 출석일 보여주기         -->
          <li>{{ getEventData.attendMonthCount }} 일</li>
        </ul></div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import '@fullcalendar/core/vdom' // solves problem with Vite
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import mypageFactory from '@/api/mypage-factory';

const attendCode = mypageFactory.get('attendCode');

export default {
  components: {
    FullCalendar, // make the <FullCalendar> tag available
  }, data() {
    return {
      detailShowModal: false,

      year: '',
      month: '',
      date: '',
      day: '',
      dayText: '',
      fullDate: '',

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
        dayMaxEvents: 3,
        // 달력 마지막 줄 삭제
        fixedWeekCount: false,
        displayEventEnd: true,
        // 달력칸 높이 자동 조정
        contentHeight: 'auto',
        headerToolbar: { //헤더 툴바 커스텀
          left: '',
          center: 'prev title next',
          right: ''
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
        datesSet: this.getDateButton,
        moreLinkContent:function(args){
          return args.num;
        },
      },
    }
  },
  watch: {
    'year'(newValue, oldValue) {
      if(newValue !== oldValue && oldValue) {
        this.getAttendList();
      }
    },
    'month'(newValue, oldValue) {
      if(newValue !== oldValue && oldValue) {
        this.getAttendList();
      }
    }
  },
  created() {
    setTimeout(() => {
      this.getAttendList();
    }, 0);
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  methods: {
    getAttendList() {
      // 출석 리스트
      const data = {
        student_id : this.userInfo.info.studentId, // this.userInfo.info.studentId, test: 4
        search_year : this.year,
        search_month : this.month,
      }

      const info = attendCode.getInfo(data);
      info.then((res) => {
        const result = res.data;
        if (result.code === '200') {
          this.getEventData = result.data;
          this.setDataList();
        }
      }).catch((error) => {
        console.log(error);
      });
    },
    setDataList() {
      this.tempList = [];
      for (let i = 0; i < this.getEventData.attendList.length; i++) {
        this.tempList.push({});
        for (let j = 0; j < this.tempList.length; j++) {
          if (i == j) {
            this.tempList[j].date = this.getEventData.attendList[i].attend_dt;
          }
        }
      }
      this.calendarOptions.events = this.tempList;
    },
    getDateButton() {
      this.checkMonth();

      let eachDateWrap = document.querySelectorAll('.fc-daygrid-day');

      this.calendarOptions.events.forEach((el) => {
        let isEventDate = el.date;

        eachDateWrap.forEach((el) => {
          let eachDate = el.getAttribute('data-date');

          if (isEventDate == eachDate) { //  && !el.querySelector('.fc-daygrid-day-top .counsel')
            el.querySelector('.fc-daygrid-day-events').classList.add('attend');
          }
        });
      });
    },
    // 학습계획은 현재 기준으로 현재달까지만 잡을 수 있는 처리
    checkMonth() {
      const moment = require('moment');
      let currentYear = moment().year();
      let currentMonth = moment().month() + 1;

      let diff = (currentMonth - this.month) + (12 * (currentYear - this.year));

      let nextBtn = document.querySelector('.fc-next-button');
      if (diff <= 0) {
        nextBtn.classList.add('disable');
      } else {
        nextBtn.classList.remove('disable');
      }
    },
    setTitleDate(date) {
      const year = date.date.year;
      const month = String(date.date.month + 1).padStart(2, '0');

      this.year = year;
      this.month = month;

      return year + "년 " + month + "월";
    },
    closeAttendBook() {
      this.$router.push({ name: 'VitaminHistory' });
      // window.history.back(); // 안드로이드에서 history가 쌓이지 않을 수 있음
    }
  }
}
</script>

<style>
@import url('@/assets/css/launcher/calendar/calendar.css');
@import url('@/assets/css/launcher/mypage/mypage.css');
</style>