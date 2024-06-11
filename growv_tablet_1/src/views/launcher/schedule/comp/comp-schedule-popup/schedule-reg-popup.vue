<template>
  <!-- div로 루트를 감싸주어야 warning이 안뜸 -->
  <div>
    <Modal v-if="propsData.regShowModal" @close="closePopup" title="등록하기">
      <template v-slot:body>
        <!-- TODO: 선택학습 적용시 주석 해제 -->
        <!--  :class="{ choice : getRegCourseItem.study_div == 'C' }" -->
        <div class="modal-01 modal-reg-modi">
          <div class="title">계획 등록</div>
          <div class="content">
            <!-- TODO: 레벨1만 적용 해제시 .detail-course 제거, style 제거 -->
            <div class="schedule-info detail-course" style="padding-bottom:0;border-bottom:none;">
              <div>
                <div class="schedule-list-wrap">
                  <div class="study-info">
                    <p>{{ getRegCourseItem.prog_nm }}</p>
                  </div>
                  <!-- TODO: 강의명 넣어주기 -->
                  <p class="info">{{ getRegCourseItem.study_course_nm }}</p>
                </div>
                <div class="level-info">{{ selectedLevelNm }}</div> <!-- TODO: 레벨1만 적용 해제시 삭제 -->
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
              <p class="info">선택한 요일에 1회차씩 공부합니다.</p>
              <!-- TODO: 선택학습 적용시 주석 해제 -->
<!--              <p class="info" v-if="getRegCourseItem.study_div != 'C'">선택한 요일에 1회차씩 공부합니다.</p>
              <p class="info choice" v-if="getRegCourseItem.study_div == 'C'">총 {{ getRegCourseItem.lectureCnt }}회차</p>-->
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
              <button class="choice-data" @click="openStepPopup">{{ formData.selectedLectureSession }}강부터 {{ getRegCourseItem.lectureCnt }}강</button>을
              <input type="date"
                     class="choice-data"
                     :data-placeholder="formData.selectedStartDate"
                     v-model="formData.selectedStartDate"
                     required
                     aria-required="true">부터
              <p class="choice-data">{{ formData.selectedEndDate }}</p>까지 학습합니다.
            </div>
            <div class="btn-wrap btn-wrap-01">
              <button class="btn btn-type-02-sec gray" @click="closePopup">취소</button>
              <button class="btn btn-type-02-sec disable btnReg" @click="register()">계획등록</button>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <div></div>
      </template>
    </Modal>
    <stepModal ref="scriptStep" :propsData="{stepShowModal}" @closePopup="closeStepPopup"></stepModal>
    <completeModal :propsData="{completeShowModal, regShowModal}" @closePopup="closeCompletePopup" @getScheduleList="getScheduleList"></completeModal>
    <confirmModal :propsData="{confirmShowModal, message}" @closePopup="closeConfirmPopup"></confirmModal>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import Modal from '@/components/modal';
import stepModal from './schedule-step-choice-popup'
import completeModal from './schedule-alert-complete-popup'
import confirmModal from './comfirm-popup'
import learningFactory from '@/api/learning-factory';

const schedule = learningFactory.get('scheduleCode');

