<template>
  <div class="schedule schedule-reg">
    <div class="gnb">
      <button class="back"><router-link :to="{ name: 'ScheduleMain' }"></router-link></button>
      <div class="gnb-title">
        <img src="@/assets/img/launcher/schedule/ttable_sub_navi_ico_l.png" alt="deco">
        <p>학습 시간표 등록</p>
        <img src="@/assets/img/launcher/schedule/ttable_sub_navi_ico_r.png" alt="deco">
      </div>
    </div>
    <div class="schedule-area schedule-reg-area">
      <!-- TODO: v-select 사용하는지 체크 -->
      <div class="schedule-select">
        <div class="dropdown-wrap">
          <div class="dropdown">
            <v-select label="subj_nm"
                      placeholder="선택"
                      :options="subjectItem"
                      v-model="formData.selectedSubject"
                      :reduce="subjectItem => subjectItem.subj_cd">
              <template #open-indicator="{ attributes }">
                <span v-bind="attributes"><img src="@/assets/img/launcher/common/ttable_drdown_ico_down_48.png" alt="arrow"></span>
              </template>
            </v-select>
          </div>
          <div class="dropdown">
            <v-select label="prog_nm"
                      placeholder="선택"
                      :options="processItem"
                      v-model="formData.selectedProcess"
                      :reduce="processItem => processItem.prog_cd">
              <template #open-indicator="{ attributes }">
                <span v-bind="attributes"><img src="@/assets/img/launcher/common/ttable_drdown_ico_down_48.png" alt="arrow"></span>
              </template>
            </v-select>
          </div>
        </div>
      </div>
      <div class="study-list-wrap">
        <ul class="study-list">
          <!-- TODO: 계획이 등록되어있는 경우 class="already-plan" 추가 -->
          <li class="study-item"  :class="{ 'already-plan' : item.plan_yn != 'N' }" v-for="item in courseItem" :key="item">
            <!-- TODO: 클릭 시 강좌 상세 팝업 -->
            <button class="btn-curri" @click="openDetailPopup(item)"></button>
            <!-- 단계 타이틀 -->
            <div class="step-title">{{ item.step_nm }}</div>
            <div class="study-item-content" :class="{ center: (planCount != courseItem.length && item.plan_yn == 'N') }">
              <p class="lecture-title">{{ item.prog_nm }}</p>
              <p class="lecture-content">{{ item.study_course_nm }}</p>
              <p class="level">{{ item.level_nm }}</p>
            </div>
            <div class="study-item-btn">
              <div class="modi-btn-wrap">
<!--                <button class="btn btn-type-07 gray" @click="openDeletePopup(item)">계획 삭제</button>-->
                <button class="btn btn-type-07" @click="openModiPopup(item)">계획 수정</button>
              </div>
              <div class="plan-reg-button">
                <button class="btn btn-type-07" @click="openRegPopup(item)" v-if="planCount == courseItem.length">계획 등록</button>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <modiModal ref="scriptModi" :propsData="{modiShowModal, eachItem, regDate}" @closePopup="closeModiPopup"></modiModal>
  <regModal ref="scriptReg" :propsData="{regShowModal, regDate}" @closePopup="closeRegPopup" @getScheduleList="getCourseList"></regModal>
  <deleteModal :propsData="{deleteShowModal, eachItem}" @closePopup="closeDeletePopup" @getScheduleList="getCourseList"></deleteModal>
  <detailModal ref="scriptDetail" :propsData="{detailShowModal}" @closePopup="closeDetailPopup"></detailModal>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";
import modiModal from './comp-schedule-popup/schedule-modify-popup'
import regModal from './comp-schedule-popup/schedule-reg-popup'
import deleteModal from './comp-schedule-popup/schedule-delete-confirm-popup'
import detailModal from './comp-schedule-popup/schedule-course-detail-popup'

import learningFactory from '@/api/learning-factory';

const schedule = learningFactory.get('scheduleCode');

