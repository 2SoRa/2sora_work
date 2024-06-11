<template>
  <div>
    <Modal v-if="propsData.applyShowModal">
      <template v-slot:body>
        <div class="modal-01 modal-reg-modi superbox-pop choice">
          <div class="title">북 큐레이션 구독</div>
          <div class="content">
            <div class="schedule-info detail-course">
              <div>
                <div class="schedule-list-wrap">
                  <div class="study-info">
                    <p>{{ propsData.curatorInfo.study_course_nm }} ({{ propsData.curatorInfo.lecture_cnt }}권)</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="week-plan">
              <div class="table-wrap">
                <table>
                  <tr>
                    <th v-for="item in tableTitle" :key="item">{{ item }}</th>
                  </tr>
                  <tr>
                    <td>학습 선택</td>
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
              <input type="date"
                     class="choice-data"
                     :data-placeholder="formData.selectedStartDate"
                     v-model="formData.selectedStartDate"
                     :min="today"
                     required
                     aria-required="true">부터
              <p class="choice-data">{{ formData.selectedEndDate }}</p>까지 학습합니다.
            </div>
            <div class="btn-wrap btn-wrap-01">
              <button class="btn btn-type-02-sec gray" @click="closePopup">취소</button>
              <button class="btn btn-type-02-sec btnReg" :class="{ disable : formData.selectedStartDate == '' || formData.selectedDay.length == 0 }" @click="register()">신청</button>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <div></div>
      </template>
    </Modal>
    <alertModal :propsData="{alertShowModal, message}" @closePopup="closeAlertPopup"></alertModal>
    <confirmModal :propsData="{confirmShowModal, regData}" @closePopup="closeConfirmPopup" @loadSubList="loadSubList" @closeApplyPopup="closePopup"></confirmModal>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import Modal from '@/components/modal';
import alertModal from './alert-popup'
import confirmModal from './superbox-apply-new-confirm-popup'
import learningFactory from '@/api/learning-factory';

const scheduleCode = learningFactory.get('scheduleCode');

export default {
  props: {
    propsData: {
      applyShowModal: Boolean,
      curatorInfo: Object,
    },
  },
  data() {
    return {
      alertShowModal: false,
      confirmShowModal: false,
      message: '',
      regData: {},

      formData: {
        courseId: '',
        selectedDay: [],
        selectedStartDate: '',
        selectedEndDate: '',
        selectedBooks: [],
        superBoxCnt: '',
      },

      today: '',

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
    }
  },
  components: {
    Modal,
    alertModal,
    confirmModal,
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  watch: {
    'formData.selectedDay'() {
      this.setEndDate();
      this.resetEndDate();
    },
    'formData.selectedStartDate'() {
      this.setEndDate();
      this.resetEndDate();
    },
  },
  methods: {
    show(id, selectedBooks) {
      this.formData.courseId = id;
      this.formData.selectedBooks = selectedBooks;
      this.setCurrentDate();
    },
    closePopup() {
      this.resetForm();
      this.$emit('closePopup');
    },
    loadSubList() {
      this.$emit('loadSubList');
    },
    resetForm() {
      this.formData.selectedDay = [];
      this.formData.selectedStartDate = '';
      this.formData.selectedEndDate = '';
    },
    setCurrentDate() {
      const moment = require('moment');
      let today = moment().format('YYYY-MM-DD');

      this.today = today;
      this.formData.selectedStartDate = today;
    },
    resetEndDate() {
      if (this.formData.selectedDay.length == 0 || this.formData.selectedStartDate.length == 0) {
        this.formData.selectedEndDate = '';
      }
    },

    // 알럿팝업 열기
    openAlertPopup() {
      this.alertShowModal = true;
      document.querySelector('body').style.overflow = 'hidden';
    },
    // 알럿팝업 닫기
    closeAlertPopup() {
      this.alertShowModal = false;
      document.querySelector('body').style.overflow = 'auto';
    },
    // 컨펌팝업 열기
    openConfirmPopup() {
      this.confirmShowModal = true;
      document.querySelector('body').style.overflow = 'hidden';
    },
    // 컨펌팝업 닫기
    closeConfirmPopup() {
      this.confirmShowModal = false;
      document.querySelector('body').style.overflow = 'auto';
    },

    // 슈퍼박스 계획 종료일 구하기
    setEndDate() {
      if (this.formData.selectedDay.length != 0 && this.formData.selectedStartDate.length != 0) {
        const setStringBooks = this.formData.selectedBooks.join();
        const setStringDays = this.formData.selectedDay.join();

        const data = {
          student_id : this.userInfo.info.studentId,
          study_course_id : this.propsData.curatorInfo.study_course_id,
          study_dayweek: setStringDays,
          start_dt: this.formData.selectedStartDate,
          check_value: setStringBooks,
        }

        const list = scheduleCode.getLectureByDay(data);
        list.then((res) => {
          if (res.status == 200) {
            const result = res.data.data.result;
            this.formData.selectedEndDate = result.end_dt;
            this.formData.superBoxCnt = result.superboxPlanCnt;
          }
        }).catch((error) => {
          console.log(error);
        });
      }
    },

    // 슈퍼박스 계획잡기
    register() {
      // 요일 순서대로 정렬하기
      const weekDaySort = { '월': 1, '화': 2, '수': 3, '목': 4, '금': 5, '토': 6, '일': 7 }
      this.formData.selectedDay.sort(function sortByWeekDay(a, b) {
        return weekDaySort[a] - weekDaySort[b];
      });

      const setStringBooks = this.formData.selectedBooks.join();
      const setStringDays = this.formData.selectedDay.join();

      const data = {
        student_id : this.userInfo.info.studentId,
        study_course_id : this.propsData.curatorInfo.study_course_id,
        study_dayweek: setStringDays,
        start_dt: this.formData.selectedStartDate,
        check_value: setStringBooks,
      }

      if (this.formData.superBoxCnt > 0) {
        // this.message = `구독중인 큐레이션을 취소하고 <br> 새로 신청하시겠습니까?`;
        this.regData = data;
        this.openConfirmPopup();
        return;
      }

      const list = scheduleCode.preCheckRegister(data);
      list.then((res) => {
        if (res.status == 200) {
          const result = res.data.data;
          if (result.result == 'Y') {
            const reg = scheduleCode.register(data);

            reg.then((res) => {
              if (res.status == 200) {
                this.message = '북 큐레이션 구독이 신청되었습니다.';
                this.closePopup();
                this.openAlertPopup();
                this.loadSubList();
              }
            }).catch((error) => {
              console.log(error)
              this.message = '북 큐레이션 구독에 실패하였습니다.';
              this.openAlertPopup();
            });
          } else {
            this.message = '이미 등록되어져 있는 큐레이션입니다.';
            this.openAlertPopup();
          }
        }
      }).catch((error) => {
        console.log(error);
      });
    },
  }
}
</script>

<style>
@import url('@/assets/css/launcher/modal/schedule-reg-modi.css');
</style>