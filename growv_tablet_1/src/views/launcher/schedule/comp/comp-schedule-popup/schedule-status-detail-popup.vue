<template>
  <!-- div로 루트를 감싸주어야 warning이 안뜸 -->
  <div>
    <!--    <Modal v-if="propsData.detailShowModal" @close="closePopup" :title="title">-->
    <Modal v-if="propsData.detailShowModal" @close="closePopup">
      <template v-slot:body>
        <div class="schedule-detail status">
          <div class="title">
            <div class="month">
              <button class="btn-left" :class="{ disable : !propsData.isThisMonthPrev }" @click="showPrevDetail"></button>
              <p><span>{{ propsData.month }}월 {{ propsData.date }}일 ({{ propsData.dayText }})</span> 학습현황</p>
              <button class="btn-right" :class="{ disable : !propsData.isThisMonthNext }" @click="showNextDetail"></button>
            </div>
            <button class="modal-default-button" @click="closePopup()"></button>
          </div>

          <!-- 시간표 내용 -->
          <div class="ttable-content">
            <ul v-if="getDetailList && getDetailList.length > 0">
              <!-- TODO: study 추가 시 학습하기 버튼 사라짐 -->
              <li v-for="(item, index) in getDetailList" :key="item" class="listItem" :data-course-id="index">
                <div class="schedule-list-wrap">
                  <div class="study-info">
                    <p>{{ item.subj_nm }}</p>
                    <img v-if="item.prog_nm" src="@/assets/img/launcher/schedule/schedule-popup/ttable_ico_black.png" alt="arrow">
                    <p v-if="item.prog_nm">{{ item.prog_nm }}</p>
                    <img v-if="item.step_nm" src="@/assets/img/launcher/schedule/schedule-popup/ttable_ico_black.png" alt="arrow">
                    <p v-if="item.step_nm">{{ item.step_nm }}</p>
                    <div class="study-check show"><img src="@/assets/img/launcher/schedule/schedule-popup/ttable_ico_check.png" alt="check"></div>
                  </div>
                  <p class="info">{{ item.study_course_nm }} > <span v-if="!(item.study_course_id == -1 || item.study_course_id == -2 || item.study_course_id == -3 || item.study_course_id == -4)">&nbsp;({{ item.lecture_session }})&nbsp;</span>  {{ item.study_lecture_nm }}</p>
                </div>
                <div class="btn-default">
<!--                  <button v-if="propsData.diffPrevDate" class="btn btn-type-06" @click="openContents(item)">학습하기</button>-->
                  <button class="btn btn-type-06 pink" @click="openContents(item)">복습하기</button>
                  <!--                    <button class="btn study-complete">학습완료</button>-->
                  <!--                    <button class="btn btn-type-02 show" :class="{ disable : !propsData.diffPrevDate }" @click="openContents(item)">보기</button>-->
                </div>
<!--                <div class="btn-default">
                  <button class="btn study-complete">학습완료</button>
                  <button class="btn btn-type-06 pink" v-else-if="item.study_act_cn > 1">복습</button>
                  <button class="btn btn-type-07 gray" v-else-if="(item.study_act_cn == null && item.act_yn == 'N') || (item.study_act_cn == '' && item.act_yn == 'N')">학습대기</button>
                </div>-->
              </li>
            </ul>
            <div v-else class="no-list">
              <div class="no-list-content">
                <img src="@/assets/img/launcher/common/cha_pop_nothing_ev.webp" alt="no-list">
                <p>수강한 이력이 없습니다.</p>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <div></div>
      </template>
    </Modal>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import Modal from '@/components/modal';

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
      isThisMonthPrev: Boolean,
      isThisMonthNext: Boolean
    },
  },
  data() {
    return {
      modiShowModal: false,
      deleteShowModal: false,
      getListId: '',
      stopData : [506,507,508,509,510,512]
    }
  },
  components: {
    Modal,
  },
  computed: {
    ...mapGetters('scheduleStorage', ['getDetailList']),
  },
  methods: {
    closePopup() {
      this.$emit('closePopup');
    },
    showPrevDetail() {
      this.$emit('showPrevDetail');
    },
    showNextDetail() {
      this.$emit('showNextDetail');
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

      location.href = `intent:#Intent;package=${item.packageName};i.lectureKey=${item.study_lecture_id};i.studentId=${item.student_id};S.baseUrl=${baseUrl};S.launchMode=default;S.authToken=${token};i.courseKey=${item.study_course_id};S.paymentKey=${item.paymentKey};S.audioFileUrl=${item.audioFileUrl};end`;
    },
  },
}
</script>

<style>
@import url('@/assets/css/launcher/modal/timetable');
</style>