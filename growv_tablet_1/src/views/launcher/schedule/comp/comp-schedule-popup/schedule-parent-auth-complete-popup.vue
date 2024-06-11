<template>
  <Modal v-if="propsData.completeShowModal" @close="closePopup">
    <template v-slot:body>
      <div class="modal-03 certify">
        <div class="header-bg"></div>
        <div class="title">인증 완료</div>
        <div class="content">
          <div class="txt-guide">
            <p>날짜를 선택해서 학습시간표를<br> 수정하거나 등록해주세요</p>
          </div>
          <p class="info">※ 인증은 1시간 동안 유효합니다. 시간초과시 재인증이 필요합니다.</p>
          <div class="btn-wrap">
            <button class="btn btn-type-01-sec" type="button" @click="closePopup">확인</button>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <div>
      </div>
    </template>
  </Modal>
</template>

<script>
import Modal from '@/components/modal';

export default {
  props: {
    propsData: {
      completeShowModal: Boolean,
    },
  },
  data() {
    return {
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
</style>