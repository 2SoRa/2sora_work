<template>
  <!-- div로 루트를 감싸주어야 warning이 안뜸 -->
  <div>
    <Modal v-if="propsData.deleteShowModal" @close="closePopup" :title="title">
      <template v-slot:body>
        <div class="modal-02">
          <p class="txt-guide">
            오늘 이후 계획을<br> 모두 삭제하겠습니까?
          </p>
          <div class="btn-wrap">
            <button class="btn btn-type-03-sec gray" @click="closePopup">취소</button>
            <button class="btn btn-type-03-sec" @click="openCompletePopup">확인</button>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <div>
        </div>
      </template>
    </Modal>
    <completeModal :propsData="{completeShowModal, deleteShowModal}" @closePopup="closeCompletePopup" @getScheduleList="getScheduleList"></completeModal>
    <confirmModal :propsData="{confirmShowModal, message}" @closePopup="closeConfirmPopup"></confirmModal>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import Modal from '@/components/modal';
import completeModal from './schedule-alert-complete-popup'
import confirmModal from './comfirm-popup'

import learningFactory from '@/api/learning-factory';

const schedule = learningFactory.get('scheduleCode');

export default {
  props: {
    propsData: {
      deleteShowModal: Boolean,
      getListId: String, // 시간표 상세팝업에서 가져오는 각 강의 아이디
      eachItem: Object, // 등록페이지에서 가져오는 강좌아이템
    },
  },
  data() {
    return {
      title: '',
      completeShowModal: false,
      deleteShowModal: false,
      confirmShowModal: false,

      message: '',
    }
  },
  components: {
    Modal,
    completeModal,
    confirmModal,
  },
  computed: {
    ...mapGetters('scheduleStorage', ['getDetailList']),
    ...mapGetters(['userInfo']),
  },
  methods: {
    closePopup() {
      this.$emit('closePopup');
    },
    // 완료팝업 열기
    openCompletePopup() {
      let stuId = '';
      let stuCourseId = '';

      if (this.propsData.eachItem) { // 등록페이지에서 계획 삭제시
        stuId = this.userInfo.info.studentId;
        stuCourseId = this.propsData.eachItem.study_course_id;
      } else { // 학습시간표 상세팝업에서 계획 삭제시
        stuId = this.getDetailList.studyPlans[this.propsData.getListId].student_id;
        stuCourseId = this.getDetailList.studyPlans[this.propsData.getListId].study_course_id;
      }
      const student_id = stuId;
      const study_course_id = stuCourseId;

      // 삭제처리
      const list = schedule.delete(student_id, study_course_id);
      list.then((res) => {
        if (res.status == 200) {
          if (res.data.data.result == 'Y') {
            this.completeShowModal = true;
            this.deleteShowModal = true;
            this.closePopup();
            document.querySelector('body').style.overflow = 'auto';
          } else {
            this.closePopup();
            this.message = '학습계획을 삭제할 수 없습니다.';
            this.openConfirmPopup();
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
  },
}
</script>

<style>
</style>