export default {
  props: [
    'date',
  ],
  data() {
    return {
      regDate: this.$route.query.date,

      regShowModal: false,
      modiShowModal: false,
      deleteShowModal: false,
      detailShowModal: false,

      formData: {
        selectedSubject: 3,
        selectedProcess: 8,
      },

      eachItem: {},
      eachDetailInfoItem: {},

      studyPlanHistsItem: [],

      subjectItem: [],
      processItem: [],
      selectSubjectItems: [],
      selectProcessItems: [],
      courseItem: [],

      planCount: 0,
      firstEachLevel: [1, 5, 6, 9, 13, 24, 25, 28, 29, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 73], // 강좌별 첫번째 레벨코드(없음 포함), 영어 > 스토리 는 StepA-B까지 보이게(24,25)
    }
  },
  components: {
    modiModal,
    regModal,
    deleteModal,
    detailModal,
  },
  watch: {
    'formData.selectedSubject'() {
      this.formData.selectedProcess = null;
      this.getProgList();
    },
    'formData.selectedProcess'() {
      this.getCourseList();
    },
  },
  created() {
    this.getSubjList();
    this.getProgList();
    this.getCourseList(); // 첫 리스트를 영어-스토리 로 설정
  },
  mounted() {
    this.hideKeyboard();
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  methods: {
    ...mapMutations('scheduleStorage', ['storeRegCourseItem']),

    // 강좌 > 과목 셀렉 리스트 불러오기
    getSubjList() {
      const data = {
        student_id : this.userInfo.info.studentId,
      }

      const list = schedule.loadCourseSubj(data);
      list.then((res) => {
        if (res.status == 200) {
          const data = res.data.data;
          this.subjectItem = data.result.filter((el) => {
            return el.subj_nm != '화상';
          });
        }
      }).catch((error) => {
        console.log(error)
      });
    },
    // 강좌 선택시 과정 불러오기
    getProgList() {
      const data = {
        subj_cd : this.formData.selectedSubject,
      }

      const list = schedule.loadCourseProg(data);
      list.then((res) => {
        if (res.status == 200) {
          const data = res.data.data;
          this.processItem = data.result;
        }
      }).catch((error) => {
        console.log(error)
      });
    },
    // 과목, 과정 선택시 강좌 불러오기
    getCourseList() {
      this.courseItem = [];
      this.planCount = 0;

      const data = {
        student_id : this.userInfo.info.studentId,
        subj_cd : this.formData.selectedSubject,
        prog_cd: this.formData.selectedProcess,
        search_date: this.regDate,
      }

      const list = schedule.loadCourseList(data);
      list.then((res) => {
        if (res.status == 200) {
          const data = res.data.data;
          this.studyPlanHistsItem = data.studyPlanHists;

          data.result.forEach((el) => {
            const thisItem = el;
            const thisLevelCd = el.course_level_cd;
            this.firstEachLevel.forEach((el) => {
              if (thisLevelCd == el) {
                this.courseItem.push(thisItem);
              }
            });
          });
          this.courseItem.forEach((el) => {
            if (el.plan_yn == 'N') {
              this.planCount++;
            }
          });
        }
      }).catch((error) => {
        console.log(error)
      });
    },
    // 등록 팝업 열기
    openRegPopup(item) {
      this.eachItem = item;
      this.regShowModal = true;
      this.storeRegCourseItem(this.eachItem);
      document.querySelector('body').style.overflow = 'hidden';
      this.$refs.scriptReg.show(this.eachItem);
    },
    // 수정 팝업 열기
    openModiPopup(item) {
      this.eachItem = item;
      this.modiShowModal = true;
      document.querySelector('body').style.overflow = 'hidden';
      this.$refs.scriptModi.show(this.eachItem, this.studyPlanHistsItem);
    },
    // 삭제 팝업 열기
    openDeletePopup(item) {
      this.eachItem = item;
      this.deleteShowModal = true;
      document.querySelector('body').style.overflow = 'hidden';
    },
    // 삭제 팝업 닫기
    closeDeletePopup() {
      this.deleteShowModal = false;
      document.querySelector('body').style.overflow = 'auto';
    },
    // 수정 팝업 닫기
    closeModiPopup() {
      this.modiShowModal = false;
      document.querySelector('body').style.overflow = 'auto';
      this.getCourseList();
    },
    // 등록 팝업 닫기
    closeRegPopup() {
      this.regShowModal = false;
      document.querySelector('body').style.overflow = 'auto';
    },
    // 상세 팝업 열기
    openDetailPopup(item) {
      this.eachDetailInfoItem = item;
      this.detailShowModal = true;
      document.querySelector('body').style.overflow = 'hidden';

      this.$refs.scriptDetail.show(this.eachDetailInfoItem);
    },
    // 상세 팝업 닫기
    closeDetailPopup() {
      this.detailShowModal = false;
      document.querySelector('body').style.overflow = 'auto';
    },
    hideKeyboard() {
      const input = document.querySelectorAll('.vs__selected-options .vs__search');
      input.forEach((el) => {
        el.setAttribute('inputmode','none');
        el.setAttribute('readonly','readonly');
      });
    },
  },
}
</script>

<style scoped>
  @import url('@/assets/css/launcher/calendar/calendar-reg.css');

  .study-item .study-item-content.center {
    height: calc(100% - 75px);
    margin-top: -12px;
  }
</style>