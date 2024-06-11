<template>
  <!-- div로 루트를 감싸주어야 warning이 안뜸 -->
  <div>
    <Modal v-if="propsData.confirmShowModal" @close="closePopup" :title="title">
      <template v-slot:body>
        <div class="modal-02">
          <p class="txt-guide">
            구독중인 큐레이션을 취소하고 <br> 새로 신청하시겠습니까?
          </p>
          <div class="btn-wrap btn-wrap-01">
            <button class="btn btn-type-03-sec gray" @click="closePopup">취소</button>
            <button class="btn btn-type-03-sec" @click="register">확인</button>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <div>
        </div>
      </template>
    </Modal>
    <alertModal :propsData="{alertShowModal, message}" @closePopup="closeAlertPopup"></alertModal>
  </div>
</template>

<script>
import Modal from '@/components/modal';
import alertModal from './alert-popup'
import learningFactory from '@/api/learning-factory';

const scheduleCode = learningFactory.get('scheduleCode');

export default {
  props: {
    propsData: {
      confirmShowModal: Boolean,
      regData: Object,
    },
  },
  data() {
    return {
      title: '',
      alertShowModal: false,
      message: '',
    }
  },
  components: {
    Modal,
    alertModal,
  },
  methods: {
    closePopup() {
      this.$emit('closePopup');
    },
    loadSubList() {
      this.$emit('loadSubList');
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

    // 큐레이션 구독
    register() {
      const list = scheduleCode.preCheckRegister(this.propsData.regData);
      list.then((res) => {
        if (res.status == 200) {
          const result = res.data.data;

          if (result.result == 'Y') {
            const reg = scheduleCode.register(this.propsData.regData);

            reg.then((res) => {
              if (res.status == 200) {
                this.message = '북 큐레이션 구독이 신청되었습니다.';
                this.closePopup();
                this.openAlertPopup();
                this.loadSubList();
                this.$emit('closeApplyPopup');
              }
            }).catch((error) => {
              console.log(error)
              this.message = '북 큐레이션 구독에 실패하였습니다.';
              this.closePopup();
              this.openAlertPopup();
            });
          } else {
            this.message = '이미 등록되어져 있는 큐레이션입니다.';
            this.closePopup();
            this.openAlertPopup();
          }
        }
      }).catch((error) => {
        console.log(error);
      });
    },
  },
}
</script>

<style>
</style>