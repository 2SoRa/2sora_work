<template>
  <!-- div로 루트를 감싸주어야 warning이 안뜸 -->
  <div>
    <Modal v-if="propsData.modiShowModal" @close="closePopup" :title="title">
      <template v-slot:body>
        <!-- TODO: 선택학습시 choice 추가 -->
        <!-- TODO: 선택학습 적용시 주석 적용 -->
        <!--  :class="{ choice : propsData.eachItem ? propsData.eachItem.study_div == 'C' : getDetailList.studyPlans[propsData.getListId].study_div == 'C' }" -->
        <div class="modal-01 modal-reg-modi" :class="{ choice : this.subjectName == '슈퍼박스' }"> <!-- 슈퍼박스일때만 날짜선택 영역 보이게 설정 -->
          <div class="title">학습 계획 수정</div>
          <div class="content">
            <!-- TODO: 레벨1만 적용 해제시 .detail-course 제거, style 제거 -->
            <div class="schedule-info detail-course" style="padding-bottom:0;border-bottom:none;">
              <div>
                <div class="schedule-list-wrap">
                  <div class="study-info">
                    <p>{{ propsData.eachItem ? propsData.eachItem.study_course_nm : getDetailList.studyPlans[propsData.getListId].study_course_nm }}</p>
                  </div>
                  <!-- TODO: 강의명 넣어주기 -->
                  <p class="info">{{ propsData.eachItem ? '' : getDetailList.studyPlans[propsData.getListId].study_lecture_nm }}</p>
                </div>
                <div class="level-info" v-if="subjectName == '슈퍼박스'">{{ scheduleEachItem.level_nm }}</div> <!-- TODO: 슈퍼박스일때만 레벨1적용이 아닌 각 레벨에 대한 내용 가져오기 - 추후 v-select으로 바뀌면 로직 확인 후 삭제 -->
                <div class="level-info" v-else-if="selectedLevelNm != '없음'">{{ selectedLevelNm }}</div> <!-- TODO: 레벨1만 적용 해제시 삭제 -->
                <!-- TODO: 레벨1만 적용 해제시 주석 해제 -->
<!--                <div class="dropdown">
                  <v-select label="level_nm"
                            placeholder="선택"
                            :options="levelItem"
                            v-model="formData.selectedLevel"
                            :reduce="levelItem => levelItem.level_cd">
                    <template #open-indicator="{ attributes }">
                      <span v-bind="attributes"><img src="@/assets/img/launcher/schedule/schedule-popup/ttable_drdown_01_ico_down.png" alt="arrow"></span>
                    </template>
                  </v-select>
                </div>-->
              </div>
            </div>
            <div class="week-plan">
              <p class="info">학습계획 변경은 강좌별 월 2회만 가능합니다. 한글, 수학 학습은 최대 주 3회까지 학습할 수 있습니다.</p>
              <div class="table-wrap">
                <table>
                  <tr>
                    <th v-for="item in tableTitle" :key="item">{{ item }}</th>
                  </tr>
                  <tr>
                    <td>학습선택</td>
                    <td v-for="item in dayItems" :key="item">
                      <label class="checkbox">
                        <input type="checkbox" :value="item.id" v-model="formData.selectedDay"/>
                        <span class="checkmark"></span>
                      </label>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
            <div class="study-choice">
              <button v-if="this.subjectName != '슈퍼박스'" class="choice-data" @click="openStepPopup">{{ formData.selectedLectureSession }}강부터 {{ formData.endLectureSession }}강</button><span v-if="this.subjectName != '슈퍼박스'">을</span>
              <input type="date"
                     class="choice-data"
                     :data-placeholder="formData.selectedStartDate"
                     v-model="formData.selectedStartDate">부터
              <p class="choice-data">{{ formData.selectedEndDate }}</p>까지 학습합니다.
            </div>
            <div class="btn-wrap btn-wrap-01">
              <button class="btn btn-type-02-sec gray" @click="closePopup">취소</button>
              <!-- TODO: disable 추가시 비활성화 -->
              <button class="btn btn-type-02-sec disable btnModi" @click="openCompletePopup()">수정</button>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <div></div>
      </template>
    </Modal>
    <stepModal ref="scriptStep" :propsData="{stepShowModal}" @closePopup="closeStepPopup"></stepModal>
    <completeModal :propsData="{completeShowModal, modiShowModal}" @closePopup="closeCompletePopup" @getScheduleList="getScheduleList"></completeModal>
    <confirmModal :propsData="{confirmShowModal, message}" @closePopup="closeConfirmPopup"></confirmModal>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import Modal from '@/components/modal';
