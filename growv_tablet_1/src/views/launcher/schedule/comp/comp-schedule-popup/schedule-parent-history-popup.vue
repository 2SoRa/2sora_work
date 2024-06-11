<template>
  <Modal v-if="propsData.historyShowModal" @close="closePopup">
    <template v-slot:body>
      <div class="modal-e parent">
        <div class="title">
          <p>학부모 인증 이력</p>
          <button class="modal-default-button" @click="closePopup()"></button>
        </div>
        <div class="content">
          <p class="info">최근 50건 까지 확인할 수 있습니다.</p>
          <div class="table-wrap">
            <table>
              <tr>
                <th v-for="item in tableTitle" :key="item" >{{ item }}</th>
              </tr>
              <tr v-for="(item, index) in tableData" :key="item">
                <td>{{ index + 1 }}</td>
                <td>{{ item.reg_dtm[0] }}-{{ item.reg_dtm[1] }}-{{ item.reg_dtm[2] }}</td>
                <td>{{ item.auth_time }}</td>
              </tr>
            </table>
            <div class="no-list" v-if="tableData.length == 0">
              <div class="no-list-content">
                <img src="@/assets/img/launcher/common/cha_pop_nothing_ev.webp" alt="no-list">
                <p>인증 이력이 없습니다.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <div></div>
    </template>
  </Modal>
</template>

<script>
import Modal from '@/components/modal';
import learningFactory from '@/api/learning-factory';
import {mapGetters} from "vuex";

const schedule = learningFactory.get('scheduleCode');

export default {
  props: {
    propsData: {
      historyShowModal: Boolean,
    },
  },
  data() {
    return {
      tableTitle: ['', '날짜', '시간'],
      tableData: []
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
    show() {
      this.getHistAuthParent();
    },
    // 학부모 인증 이력 가져오기
    getHistAuthParent() {
      const data = {
        student_id : this.userInfo.info.studentId,
      }

      const list = schedule.historyAuthParent(data);
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
  @import "@/assets/css/launcher/modal/history-list.css";
</style>