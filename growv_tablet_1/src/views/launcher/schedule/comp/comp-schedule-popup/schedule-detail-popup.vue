<template>
  <!-- div로 루트를 감싸주어야 warning이 안뜸 -->
  <div>
<!--    <Modal v-if="propsData.detailShowModal" @close="closePopup" :title="title">-->
    <Modal v-if="propsData.detailShowModal" @close="closePopup">
      <template v-slot:body>
        <!-- TODO: parent 클래스 추가 시 학부모 수정화면 -->
        <div class="schedule-detail" :class="{parent: getParentAuthDiv == 'P'}">
          <div class="title">
              <div class="month">
                <button class="btn-left" :class="{ disable : !propsData.isThisMonthPrev }" @click="showPrevDetail"></button>
                <p><span>{{ propsData.month }}월 {{ propsData.date }}일 ({{ propsData.dayText }})</span> 시간표 </p>
                <button class="btn-right" :class="{ disable : !propsData.isThisMonthNext }" @click="showNextDetail"></button>
              </div>
            <p class="default-title">계획 수정은 학습시간표>시간표 관리에서 학부모 인증 후 할 수 있습니다. <br>
              시간표에서 학습 후 완료 표시는 ‘학습 시간표’에 재진입 시 반영됩니다.
            </p>
            <p class="parent-title">학습계획 변경은 강좌별 월 2회만 가능합니다. 추가 수정이 필요하면 관리교사에게 요청해 주세요.</p>
            <button class="modal-default-button" @click="closePopup()"></button>
          </div>

          <!-- 시간표 내용 -->
          <div class="ttable-content">
            <ul v-if="getDetailList.studyPlans && getDetailList.studyPlans.length > 0">
              <!-- TODO: study 추가 시 학습하기 버튼 사라짐 -->
              <!--  TODO: 학습하기, 학습완료 1차 오픈시 비노출 => 노출시 옆 코드 추가  :class="{ study: item.act_yn == 'Y' }" -->
              <li v-for="(item, index) in getDetailList.studyPlans" :key="item" class="listItem" :class="{ study: item.act_yn == 'Y' }" :data-course-id="index">
                <div class="schedule-list-wrap">
                  <div class="study-info">
                    <p>{{ item.subj_nm }}</p>
                    <img src="@/assets/img/launcher/schedule/schedule-popup/ttable_ico_black.png" alt="arrow">
                    <p>{{ item.prog_nm }}</p>
                    <img src="@/assets/img/launcher/schedule/schedule-popup/ttable_ico_black.png" alt="arrow">
                    <p>{{ item.step_nm }}</p>
                    <div class="study-check show"><img src="@/assets/img/launcher/schedule/schedule-popup/ttable_ico_check.png" alt="check"></div>
                  </div>
                  <p class="info">{{ item.study_course_nm }} > ({{ item.lecture_session }}) {{ item.study_lecture_nm }}</p>
                </div>
                <!-- TODO: 학습하기, 학습완료 1차 오픈시 비노출 -->
<!--                <div class="btn-area">-->
                  <div class="btn-default">
                    <button v-if="propsData.diffPrevDate" class="btn btn-type-06" @click="openContents(item)">학습하기</button>
                    <button v-if="propsData.diffPrevDate" class="btn btn-type-06 pink" @click="openContents(item)">복습하기</button>
<!--                    <button class="btn study-complete">학습완료</button>-->
<!--                    <button class="btn btn-type-02 show" :class="{ disable : !propsData.diffPrevDate }" @click="openContents(item)">보기</button>-->
                  </div>
                  <div class="btn-parent-modify">
                    <!--TODO: disable 추가시 비활성화 // 이전날짜 확인시 비활성화 해줘야함. -->
                    <button class="btn btn-type-02 modify show" :class="{ disable : !propsData.diffDate }" @click="openModiPopup($event, item)">수정</button>
                    <!--                  <button class="btn btn-type-02 gray-02" :class="{ disable : !propsData.diffDate }" @click="openDeletePopup($event)">삭제</button>-->
                  </div>
<!--                </div>-->
              </li>
            </ul>
            <div v-else class="no-list">
              <div class="no-list-content">
                <img src="@/assets/img/launcher/common/cha_pop_nothing_ev.webp" alt="no-list">
                <p>등록된 시간표가 없습니다.</p>
              </div>
            </div>
