<template>
  <!-- div로 루트를 감싸주어야 warning이 안뜸 -->
  <div>
    <Modal v-if="propsData.detailShowModal" @close="closePopup">
      <template v-slot:body>
        <div class="modal-01 detail">
          <div class="title">강좌 상세 소개</div>
          <div class="content">
            <button class="modal-default-button" @click="closePopup"></button>
            <div class="detail-course">
              <div class="schedule-list-wrap">
                <div class="study-info">
                  <p>{{ eachDetailInfoItem.study_course_nm }}</p>
                </div>
                <!-- TODO: 단계명 넣어주기 -->
                <p class="info">{{ eachDetailInfoItem.prog_nm }}</p>
              </div>
              <div class="level-info">{{ eachDetailInfoItem.level_nm }}</div>
            </div>
            <div class="table-wrap">
              <table>
                <tr>
                  <th v-for="item in tableTitle" :key="item" >{{ item }}</th>
                </tr>
                <tr v-for="item in tableData" :key="item">
                  <td>{{ item.lecture_session }}</td>
                  <!-- TODO: 미리보기버튼 기능은 1차오픈 후 추가예정 -->
                  <td>{{ item.study_lecture_nm }} <button class="preview">미리보기</button></td>
                  <td>{{ item.recomm_age_nm }}</td>
                </tr>
              </table>
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
import Modal from '@/components/modal';
import learningFactory from '@/api/learning-factory';
import {mapGetters} from "vuex";

const schedule = learningFactory.get('scheduleCode');

export default {
  props: {
    propsData: {
      detailShowModal: Boolean,
    },
  },
  data() {
    return {
      eachDetailInfoItem: {},
      tableTitle: ['회차', '콘텐츠 명', '선택'],
      tableData: [],
    }
  },
  components: {
    Modal,
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  methods: {
    closePopup() {
      this.$emit('closePopup');
    },
    show(eachDetailInfoItem) {
      this.eachDetailInfoItem = eachDetailInfoItem;

      const data = {
        student_id : this.userInfo.info.studentId,
        study_course_id : this.eachDetailInfoItem.study_course_id,
      }

      const list = schedule.loadCourseDetailInfo(data);
      list.then((res) => {
        if (res.status == 200) {
          const data = res.data.data;
          this.tableData = data.result;
        }
      }).catch((error) => {
        console.log(error)
      });
    },
  },
}
</script>

<style>
@import url('@/assets/css/launcher/modal/timetable');
</style>