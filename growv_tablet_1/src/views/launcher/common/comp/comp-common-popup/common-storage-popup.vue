<template>
  <!-- div로 루트를 감싸주어야 warning이 안뜸 -->
  <div>
    <Modal v-if="propsData.storageShowModal" @close="closePopup" :title="title">
      <template v-slot:body>
        <div class="modal-03 storage">
          <div class="header-bg"></div>
          <div class="title">저장 공간 관리</div>
          <div class="content">
            <p class="txt-guide">태블릿<br>저장공간 관리가 필요해요.</p>
          </div>
          <div class="btn-wrap btn-wrap-01">
            <button class="btn btn-type-01-sec">임시파일 삭제하기</button>
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
      storageModal: Boolean,
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