export default {
  props: {
    propsData: {
      regShowModal: Boolean,
      regDate: String,
    },
  },
  data() {
    return {
      title: '',
      stepShowModal: false,
      completeShowModal: false,
      regShowModal: false,
      confirmShowModal: false,

      message: '',
      subjectCode: '',

      formData: {
        selectedLevel: null,
        selectedDay: [],
        courseInfo: {},
        selectedLectureId: '',
        selectedLectureSession: '1',
        selectedStartDate: '',
        selectedEndDate: '',
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
      if (this.propsData.regShowModal) {
        this.getCourseId();
        this.checkActiveRegBtn();
      }
    },
    'formData.selectedDay'() {
      if (this.formData.selectedDay.length != 0) {
        // TODO: 선택학습 적용시 주석 해제
        /*if (this.getRegCourseItem.study_div == 'C') {
          if (this.formData.selectedLevel == null) {
            this.message = '레벨을 선택해 주세요.';
            this.formData.selectedDay = [];
            this.openConfirmPopup();
            return;
          }
          this.getLectureByDay();
        }*/
      } else {
        this.formData.selectedEndDate = '';
      }

      if (this.propsData.regShowModal) {
        this.checkActiveRegBtn();
      }

      // 강좌 한글,수학은 요일 최대 3회로 제한
      if ((this.subjectCode == 1 && this.formData.selectedDay.length > 3) || (this.subjectCode == 2 && this.formData.selectedDay.length > 3)) {
        this.formData.selectedDay.splice(-1, 1);
      }
    },
  },
  computed: {
    ...mapGetters('scheduleStorage', ['getRegCourseItem']),
    ...mapGetters(['userInfo']),
  },
  created() {
    this.formData.selectedStartDate = this.propsData.regDate;
  },
  methods: {
    show(item) {
      this.subjectCode = item.subj_cd
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
        }
      }).catch((error) => {
        console.log(error);
      });
    },
    // 선택값 초기화
    resetSelectedValue() {
      this.formData.selectedLevel = null;
      this.formData.selectedDay = [];
      this.formData.selectedLectureId = '';
      this.formData.selectedLectureSession = '1';
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

      this.$refs.scriptStep.show(this.getRegCourseItem);

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
    // 완료팝업 열기
    openCompletePopup() {
      this.regShowModal = true;
      this.completeShowModal = true;
      this.closePopup();
      document.querySelector('body').style.overflow = 'auto';
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
    // 등록버튼 활성화
    checkActiveRegBtn() {
      const btnReg = document.querySelector('.btnReg');

      if (this.formData.selectedLevel != null && this.formData.selectedDay.length != 0) {
        btnReg.classList.remove('disable');
      } else {
        btnReg.classList.add('disable');
      }
    },
    // 기본,선택 학습강좌 레벨 선택시 강좌아이디 전달하기
    getCourseId() {
      const data = {
        study_course_nm : this.getRegCourseItem.study_course_nm,
        subj_cd : this.getRegCourseItem.subj_cd,
        prog_cd : this.getRegCourseItem.prog_cd,
        course_level_cd : this.formData.selectedLevel,
      }

      let list = '';

      list = schedule.getCourseByLevel(data);
      // TODO: 선택학습 적용시 주석 해제
      /*if (this.getRegCourseItem.study_div == 'C') { // 선택학습
        list = schedule.getCourseByLevelChoice(data);
      } else { // 기본학습
        list = schedule.getCourseByLevel(data);
      }*/

      list.then((res) => {
        if (res.status == 200) {
          const data = res.data.data;
          this.formData.courseInfo = data.result;
        }
      }).catch((error) => {
        console.log(error)
      });
    },

    // 계획 등록 전 중복계획 체크
    register() {
      let studyCourseId = '';
      if (this.formData.courseInfo) {
        studyCourseId = this.formData.courseInfo.study_course_id;
      } else {
        studyCourseId = this.getRegCourseItem.study_course_id;
      }

      const data = {
        student_id : this.userInfo.info.studentId,
        study_course_id : studyCourseId,
        study_dayweek : this.formData.selectedDay,
        start_dt : this.formData.selectedStartDate,
        study_lecture_id : this.formData.selectedLectureId,
      }

      const list = schedule.preCheckRegister(data);

      list.then((res) => {
        if (res.status == 200) {
          if (res.data.data.result == 'Y') {
            const reg = schedule.register(data);

            reg.then((res) => {
              if (res.status == 200) {
                this.openCompletePopup();
              }
            }).catch((error) => {
              console.log(error)
            });
          } else {
            alert('동일한 강좌가 시간표에 존재하여 등록이 불가합니다.');
          }
        }
      }).catch((error) => {
        console.log(error)
      });
    },
    // 요일 선택시 강의 및 날짜 전달하기
    getLectureByDay() {
      let studyCourseId = '';
      if (this.formData.courseInfo) {
        studyCourseId = this.formData.courseInfo.study_course_id;
      } else {
        studyCourseId = this.getRegCourseItem.study_course_id;
      }

      const data = {
        student_id : this.userInfo.info.studentId,
        study_course_id : studyCourseId,
        study_dayweek : this.formData.selectedDay,
        start_dt : this.formData.selectedStartDate,
        study_lecture_id : this.formData.selectedLectureId,
      }

      const list = schedule.getLectureByDay(data);

      list.then((res) => {
        if (res.status == 200) {
          this.formData.selectedEndDate = res.data.data.result.end_dt;
        }
      }).catch((error) => {
        console.log(error)
      });
    },
  }
}
</script>

<style>
@import url('@/assets/css/launcher/modal/schedule-reg-modi.css');
</style>