<template>
  <div class="schedule reading">
    <div class="calendar-area" @scroll="handleScroll">
      <div>
        <!-- 팝업창 -->
          <div class="popup-tooltip" v-show="tooltipOpen" >
            <ul class="dot-list">
              <li class="list-item"><span>조회한 기간</span> 동안 몇 권을 읽었는지 표시해요.</li>
              <li class="list-item">한 권을 <span>여러 번</span> 읽어도 숫자가 <span>올라가요.</span></li>
<!--              <li class="list-item"><span>Oxford Readers 책은 추후 반영 예정입니다.</span></li>-->
            </ul>
            <button type="button" @click="handelTooltip" class="btn-close text-blind">닫기</button>
          </div>
      </div>
        <FullCalendar ref="fullCalendar" :options="calendarOptions" />
        <div class="schedule-bottom"></div>
    </div>
      <p class="count-text">{{totalBookCount}}권</p>
  </div>
  <DetailModal ref="scriptDetail" :propsData="{detailShowModal}"
               @closePopup="closeDetailPopup" @getScheduleList="getScheduleList" >
  </DetailModal>

</template>

<script>
import {mapGetters, mapMutations} from "vuex";
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import DetailModal from './reading-status-active-calendar-detail-popup'
import readingClubFactory from "@/api/reading-club/readingClub-factory";
import moment from "moment/moment";

const readingCalenderApi = readingClubFactory.get('readingActivity')

