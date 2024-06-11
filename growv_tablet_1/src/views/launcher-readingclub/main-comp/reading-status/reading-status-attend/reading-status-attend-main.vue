<template>
  <div class="schedule attend-book">
    <div class="calendar-area">
      <FullCalendar ref="fullCalendar" :options="calendarOptions" />
      <div class="schedule-bottom"></div>
    </div>
    <p class="count-text">{{totalAttend}}일</p>
  </div>
</template>

<script>
import {mapGetters,mapMutations} from "vuex";
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import moment from "moment";
import readingClubFactory from "@/api/reading-club/readingClub-factory";

const attendApi = readingClubFactory.get('readingAttend');

export default {
  data() {
    return {
      year: '',
      month: '',

      tempList: [],
      getEventData: {
        attendList: [],
      },
      totalAttend:null,
      thisDate:'',
      isNextMonth :false,
      isPrevMonth :false,

      calendarOptions: {
        plugins: [ dayGridPlugin, interactionPlugin ],
        // locale: 'en',
        initialView: 'dayGridMonth',
        // clickToCreate: false,
        firstDay: 1,
        // 이벤트 3개 이상일때 더보기
        dayMaxEvents: 2,
        // 달력 마지막 줄 삭제
        fixedWeekCount: false,
        displayEventEnd: true,
        // 달력칸 높이 자동 조정
        contentHeight: 'auto',

        headerToolbar: { //헤더 툴바 커스텀
          left: 'attendSchedule',
          center: 'prev title next',
          right:''
        },
        // 커스텀 버튼
        customButtons: {
          attendSchedule: {
            text: '',
            click: function () {
            }
          },
          prev: {
            click: () => {
              const calendarApi = this.$refs.fullCalendar.getApi();
              if(this.isPrevMonth === false){
                calendarApi.prev();
                this.prevMonth();
              }
            }
          },
          next: {
            click: () => {
              const calendarApi = this.$refs.fullCalendar.getApi();
              if(this.isNextMonth === false){
                calendarApi.next();
                this.nextMonth();
              }
            }
          }
        },
        businessHours:[{
        }],
        events: [],
        titleFormat : this.setTitleDate,
        dayHeaderContent: function (date) {
          let weekList = ["일", "월", "화", "수", "목", "금", "토"];
          return weekList[date.dow];
        },
        datesSet: this.checkValidBtn,
        eventOrder: true,// 이벤트 순서를 값 들어오는 순서대로
        moreLinkContent:function(args){
          return args.num;
        },
      },
    }
  },
  components: {
    FullCalendar, // make the <FullCalendar> tag available
  },
  computed: {
    ...mapGetters('readingStatusStorage', ['getDate']),
    ...mapGetters(['userInfo'])
  },
  watch: {
    'getDate'(newValue, oldValue) {
      if (newValue !== oldValue && oldValue) {
        this.setCalendarDate();
        this.changeStartCalendar();
        this.getAttendList();
      }
    },
  },
  mounted() {
    this.changeStartCalendar();
    this.getDateBtnClass();
    this.checkPrevMonth();
    this.checkNextMonth();
    this.getAttendList();
  },
  methods: {
    ...mapMutations('readingStatusStorage', [
      'updateDate'
    ]),
    setCalendarDate() {
      const date = new Date(this.getDate);
      this.thisDate = moment(date).locale('ko').format('YYYY-MM-DD');

      this.year = String(date.getFullYear());
      this.month = String(date.getMonth() + 1).padStart(2,'0');
    },
    // 캘린더 시작월 변경(store에서 가져온 날찌로 세팅)
    changeStartCalendar() {
       this.$refs.fullCalendar.getApi().gotoDate(`${this.year}-${this.month}-01`);
    },
    // 출석 표시
    getDateButton() {
      let eachDateWrap = document.querySelectorAll('.fc-daygrid-day');
      let count = 1;
      this.calendarOptions.events.forEach((el) => {
        let isEventDate = el.date;
        eachDateWrap.forEach((el) => {
          let eachDate = el.getAttribute('data-date');

          if (isEventDate == eachDate) {
            if (count === 6) { count = 1; }
            // TODO : 클래스명 변경 attend-01~05 (출석 스티커 1번~5번 추가 건)
            el.querySelector('.fc-daygrid-day-events').classList.add('attend-0' + count);
            count++;
          }
        });
      });
    },
    //이전달로 이동
    prevMonth(){
      if(this.isPrevMonth === false){
        const newDate = moment(this.getDate).subtract('1', 'M').locale('ko').format('YYYY-MM-DD');
        this.updateDate(newDate)
        this.checkPrevMonth();
      }
    },
    //다음달로 이동
    nextMonth() {
      if(this.isNextMonth === false){
        const newDate = moment(this.getDate).add('1', 'M').locale('ko').format('YYYY-MM-DD');
        this.updateDate(newDate)
        this.checkNextMonth();
      }
    },
    //달 체크하기 - 현재 달 까지 확인 가능
    checkNextMonth() {
      const date = new Date();

      let currentYear = date.getFullYear();
      let currentMonth = date.getMonth() + 1;

      let diff = (currentMonth - this.month) + (12 * (currentYear - this.year));

      let nextBtn = document.querySelector('.fc-next-button');
      if (diff <= 0) {
        this.isNextMonth = true;
        nextBtn.classList.add('disabled');
        return;
      } else {
        this.isNextMonth = false;
        nextBtn.classList.remove('disabled');
      }
    },
    checkPrevMonth() {
      const startYear = moment(this.userInfo.info.learnStartDt).subtract(1,'month').format('YYYY')
      const startMonth = moment(this.userInfo.info.learnStartDt).subtract(1,'month').format('MM')

      let prevBtn = document.querySelector('.fc-prev-button');
      if(this.year === startYear && this.month === startMonth){
        this.isPrevMonth = true;
        prevBtn.classList.add('disabled');
      }else {
        this.isPrevMonth = false;
        prevBtn.classList.remove('disabled');
      }
    },
    //출석 리스트 가져오기 api
    getAttendList() {
      const params = {
        studentId: this.userInfo.info.studentId,
        searchYear: this.year,
        searchMonth : this.month,
      }
      const attendData = attendApi.getAttendInfo(params);
      attendData.then((res) => {
        this.getEventData.attendList = res.data.data.items;
        this.totalAttend = res.data.data.totalCount;
        this.setAttendDate();
      }).catch((err)=>{
        console.log(err)
      })

    },
    //달력 라이브러리에 날짜 세팅
    setTitleDate() {
        const date = new Date(this.getDate)
        const currentDay = new Date();
        const currentMonth = currentDay.getMonth()+1;
        const currentYear = currentDay.getFullYear();

        const year =  String(date.getFullYear());
        const month = String(date.getMonth() + 1).padStart(2,'0');
        this.year = year;
        //다른 페이지에서 넘어왔을 때 현재 달 보다 이후라면 현재달로 세팅(출석부는 현재 달보다 이후일 수 없음)
        if(month > currentMonth && (currentYear == year)) {
          this.month = currentMonth;
          this.thisDate  =  moment().locale('ko').format('YYYY-MM-DD')
          this.updateDate(this.thisDate)
          return year + "년 " + currentMonth + "월";
        } else {
          this.month = month;
          this.thisDate = moment(date).locale('ko').format('YYYY-MM-DD');
          return year + "년 " + month + "월";
        }

    },
    //달력 랜더링시 설정된 날짜로부터 달 이동이 가능한지 확인
    checkValidBtn(){
      this.checkPrevMonth();
      this.checkNextMonth();
      this.getDateButton();
    },
    //날짜 버튼에 클래스 추가
    getDateBtnClass() {
      const dateClass = document.querySelector('.fc-header-toolbar .fc-toolbar-chunk:nth-child(2)')
      const prevBtn = document.querySelector('.fc-header-toolbar .fc-toolbar-chunk:nth-child(2) .fc-prev-button')
      const dateTitle = document.querySelector('.fc-header-toolbar .fc-toolbar-chunk:nth-child(2) .fc-toolbar-title')
      const nextBtn = document.querySelector('.fc-header-toolbar .fc-toolbar-chunk:nth-child(2) .fc-next-button')

      dateClass.classList.add('btn-calendar')
      prevBtn.classList.add('btn-prev')
      dateTitle.classList.add('txt-month')
      nextBtn.classList.add('btn-next')
    },
    // 캘린더옵션 이벤트에 출석리스트에서 출석날짜만 넣기
    setAttendDate() {
      this.tempList = [];
      for (let i = 0; i < this.getEventData.attendList.length; i++) {
        this.tempList.push({});
        for (let j = 0; j < this.tempList.length; j++) {
          if (i == j) {
            this.tempList[j].date = this.getEventData.attendList[i].attendDt;
          }
        }
      }
      this.calendarOptions.events = this.tempList;
    },
  },
}
</script>

<style scoped>

</style>