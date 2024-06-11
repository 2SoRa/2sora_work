<template>
  <!-- div로 루트를 감싸주어야 warning이 안뜸 -->
  <div>
    <Modal v-if="propsData.stepShowModal" @close="closePopup">
      <template v-slot:body>
        <!-- TODO: reg 클래스 추가 시 등록으로 변경 -->
        <div class="modal-01 schedule-choice">
          <div class="title">진도 수정 차시 선택 </div>
          <div class="title reg">계획 차시 선택</div>
          <div class="content">
            <div class="table-wrap">
              <table>
                <tr>
                  <th v-for="item in tableTitle" :key="item">{{ item }}</th>
                </tr>
                <tr v-for="item in stepItem" :key="item">
                  <td>{{ item.lecture_session }}</td>
                  <td class="name">{{ item.study_lecture_nm }}</td>
                  <td v-if="item.act_yn == 'N'">-</td> <td v-else>{{ item.act_yn }}</td>
                  <td class="selLecture">
                    <label class="checkbox">
                      <input type="radio" :value="item" v-model="selectedStep"/> <!-- @click="checkLecture($event)" -->
                      <span class="checkmark"></span>
                    </label>
                  </td>
                </tr>
              </table>
            </div>
            <div class="btn-wrap btn-wrap-01">
              <button class="btn btn-type-02-sec gray" @click="closePopup">취소</button>
              <!-- TODO: disable 삭제시 활성화 -->
              <button class="btn btn-type-01-sec" :class="{ disable : selectedLecNum == 0 }" @click="registerLecture()"><span>{{ selectedLecNum }}</span>강으로 진도수정</button>
            </div>
            <!--  등록시 버튼 묶음 -->
            <div class="btn-wrap reg btn-wrap-01">
              <button class="btn btn-type-02-sec gray" @click="closePopup">취소</button>
              <!-- TODO: disable 삭제시 활성화 -->
              <button class="btn btn-type-01-sec btnLecReg" @click="registerLecture()">총 <span>{{ totalLecCount }}</span>강 계획등록</button>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <div>
          <button @click="closePopup">취소</button>
          <button>3강으로 진도 수정</button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script>
import Modal from '@/components/modal';

import learningFactory from '@/api/learning-factory';
import {mapGetters} from "vuex";

const schedule = learningFactory.get('scheduleCode');

export default {
  props: {
    propsData: {
      stepShowModal: Boolean,
    },
  },
  data() {
    return {
      study_course_id: '',
      selectedStep: 0,
      selectedLecNum: 0,
      totalLecCount: 0,
      tableTitle: ['회차', '콘텐츠 명', '학습일', '선택'],
      stepItem: [],
    }
  },
  components: {
    Modal,
  },
  watch: {
    'selectedStep'() {
      this.selectedLecNum = this.selectedStep.lecture_session;
    },
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  methods: {
    closePopup() {
      this.resetForm();
      this.$emit('closePopup');
    },
    resetForm() {
      this.selectedStep = 0;
      this.totalLecCount = 0;
      this.selectedLecNum = 0;
    },
    show(getRegCourseItem) {
      this.study_course_id = getRegCourseItem.study_course_id;

      const data = {
        student_id : this.userInfo.info.studentId,
        study_course_id : this.study_course_id,
      }

      const list = schedule.selectPlanLecture(data);

      list.then((res) => {
        if (res.status == 200) {
          const data = res.data.data;
          this.stepItem = data.result;

          /*let count = 0;
          this.stepItem.forEach((el) => {
            if (el.act_yn == 'N') {
              count++;
            }
          });
          this.totalLecCount = count;*/
        }
      }).catch((error) => {
        console.log(error)
      });
    },
    registerLecture() {
      this.$emit('closePopup', this.selectedStep);
      this.resetForm();
    },
  },
}
</script>

<style>
  @import url('@/assets/css/launcher/modal/schedule-choice.css');
</style>