export default {
  data() {
    return {
      year: '',
      month: '',
      fullDate: '',
      diffDate: false,
      detailShowModal: false,
      sendClickDate:'',
      totalBookCount:null,
      isPrevMonth: false,
      isNextMonth: false,

      getEventData: [],

      startDate:'',
      endDate:'',

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
          left: 'readingSchedule',
          center: 'prev title next',
          right:'listToggle'
        },
        // 커스텀 버튼
        customButtons: {
          readingSchedule: {
            title: '',
            click: this.handelTooltip,
          },
          listToggle: {
            text:'',
            click:() => {
              this.$router.push({name:'readingStatusActiveList'})
            }
          },
          prev: {
            click: () => {
              const calendarApi = this.$refs.fullCalendar.getApi();
              if (this.isPrevMonth === false) {
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
          //daysOfWeek:[1,2,3,4,5] //요일 별로 표시하고 싶을 때 1~5는 월~금
        }],
        events: [],
        // hiddenDays: [0, 6], // TODO: 주말 달력에서 나오지 않게 하기로 확정되면 주석 해제 필요
        titleFormat : this.setTitleDate,
        dayHeaderContent: function (date) {
          let weekList = ["일", "월", "화", "수", "목", "금", "토"];
          return weekList[date.dow];
        },
        dateClick: this.openDetailPopup,
        datesSet: this.setCheckDate,
        eventOrder: true,// 이벤트 순서를 값 들어오는 순서대로
        moreLinkContent:function(args){
          return args.num;
        },
      },
      tooltipOpen: false
    }
  },
  components: {
    FullCalendar, // make the <FullCalendar> tag available
    DetailModal,
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
        this.getScheduleList();
      }
    }
  },
  mounted() {
    this.getScheduleList();
    this.changeStartCalendar();
    this.getDateBtnClass();
    window.addEventListener('click', this.onClick);
  },
  methods: {
    ...mapMutations('readingStatusStorage', [
      'updateDate'
    ]),
    setCalendarDate() {
      const thisDate = new Date(this.getDate)
      this.year = moment(thisDate).format('YYYY')
      this.month =  moment(thisDate).format('MM')
    },
    // 캘린더 시작월 변경(메인에서 타고 온 날짜로 세팅)
    changeStartCalendar() {
      this.$refs.fullCalendar.getApi().gotoDate(`${this.year}-${this.month}-01`);
    },
    // 상세팝업 열기
    openDetailPopup(arg) {
      //학습 시작일 전 날짜 클릭 막기
      // const startDate = moment(new Date(this.userInfo.info.learnStartDt)).format('YYYY-MM-DD')
      // const diffDate = moment(arg.dateStr).startOf('day').diff(startDate,'days')
      //음수면 시작일 전 날
      // if(diffDate < 0 ) return
      this.detailShowModal = true;
      document.querySelector('body').style.overflow = 'hidden';
      this.$refs.scriptDetail.isShow(arg.dateStr)
    },
    // 상세보기 팝업 닫기
    closeDetailPopup() {
      this.detailShowModal = false;
      document.querySelector('body').style.overflow = 'auto';
      this.getScheduleList();
    },
    //이전달로 이동
    prevMonth(){
      const thisDate = new Date(this.getDate)

      const newDate = moment(thisDate).subtract('1', 'M').locale('ko').format('YYYY-MM-DD');
      this.updateDate(newDate);
      this.checkPrevMonth();
    },
    //다음달로 이동
    nextMonth() {
      const thisDate = new Date(this.getDate)

        const newDate = moment(thisDate).add('1', 'M').locale('ko').format('YYYY-MM-DD');
        this.updateDate(newDate);
        this.checkNextMonth();
    },
    //달 체크하기 - 다음달 까지 확인 가능
    checkNextMonth() {
      const date = new Date();
      let currentYear = date.getFullYear();
      let currentMonth = date.getMonth() + 1;

      let diff = (currentMonth - this.month) + (12 * (currentYear - this.year));

      let nextBtn = document.querySelector('.fc-next-button');
      //TODO:당월까지 확인 가능 => 추후 수정
      if (diff <= 0) {
        this.isNextMonth = true
        nextBtn.classList.add('disabled');
      } else {
        this.isNextMonth = false
        nextBtn.classList.remove('disabled');
      }
    },
    //학습시작일 전 달까지만 확인
    checkPrevMonth() {
      const startYear = moment(this.userInfo.info.learnStartDt).subtract(1,'month').format('YYYY')
      const startMonth = moment(this.userInfo.info.learnStartDt).subtract(1,'month').format('MM')

      let prevBtn = document.querySelector('.fc-prev-button');
      if(this.year === startYear && this.month === startMonth){
        this.isPrevMonth = true;
        prevBtn.classList.add('disabled');
      }else {
        this.isPrevMonth = false
        prevBtn.classList.remove('disabled');
      }
    },
    // 리딩 스케줄 리스트 Api
     getScheduleList() {
       const params = {
         studentId: this.userInfo.info.studentId,
         searchYear: this.year,
         searchMonth : this.month,
       }
       const scheduleData = readingCalenderApi.getActivityCalendar(params);
       scheduleData.then((res) => {
         this.getEventData = res.data.data.items;
         this.totalBookCount = res.data.data.readSum;
         this.setDataList(); // 스케쥴 리스트 표시
         this.setTodayBookIcon();
       }).catch((err)=>{
         console.log(err)
       });
    },
    // 캘린더옵션 이벤트에 리딩스케쥴 리스트 넣기
    setDataList() {
      let tempList = [];
      for (let i = 0; i < this.getEventData.length; i++) {
        //한글 도서
        if (this.getEventData[i].readKorCnt !== 0 ) {
            tempList.push({
            title: `한글 ${this.getEventData[i].readKorCnt}권`,
            className: 'korean study',
            date: this.getEventData[i].bookPlanDt
          });
        }
        //영어 도서
        if (this.getEventData[i].readEngCnt !== 0 ) {
           tempList.push({
            title: `영어 ${this.getEventData[i].readEngCnt}권`,
            className: 'english study',
            date: this.getEventData[i].bookPlanDt
          });
        }
        if(this.getEventData[i].isToday === true && this.getEventData[i].readEngCnt === 0 && this.getEventData[i].readKorCnt === 0) {
          tempList.push({
            className: 'today-book',
            date: this.getEventData[i].bookPlanDt
          });
        }
      }
      this.calendarOptions.events = tempList;
    },
    //오늘의 책 아이콘 붙이기
    setTodayBookIcon() {
      let eachDateWrap = document.querySelectorAll('.fc-daygrid-day');

      let todayClass = document.querySelectorAll('.fc-daygrid-day-events.today-book')
      if(todayClass){
       todayClass.forEach((el)=>el.classList.remove('today-book'))
      }

      this.calendarOptions.events.forEach((event) => {
        let isEventDate = event.date;

        eachDateWrap.forEach((dateWrap) => {
          let eachDate = dateWrap.getAttribute('data-date');

          if (isEventDate === eachDate && event.className === 'today-book' && (event.className !== 'korean' || event.className !== 'english')) {
            dateWrap.querySelector('.fc-daygrid-day-events').classList.add('today-book');
          }
        });
      });
    },
    setTitleDate() {
        const date = new Date(this.getDate)

        const year =  String(date.getFullYear())
        const month = String(date.getMonth() + 1).padStart(2,'0');

        this.year = year;
        this.month = month;
        return year + "년 " + month + "월";
    },
   //첫 랜더링 시 달 체크하기
    setCheckDate() {
      this.checkNextMonth();
      this.checkPrevMonth();
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
    handelTooltip() {
      this.tooltipOpen = !this.tooltipOpen;
    },
    //외부 영역 클릭시 안내 창 닫힘
    onClick(event) {
      const tooltip = document.querySelector('.fc-header-toolbar .fc-toolbar-chunk:nth-child(1)')
      if (event.target.parentNode !== tooltip){
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
}
</script>
