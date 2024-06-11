<template>
  <!-- div로 루트를 감싸주어야 warning이 안뜸 -->
  <div>
    <Modal v-if="propsData.tMsgShowModal" @close="closePopup" :title="title">
      <template v-slot:body>
        <div class="modal-03 message">
          <div class="header-bg"></div>
          <div class="title">선생님 메시지</div>
          <div class="content">
            <p class="txt-guide">선생님에게 쪽지가<br>도착했어요!</p>
          </div>
          <div class="btn-wrap btn-wrap-01">
            <button class="btn btn-type-02-sec gray" @click="closePopup">다음에 하기</button>
            <button class="btn btn-type-02-sec">
              <router-link to="">확인하기</router-link>
            </button>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script>
import Modal from '@/components/modal';

export default {
  props: {
    propsData: {
      tMsgModal: Boolean,
    },
  },
  data() {
    return {
      title: '',
    }
  },
  components: {
    Modal,
  },
  methods: {
    closePopup() {
      this.$emit('closePopup');
    },
  },
}
</script>

<style>
@import "@/assets/css/launcher/modal/common-alert.css";
@import "@/assets/css/launcher/modal/auth-modal.css";
</style>