import stepModal from './schedule-step-choice-modi-popup'
import completeModal from './schedule-alert-complete-popup'
import confirmModal from './comfirm-popup'
import learningFactory from '@/api/learning-factory';

const schedule = learningFactory.get('scheduleCode');

export default {
  props: {
    propsData: {
      modiShowModal: Boolean,
      getDetailData: Array,
      getListId: String,
      eachItem: Object, // 등록페이지에서 수정시 각 강의 가져오기
      regDate: String,
    },
  },
  data() {
    return {
      title: '',
      stepShowModal: false,
      completeShowModal: false,
      modiShowModal: false,
      confirmShowModal: false,

      message: '',
      totalModiCount: 0,
      itemDayLength: 0,

      subjectCode: '',
      subjectName: '',
      scheduleEachItem: {}, // 시간표에서 들어온 각 아이템

      formData: {
        selectedLevel: null,
        selectedDay: [],
        courseInfo: {},
        selectedStartDate: '',
        selectedEndDate: '',
        startLectureSession: '',
        endLectureSession: '',
        lectureInfoByDay: {},
        selectedLectureId: '',
        selectedLectureSession: '',
      },
      levelItem: [],
      tableTitle: ['요일', '월', '화', '수', '목', '금'],
      dayItems: [
        {
          name: '월',
          id: '월',
        },
        {
          name: '화',
          id: '화',
        },
        {
          name: '수',
          id: '수',
        },
        {
          name: '목',
          id: '목',
        },
        {
          name: '금',
          id: '금',
        },
      ],

      // TODO: 레벨1만 적용 해제시 삭제
      selectedLevelNm: '',
    }
  },
  components: {
    Modal,
    stepModal,
    completeModal,
    confirmModal,
  },
  watch: {
    'formData.selectedLevel'() {
      this.getCourseId();

      if (this.propsData.modiShowModal) {
        this.checkActiveModiBtn();
      }
    },
    'formData.selectedStartDate'() {
      // 슈퍼박스에서 요일 변경시 종료날짜 출력
      if (this.subjectName == '슈퍼박스' && this.formData.selectedDay.length != 0 && this.formData.selectedStartDate.length != 0) {
        this.getLectureByDay();
      }

      if (this.propsData.modiShowModal) {
        this.checkActiveModiBtn();

        if (this.formData.selectedStartDate.length == 0) {
          this.formData.selectedEndDate = '';
          this.formData.startLectureSession = '';
          this.formData.endLectureSession = '';
        }
      }

    },
    'formData.selectedDay'() {
      // 슈퍼박스에서 요일 변경시 종료날짜 출력
      if (this.subjectName == '슈퍼박스' && this.formData.selectedDay.length != 0 && this.formData.selectedStartDate.length != 0) {
        this.getLectureByDay();
      }

      if (this.formData.selectedDay.length != 0) {
        // TODO: 선택학습 적용시 주석 적용
        /*if (this.propsData.eachItem.study_div == 'C') {
          if (this.formData.selectedLevel == null) {
            this.message = '레벨을 선택해 주세요.';
            this.formData.selectedDay = [];
            this.openConfirmPopup();
            return;
          }
          this.getLectureByDay();
        }*/
      } else {
        // this.formData.selectedStartDate = this.propsData.regDate;
        this.formData.selectedEndDate = '';
        this.formData.startLectureSession = '';
        this.formData.endLectureSession = '';
      }

      if (this.propsData.modiShowModal) {
        this.checkActiveModiBtn();
      }

      // 강좌 한글,수학은 요일 최대 3회로 제한
      if ((this.subjectCode == 1 && this.formData.selectedDay.length > 3 && this.itemDayLength < 4) || (this.subjectCode == 2 && this.formData.selectedDay.length > 3 && this.itemDayLength < 4)) {
        this.formData.selectedDay.splice(-1, 1);
      }
      // TODO: 한글,수학에서 이미 4개 이상으로 요일이 들어왔을 때 네개부터는 체크되지 않게 처리해달라는 요청 오면 아래 코드에서 디벨롭 필요
      /*if (this.itemDayLength > 3) {
        console.log('dd22', this.formData.selectedDay.length, this.itemDayLength)

        /!*if (this.formData.selectedDay.length <= 3) {
          this.formData.selectedDay.splice(-1, 1);
          console.log('dd', this.formData.selectedDay.length, this.itemDayLength)
        } else {
          console.log('dd22', this.formData.selectedDay.length, this.itemDayLength)
        }*!/
      } else if ((this.subjectCode == 1 && this.formData.selectedDay.length > 3 && this.itemDayLength > 3) || (this.subjectCode == 2 && this.formData.selectedDay.length > 3 && this.itemDayLength > 3)) {
        console.log('aa')
        this.formData.selectedDay.splice(-1, 1);
      }*/
    },
  },
  computed: {
    ...mapGetters('scheduleStorage', ['getDetailList']),
    ...mapGetters(['userInfo']),
  },
  created() {
    this.formData.selectedStartDate = this.propsData.regDate;
  },
  methods: {
    show(item, studyPlanHistsItem) {
      this.scheduleEachItem = item;

      this.subjectCode = item.subj_cd;
      this.subjectName = item.subj_nm;

      if (item.study_dayweek) {
        if (item.study_dayweek.indexOf('토') != -1 || item.study_dayweek.indexOf('일') != -1 || (item.study_dayweek.indexOf('토') != -1 && item.study_dayweek.indexOf('일') != -1)) {
          this.formData.selectedDay = [];
        }
        if (item.study_dayweek.indexOf('월') != -1) {
          this.formData.selectedDay.push('월');
        }
        if (item.study_dayweek.indexOf('화') != -1) {
          this.formData.selectedDay.push('화');
        }
        if (item.study_dayweek.indexOf('수') != -1) {
          this.formData.selectedDay.push('수');
        }
        if (item.study_dayweek.indexOf('목') != -1) {
          this.formData.selectedDay.push('목');
        }
        if (item.study_dayweek.indexOf('금') != -1) {
          this.formData.selectedDay.push('금');
        }
      } else {
        this.formData.selectedDay = [];
      }

      this.itemDayLength = this.formData.selectedDay.length;

      if (item.study_plan_dt) {
        this.formData.selectedStartDate = item.study_plan_dt;
      }

      if (item.subj_nm == '슈퍼박스') {
        this.getLectureByDay();
      }

      const data = {
        prog_cd: item.prog_cd,
      }

      const level = schedule.loadLevelByProg(data);
      level.then((res) => {
        if (res.status == 200) {
          const data = res.data.data.result;

          // TODO: 레벨1만 적용 해제시 삭제
          let countNone = 0;
          data.forEach((el) => {
            if (el.level_nm == '없음') { // '없음'항목이 있는 경우 계산 = 영어(스토리)는 레벨이 '없음,stepA~'가 들어간다.
              countNone++;
            }
          });
          if (countNone >= 1 && data.length > 1 && item.level_nm != '없음') {
            this.levelItem.push(data[1]);
          } else {
            this.levelItem.push(data[0]);
          }
          this.formData.selectedLevel = this.levelItem[0].level_cd;
          this.selectedLevelNm = this.levelItem[0].level_nm;

          // this.levelItem = data; // TODO: 모든 레벨이 나오도록 픽스되면 아래 코드만 적용

          // 월 2회만 수정 가능
          this.totalModiCount = 0;
          if (studyPlanHistsItem) { // 등록페이지에서 수정이력 가져오기
            studyPlanHistsItem.forEach((el) => {
              if (el.study_course_id == item.study_course_id) {
                this.totalModiCount = el.total;
              }
            });
          } else { // 달력에서 수정이력 가져오기
            this.getDetailList.studyPlanHists?.forEach((el) => {
              if (el.study_course_id == item.study_course_id) {
                this.totalModiCount = el.total;
              }
            });
          }
        }
      }).catch((error) => {
        console.log(error);
      });
    },
    getCourseId() {
      let data = {};
      if (!this.propsData.eachItem) { // 스케쥴에서 들어왔을때
        data = {
          study_course_nm : this.getDetailList.studyPlans[this.propsData.getListId].study_course_nm,
          subj_cd : this.getDetailList.studyPlans[this.propsData.getListId].subj_cd,
          prog_cd : this.getDetailList.studyPlans[this.propsData.getListId].prog_cd,
          course_level_cd : this.formData.selectedLevel,
        }
      } else { // 등록페이지에서 들어왔을 때
        data = {
          study_course_nm : this.propsData.eachItem.study_course_nm,
          subj_cd : this.propsData.eachItem.subj_cd,
          prog_cd : this.propsData.eachItem.prog_cd,
          course_level_cd : this.formData.selectedLevel,
        }
      }

      let list = '';

      let isChoiceByReg = false;
      let isChoiceBySchedule = false;
      if (this.propsData.eachItem) {
        isChoiceByReg = false;
        // TODO: 선택학습 적용시 주석 적용
        /*if (this.propsData.eachItem.study_div == 'C') {
          isChoiceByReg = true;
        } else {
          isChoiceByReg = false;
        }*/
      } else {
        isChoiceBySchedule = false;
        // TODO: 선택학습 적용시 주석 적용
        /*if (this.getDetailList.studyPlans[this.propsData.getListId].study_div == 'C') {
          isChoiceBySchedule = true;
        } else {
          isChoiceBySchedule = false;
        }*/
      }
      if (isChoiceByReg || isChoiceBySchedule) {
        list = schedule.getCourseByLevelChoice(data);
      } else if (!isChoiceByReg || !isChoiceBySchedule) {
        list = schedule.getCourseByLevel(data);
      }

      list.then((res) => {
        if (res.status == 200) {
          const data = res.data.data;
          this.formData.courseInfo = data.result;
        }
      }).catch((error) => {
        console.log(error)
      });
    },
    // 선택값 초기화
    resetSelectedValue() {
      this.formData.selectedLevel = null;
      this.formData.selectedDay = [];
      this.formData.selectedLectureId = '';
      this.formData.selectedLectureSession = '';
      this.levelItem = [];
    },
    closePopup() {
      this.resetSelectedValue();
      this.$emit('closePopup');
    },
    // 차시선택 팝업 열기
    openStepPopup() {
      if (this.formData.selectedDay.length == 0) {
        this.message = '요일을 선택해 주세요.';
        this.openConfirmPopup();
        return;
      }
      if (this.propsData.eachItem) {
        this.$refs.scriptStep.show(this.propsData.eachItem);
      } else {
        this.$refs.scriptStep.show(this.getDetailList.studyPlans[this.propsData.getListId]);
      }

      this.stepShowModal = true;
      // this.closePopup();
      document.querySelector('body').style.overflow = 'hidden';
    },
    // 차시선택 팝업 닫기
    closeStepPopup(selectedStep) {
      this.formData.selectedLectureId = '';
      if (selectedStep) {
        this.formData.selectedLectureId = selectedStep.study_lecture_id;
        this.formData.selectedLectureSession = selectedStep.lecture_session;
      }
      this.stepShowModal = false;
      // document.querySelector('body').style.overflow = 'auto';
    },
    // 완료팝업 열기 (수정하기)
    openCompletePopup() {
      // 월 2회 수정했으면 수정 못하도록 막기
      if (this.totalModiCount != null) {
        if (this.totalModiCount >= 2) {
          this.message = '학습계획 변경은 월 2회만 가능합니다.'
          this.openConfirmPopup();
          return;
        }
      }

      // 강좌 한글,수학은 요일 최대 3회로 제한
      if ((this.subjectCode == 1 && this.formData.selectedDay.length > 3) || (this.subjectCode == 2 && this.formData.selectedDay.length > 3)) {
        this.message = '한글, 수학 학습은 최대 주 3회까지 학습할 수 있습니다.'
        this.openConfirmPopup();
        return;
      }

      let studyCourseId = '';
      let studyDayWeek = '';
      let startDate = '';
      let studyLectureId = '';

      // 요일 순서대로 정렬하기
      const weekDaySort = { '월': 1, '화': 2, '수': 3, '목': 4, '금': 5, '토': 6, '일': 7 }
      this.formData.selectedDay.sort(function sortByWeekDay(a, b) {
        return weekDaySort[a] - weekDaySort[b];
      });

      if (this.propsData.eachItem) { // 등록페이지에서
        studyDayWeek = this.formData.selectedDay;
        startDate = this.formData.selectedStartDate;
        studyLectureId = this.formData.selectedLectureId;
        if (this.formData.courseInfo) {
          studyCourseId = this.formData.courseInfo.study_course_id;
        } else {
          studyCourseId = this.propsData.eachItem.study_course_id;
        }
      } else { // 시간표에서
        /*studyDayWeek = this.formData.selectedDay;
        startDate = this.getDetailList.studyPlans[this.propsData.getListId].study_plan_dt;
        if (this.getDetailList.studyPlans[this.propsData.getListId].study_div == 'C') {
          studyLectureId = this.formData.selectedLectureId;
        } else {
          studyLectureId = this.getDetailList.studyPlans[this.propsData.getListId].study_lecture_id;
        }
        if (this.formData.courseInfo) {
          studyCourseId = this.formData.courseInfo.study_course_id;
        } else {
          studyCourseId = this.getDetailList.studyPlans[this.propsData.getListId].study_course_id;
        }*/
        studyDayWeek = this.formData.selectedDay;
        startDate = this.formData.selectedStartDate;
        studyLectureId = this.scheduleEachItem.study_lecture_id;
        studyCourseId = this.scheduleEachItem.study_course_id;
      }

      const data = {
        student_id: this.userInfo.info.studentId,
        study_course_id: studyCourseId,
        study_dayweek: studyDayWeek,
        start_dt: startDate,
        study_lecture_id: studyLectureId,
      }

      const list = schedule.updateDefaultSchedule(data);
      list.then((res) => {
        if (res.status == 200) {
          if (res.data.data.result == 'Y') {
            this.modiShowModal = true;
            this.completeShowModal = true;
            this.closePopup();
            document.querySelector('body').style.overflow = 'auto';
          } else {
            alert('수정에 실패했습니다.');
          }
        }
      }).catch((error) => {
        console.log(error)
      });
    },
    // 완료팝업 닫기
    closeCompletePopup() {
      this.completeShowModal = false;
      this.deleteShowModal = false;
      this.regShowModal = false;
      this.modiShowModal = false;
      document.querySelector('body').style.overflow = 'auto';
    },
    // 팝업
    // 알럿팝업 열기
    openConfirmPopup() {
      this.confirmShowModal = true;
      document.querySelector('body').style.overflow = 'hidden';
    },
    //  알럿팝업 닫기
    closeConfirmPopup() {
      this.confirmShowModal = false;
      document.querySelector('body').style.overflow = 'auto';
    },
    // 부모 컴포넌트의 스케쥴 리스트 불러오기
    getScheduleList() {
      this.$emit('getScheduleList');
    },
    // 수정버튼 활성화
    checkActiveModiBtn() {
      const btnModi = document.querySelector('.btnModi');

      if (this.formData.selectedLevel != null && this.formData.selectedDay.length != 0 && this.formData.selectedStartDate.length != 0) {
        btnModi.classList.remove('disable');
      } else {
        btnModi.classList.add('disable');
      }
    },
    // 요일 선택시 강의 및 날짜 전달하기
    getLectureByDay() {
      let studyCourseID = '';
      let studyDayWeek = [];
      let startDate = [];
      let studyLectureId = [];

      if (this.propsData.eachItem) { // 등록페이지에서 계획수정을 들어온 경우
        studyCourseID = this.propsData.eachItem.study_course_id;
        studyDayWeek = this.formData.selectedDay;
        startDate = this.formData.selectedStartDate;
        studyLectureId = this.formData.selectedLectureId;
      } else { // 학습시간표에서 계획수정을 들어온 경우
        /*studyCourseID = this.getDetailList.studyPlans[this.propsData.getListId].study_course_id;
        studyDayWeek = this.formData.selectedDay;
        startDate = this.getDetailList.studyPlans[this.propsData.getListId].study_plan_dt;
        studyLectureId = this.getDetailList.studyPlans[this.propsData.getListId].study_lecture_id;*/
        studyCourseID = this.scheduleEachItem.study_course_id;
        studyDayWeek = this.formData.selectedDay;
        startDate = this.formData.selectedStartDate;
        studyLectureId = this.scheduleEachItem.study_lecture_id;
      }

      const data = {
        student_id : this.userInfo.info.studentId,
        study_course_id : studyCourseID,
        study_dayweek : studyDayWeek,
        start_dt : startDate,
        study_lecture_id : studyLectureId
      }

      const list = schedule.getLectureByDay(data);

      list.then((res) => {
        if (res.status == 200) {
          const data = res.data.data;
          this.formData.lectureInfoByDay = data.result;
          // this.formData.selectedStartDate = this.formData.lectureInfoByDay.start_dt;
          this.formData.selectedEndDate = this.formData.lectureInfoByDay.end_dt;
          this.formData.startLectureSession = this.formData.lectureInfoByDay.start_lecture_session;
          this.formData.endLectureSession = this.formData.lectureInfoByDay.end_lecture_session;

          this.formData.selectedLectureId = this.formData.startLectureSession;
        }
      }).catch((error) => {
        console.log(error)
      });
    },
  },

}
</script>

<style>
@import url('@/assets/css/launcher/modal/schedule-reg-modi.css');
.hidden {
  display: none;
}
</style>