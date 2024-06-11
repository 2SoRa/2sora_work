<template>
  <!-- div로 루트를 감싸주어야 warning이 안뜸 -->
  <div class="schedule reading">
    <div class="calendar-area">
      <Modal v-if="propsData.detailShowModal" @close="closePopup">
        <template v-slot:header>
          <div class="pop-header">
            <div class="btn-calendar">
              <button class="btn-prev" @click="setPreviousData" :disabled="isPrevMonth"></button>
              <h2>{{ setDate }}</h2>
              <button class="btn-next" @click="setNextData" :disabled="isNextMonth"></button>
            </div>
            <button class="modal-default-button" @click="closePopup"></button>
            <p class="header-info">
              선택한 날의 독서 상태를 보여줍니다.<br>
              <strong>오늘의 책</strong>은 진도일에 학습해야 <strong>독서 완료</strong>가 표시가 됩니다.
            </p>
          </div>
        </template>
        <template v-slot:body>
          <div class="pop-body content-scroll-area" :class="{future : isFuture }">
    <!--        오늘의책-->
            <div class="list-todayplan">
              <p class="title">오늘의 책</p>
              <div v-if="todayBookData">
                <div v-for="(item,index) in todayBookData?.items" :key="item.bookId" class="list-box" @click="mixin_openBook({ 'path' : 'T', 'entry':'TodayBook', 'index' : `${index}`,'isCalender':'Y' },item)">
                  <div class="book-info">
                    <div class="img-wrap">
                    <img :src="item.thumbUrl" :alt="item.bookNm" @error="replaceDefault">
  <!--                    <img src="@/assets/img/launcher-readingclub/temp/thum_160.png" :alt="item.bookNm">-->
                    </div>
                    <div class="info-wrap">
                      <div v-if="item.bookDiv === 'K'" class="tag-wrap rounded-outline-developer size-small">
                        <div class="tag develop" >
                          <p class="tag-item" :class="setTagName(item.mainAreaCd,'class')"> {{ setTagName(item.mainAreaCd) }} </p>
                          <p class="tag-item" :class="setTagName(item.subAreaCd, 'class')"> {{ setTagName(item.subAreaCd) }} </p>
                        </div>
                      </div>
                      <div  v-if="item.bookDiv === 'E'" class="tag-wrap rounded size-small">
                        <div class="tag ar">
                          <p class="tag-item step" :class="setTagName(item.bookEngStep,'class')"> {{ setTagName(item.bookEngStep) }} </p>
                        </div>
                      </div>
                      <p class="book-title">{{setBookName(item)}}</p>
                      <p class="reading-count">{{item.readCount}}회 완독</p>
                    </div>
                  </div>
                    <div v-if="!isFuture" class="reading-status" :class="setReadingTry(item)"></div>
                </div>
              </div>
              <div v-else class="list-box no-data">
                <div class="img"></div><p>자유롭게 읽는 날이에요.</p>
              </div>
            </div>
            <!--오늘 읽은 책-->
            <div class="list-today">
              <p class="title">오늘 읽은 책</p>
              <template v-if=" completedBookData || completedBookData?.length > 0 ">
                <div v-for="(item,index) in completedBookData?.items" :key="index" class="list-box" @click="setCompletedBookViewer(item,index)">
                  <div class="book-info">
                    <div class="img-wrap">
                      <img :src="item.thumbUrl" :alt="item.bookNm" @error="replaceDefault">
                    </div>
                    <div class="info-wrap">
                      <!--한글 발달-->
                      <div v-if="item.bookDiv === 'K'" class="tag-wrap rounded-outline-developer size-small">
                        <div class="tag develop" >
                          <p class="tag-item" :class="setTagName(item.mainAreaCd,'class')"> {{ setTagName(item.mainAreaCd) }} </p>
                          <p class="tag-item" :class="setTagName(item.subAreaCd, 'class')"> {{ setTagName(item.subAreaCd) }} </p>
                        </div>
                      </div>
                      <!--영어 발달-->
                      <div  v-if="item.bookDiv === 'E'" class="tag-wrap rounded size-small">
                        <div class="tag ar">
                          <p class="tag-item step" :class="setTagName(item.bookEngStep,'class')"> {{ setTagName(item.bookEngStep) }} </p>
                        </div>
                      </div>
                      <p class="book-title">{{setBookName(item)}}</p>
                      <p class="reading-count">{{item.readCount}}회 완독</p>
                    </div>
                  </div>
                  <div class="reading-status" :class="item.readCount !==0 ? 'comp' : 'ing' " ></div>
                </div>
              </template>
              <div  v-if="completedBookData === null || completedBookData.totalCount == 0 " class="list-box no-data" :class="{ hide : !todayBookData }">
                <div class="img"></div><p>읽은 책이 없어요.</p>
              </div>
            </div>
          </div>
        </template>
        <template v-slot:footer>
          <div></div>
        </template>
      </Modal>
    </div>
    <viewerModal :propsData="{ viewerInfo }" @openBookRun="openBookRun" @openViewerPopup="openViewerPopup" @closeViewerPopup="closeViewerPopup"></viewerModal>
    <complimentModal v-if="isComplimentModal" @closeComplimentPopup="closeComplimentPopup" style="z-index: 9999"></complimentModal>
  </div>