<!--            <button v-if="propsData.diffDate" class="btn btn-type-01-sec add-schedule" @click="addSchedule()">계획추가</button>-->
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <div></div>
      </template>
    </Modal>
    <modiModal ref="scriptModi" :propsData="{modiShowModal, getListId}" @closePopup="closeModiPopup" @getScheduleList="getScheduleList"></modiModal>
    <deleteModal :propsData="{deleteShowModal, getListId}" @closePopup="closeDeletePopup" @getScheduleList="getScheduleList"></deleteModal>
    <confirmModal :propsData="{confirmShowModal, message}" @closePopup="closeConfirmPopup"></confirmModal>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";
import Modal from '@/components/modal';
import modiModal from './schedule-modify-popup'
import deleteModal from './schedule-delete-confirm-popup'
import confirmModal from './comfirm-popup'
import common from "@/common/common";

export default {
  props: {
    propsData: {
      authShowModal: Boolean,
      student_id: Number,
      fullDate: String,
      year: String,
      month: String,
      date: String,
      dayText: String,
      diffDate: Boolean,
      diffPrevDate: Boolean,
      isThisMonthPrev: Boolean,
      isThisMonthNext: Boolean,
    },
  },
  data() {
    return {
      modiShowModal: false,
      deleteShowModal: false,
      confirmShowModal: false,
      getListId: '',
      stopData : [506,507,508,509,510,512],
      message: '',
    }
  },
  components: {
    Modal,
    modiModal,
    deleteModal,
    confirmModal,
  },
  computed: {
    ...mapGetters('scheduleStorage', ['getDetailList', 'getParentAuthDiv']),
  },
  methods: {
    ...mapMutations('scheduleStorage', ['storeParentAuthDiv']),

    checkParentAuthTime() {
      if (!common.isParentAuthExpired() && this.getParentAuthDiv == 'P') { // 인증 유효시간 지남
        this.message = '인증 유효시간 1시간이 지났습니다. 다시 인증해 주세요.';
        this.openConfirmPopup();
        this.storeParentAuthDiv('NP');
        this.closePopup();
      }
    },
    showPrevDetail() {
      this.$emit('showPrevDetail');
    },
    showNextDetail() {
      this.$emit('showNextDetail');
    },
    closePopup() {
      this.resetForm();
      this.$emit('closePopup');
    },
    resetForm() {
      this.prevArrow = true;
      this.nextArrow = true;
    },
    // 수정 팝업 열기
    openModiPopup(event, item) {
      this.modiShowModal = true;
      this.closePopup();
      document.querySelector('body').style.overflow = 'hidden';

      this.getListId = event.target.closest('.listItem').getAttribute('data-course-id');
      this.$refs.scriptModi.show(item);
    },
    // 삭제 팝업 열기
    openDeletePopup(event) {
      this.deleteShowModal = true;
      this.closePopup();
      document.querySelector('body').style.overflow = 'hidden';

      this.getListId = event.target.closest('.listItem').getAttribute('data-course-id');
    },
    // 수정 팝업 닫기
    closeModiPopup() {
      this.modiShowModal = false;
      document.querySelector('body').style.overflow = 'auto';
    },
    // 삭제 팝업 닫기
    closeDeletePopup() {
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
    // 계획추가버튼 클릭
    addSchedule() {
      this.closePopup();
      this.$router.push({name: 'ScheduleReg', query: { date: this.propsData.fullDate }});
    },
    // 컨텐츠 보기 버튼 클릭
    openContents(item) {
      // 서비스 종료된 강의 체크
      const stopResult = this.stopData.some(x => x === item.study_course_id);
      if (stopResult) { alert('서비스가 종료되어 다시 볼 수 없어요.'); return false; }

      const token = localStorage.getItem("accessToken");
      const url = window.location.href;
      let baseUrl = '';

      if (url.indexOf("https://stw.superv.com/") > -1) {
        baseUrl = 'https://study.superv.com'
      } else {
        baseUrl = 'https://dev-study.superv.com'
      }

      location.href = `intent:#Intent;package=${item.packageName};i.lectureKey=${item.study_lecture_id};i.studentId=${item.student_id};S.baseUrl=${baseUrl};S.launchMode=schedule;S.authToken=${token};i.courseKey=${item.study_course_id};S.paymentKey=${item.paymentKey};S.audioFileUrl=${item.audioFileUrl};end`;
    },
  },
}
</script>

<style scoped>
  @import url('@/assets/css/launcher/modal/timetable.css');
</style>