</template>

<script>
import Modal from '@/components/modal';
import readingClubFactory from "@/api/reading-club/readingClub-factory";
import {mapGetters} from "vuex";
import moment from "moment/moment";
import viewerModal from "@/components/launcher-readingclub/modals/model-viewer.vue";
import functionMixin from "@/common/mixin/functionMixin";
import viewerMixin from "@/common/mixin/viewerMixin";
import setDayTagMixin from "@/common/mixin/setDdayMixin";
import complimentModal from "@/components/launcher-readingclub/modals/parts/viewer-compliment-modal.vue";
const calenderInfo = readingClubFactory.get('readingActivity')

export default {
  mixins: [functionMixin , viewerMixin, setDayTagMixin],
  props: {
    propsData: {
      detailShowModal: Boolean,
    },
  },
  components: {
    complimentModal,
    viewerModal,
    Modal,
  },
  data() {
    return {
      viewerInfo : {
        isModal : false,
        modalType : 'type',
        modalData : {}
      },
      propDate: '', // 스케줄에서 가져온 날짜
      setDate: '', // 팝업에 보여주기 위해 포맷팅한 날짜
      //달력에서 클릭한 날짜 format해서 넣기
      year:'',
      month:'',
      day:'',
      todayBookData:[],//오늘의 책
      todayBookTry:[],//오늘의 책 독서중 여부
      completedBookData:[],//오늘 읽은 책,
      vscanBook:[], //vscanbook
      today: moment(),
      isNextMonth: false,
      isPrevMonth: false,
      todayReadingClass:'',
      isFuture: false,
      isReload:false,
      completedInfo : { // 칭찬팝업 관련
        engBookCnt: 0, //영어책 개수
        korBookCnt: 0, //한글책 개수
        readEngBookId: [], //완독 영어책
        readKorBookId: [], //완독 힌글책
      },
      isComplimentModal: false,
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    ...mapGetters('readingStatusStorage',['getPause']),
  },
  watch:{
    'propDate'(oldValue,newValue){
      if(oldValue !== newValue && newValue){
        this.checkDiffDate(this.propDate);
        this.formatData(this.propDate);
        this.getCalenderDetail();
      }
    },

  },
  methods: {
    closePopup() {
      this.$emit('closePopup');
    },
    //처음 모달창 진입 시 실행되는 함수
    isShow(date) {
      this.completedBookData=[];
      this.todayBookData=[];
      this.propDate = date;
      this.formatData(this.propDate)
      this.checkDiffDate(date);
      this.checkMonth();
      this.showDate();
      this.getCalenderDetail();
    },
    //화면에 날짜 보여ㅈ기
    showDate() {
      const currentDate = new Date(this.propDate);
      const days = ["일","월","화","수","목","금","토"];
      return this.setDate = `${currentDate.getMonth()+1}월 ${currentDate.getDate()}일 (${days[currentDate.getDay()]})`
    },
    //현재인지 미래인지 구분하기 => 미래일 경우 학습하기 불가하기
    checkDiffDate(date) {
      const diffDate = this.today.startOf('day').diff(date, 'days');

      if (diffDate > -1) {
        this.isFuture = false;
      } else {
        this.isFuture = true;
      }
    },
    //YYYY-MM-DD 형식 날짜 년,달,월로 바꿔주기
    formatData(fullCalendarDate) {
      const date = new Date(fullCalendarDate);

      this.year =  date.getFullYear().toString();
      this.month = (date.getMonth() + 1).toString().padStart(2, '0');
      this.day = date.getDate().toString().padStart(2, '0');
    },
    //달력상세 내용 가져오기
    getCalenderDetail() {
      const data = {
        studentId: this.userInfo.info.studentId,
        searchYear: this.year,
        searchMonth: this.month,
        searchDay: this.day
      }

      const getData = calenderInfo.getActivityCalendarDetail(data);
      getData.then((response) => {
        if (response.status == '200') {
          this.todayBookData = response.data.data.listTodayPlan;
          this.completedBookData = response.data.data.listToday;
          this.todayBookTry = response.data.data.listTodayReadingInfo;
          this.vscanBook = response.data.data.listScanBooks;
          this.checkReadBook(response.data.data.listTodayPlan);
        }
      }).catch((error) => {console.log(error)})
    },
    //오늘의 책 독서중 여부 확인하기
    setReadingTry(item) {
      let tryBook = this.todayBookTry.filter((el) => el.bookId === item.bookId);
      let status='';
      if(item.readCount > 0){
        status = 'comp';
      } else if(tryBook[0].readingCnt >=1 && item.readCount == 0) {
        status = 'ing';
      } else {
        status = 'before';
      }
      return status
    },
    //책 제목 앞 [태그] 넣어주기
    setBookName(item) {
      let name='';
      //오늘의 책이 아닐 때
      if(item.bookVerDiv === null){
        name = item.bookNm;
        return name
      }
      //오늘의 책일 때
      if(item.bookVerDiv !== null){
        //day가 없을 때
        if(item.bookVerDiv === ''){
          name = `[오늘의 책] ${item.bookNm}`
          return name
        }
        //day가 있을 때
        if(item.bookVerDiv === 'D1'){
          name = `[오늘의 책] ${item.bookNm} (Day 1) `
        } else name = `[오늘의 책] ${item.bookNm} (Day 2)`
      }
      return name
    },
    setTagName(item,isClass) {
      let tagName= '';
      if(item == 1) tagName = isClass ? 'sociality' : '사회성발달';
      if(item == 2) tagName = isClass ? 'language' : '언어발달';
      if(item == 3) tagName = isClass ? 'recognition' : '인지발달';
      if(item == 4) tagName =  isClass ? 'emotion' : '정서발달';
      if(item == 5) tagName = isClass ? 'creativity' : '창의사고력' ;

      if(item === 'B') tagName =  isClass ? 'basic' : 'Basic';
      if(item === 'I') tagName =  isClass ? 'intermediate' : 'Intermediate';
      if(item === 'A') tagName =  isClass ? 'advanced' : 'Advanced';
      return  tagName ;
    },
    setPreviousData() {
        this.propDate = moment(this.propDate).subtract('1', 'd').locale('ko').format('YYYY-MM-DD');
        this.checkMonth()
        this.showDate();
    },
    setNextData() {
        this.propDate = moment(this.propDate).add('1', 'd').locale('ko').format('YYYY-MM-DD');
        this.checkMonth()
        this.showDate();
    },
    //이전 학습이력 조회는 시작일 전 달까지만 확인 가능하도록 함
    checkMonth() {
      let year = this.propDate.split('-')[0]
      let month = this.propDate.split('-')[1]
      let day = this.propDate.split('-')[2]

      //이전버튼 유효기간 체크하기
      const startYear = moment(this.userInfo.info.learnStartDt).subtract(1,'month').format('YYYY')
      const startMonth = moment(this.userInfo.info.learnStartDt).subtract(1,'month').format('MM')

      if(year === startYear && month === startMonth && day == '01'){
        this.isPrevMonth = true
      }else {
        this.isPrevMonth = false
      }
      //다음버튼 유효기간 체크하기
      const date = new Date();
      let currentYear = date.getFullYear();
      let currentMonth = date.getMonth() + 1;
      //현재달 마지막 날 구하기
      let lastMonthDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
      //TODO: 현재달까지만 막아두었음 추후 다음달까지로 변경
      let diff = (currentMonth - month) + (12 * (currentYear - year));
      if ((diff <= 0 )&&(moment(lastMonthDay).format('DD') == day)) {
        this.isNextMonth = true
      } else {
        this.isNextMonth = false
      }
    },
    replaceDefault(e) {
      e.target.src = require('@/assets/img/launcher-readingclub/common/thumbnail_default.png')
    },
    //오늘의책 , 도서관 책, vscan책  구분하기
    setCompletedBookViewer(item,index) {
      let vscanBook = this.vscanBook?.filter((vscanBookId)=>vscanBookId.bookId == item.bookId)

      //vscan책 확인하기
      if(vscanBook && vscanBook[0] && item.bookVerDiv === null){
        let today = moment().format('YYYY-MM-DD');
        // vscan책 유효기간 확인
        if(moment(vscanBook[0].endDt).diff(moment(today),'days') >= 0){
          this.mixin_openBook({ 'path' : 'S', 'entry' : 'VScan', 'isBuy' : 'Y', 'index' : `${index}`, 'isCalenderVscan':'Y' },item)
        }
        return;
      }
      //오늘 읽은 책 중에서 오늘의 책인경우
      if(item.bookVerDiv !== null){
       this.mixin_openBook({ 'path' : 'T', 'entry':'TodayBook', 'index' : `${index}`},item);
       return;
      }
      // 오늘 읽은 책 중에서 도서관책인 경우
      if(item.bookVerDiv === null) {
        this.showViewer(item,index)
      }
    },
    //뷰어 오픈
    showViewer(item,index){
      if(item.bookDiv === 'K'){
        this.mixin_openBook({ 'path' : 'R', 'entry':'KoreanLibrary','index' : `${index}` }, item);
        return
      }
      if(item.bookDiv === 'E'){
        this.mixin_openBook({ 'path' : 'R', 'entry':'EnglishLibrary','index' : `${index}` }, item);
        return;
      }
    },
    openBookRun(type) {
      this.mixin_openBookRun(type);
    },
    openViewerPopup(info, item, type) {
      this.viewerInfo.modalData.info = info;
      this.viewerInfo.modalData.item = item;
      this.viewerInfo.modalType = type;
      this.viewerInfo.isModal = true;
    },
    closeViewerPopup() {
      this.viewerInfo.isModal = false;
      this.checkComplimentModal(this.viewerInfo.modalData.item.bookId);
        if(!this.isComplimentModal) {
          this.getCalenderDetail();
        }
      this.getCalenderDetail();
    },
    checkReadBook(res) {
      const data = {
        engBookCnt: 0,
        korBookCnt: 0,
        readEngBookId: [],
        readKorBookId: []
      };

      res.items.forEach(item => {
        if (item.bookDiv === 'E') {
          data.engBookCnt++;
          if (item.readCount > 0) data.readEngBookId.push(item.bookId);
        } else if (item.bookDiv === 'K') {
          data.korBookCnt++
          if (item.readCount > 0) data.readKorBookId.push(item.bookId);
        }
      });
      this.completedInfo = data;
    },
    /*칭찬모달 오픈여부*/
    openComplimentPopup() {
      if(this.viewerInfo.modalData.info.isRead) {
        if(this.viewerInfo.modalData.item.bookDiv === 'K') {
          //완료 독서에 없는 책일 때만 카운팅 해주기
          if (this.completedInfo.readKorBookId.indexOf(this.viewerInfo.modalData.item.bookId) === -1) {
            let readCnt = this.completedInfo.readKorBookId.length
            readCnt++
            if (readCnt === this.completedInfo.korBookCnt) {
              this.isComplimentModal = true;
            }
          }
        }
        if (this.viewerInfo.modalData.item.bookDiv === 'E') {
          //완료 독서에 없는 책일 때만 카운팅 해주기
          if (this.completedInfo.readEngBookId.indexOf(this.viewerInfo.modalData.item.bookId) === -1) {
            let readCnt = this.completedInfo.readEngBookId.length
            readCnt++
            if (readCnt === this.completedInfo.engBookCnt) {
              this.isComplimentModal = true;
            }
          }
        }

      }
    },
    checkComplimentModal(bookId) {
      //오늘날짜의 오늘의 책일 경우에만 칭찬 모달 열기
      const isTodayBook = this.todayBookData.items?.filter((el) => el.bookId == bookId).length;
      if((this.propDate == moment().format('YYYY-MM-DD')) && (isTodayBook > 0)) {
        this.openComplimentPopup();
      }
    },
    closeComplimentPopup() {
      this.isComplimentModal = false;
      this.getCalenderDetail();
    },
  },
}
</script>
