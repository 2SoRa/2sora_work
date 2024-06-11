<template>
  <div class="viewr-close">
    <Modal>
      <template v-slot:header>
        <h1>뷰어 닫기 팝업</h1>
        <button type="button" class="modal-default-button" @click="closePopup"></button>
      </template>
      <template v-slot:body>
        <div class="thumb-info-lr only-area-r">
          <div class="side-area right">
            <h3 class="view-title has-bg text-blind">
              <img src="@/assets/img/launcher-readingclub/viewer-bridge/img_txt_close.webp" alt="그만 할까요?">
            </h3>
            <div class="btn-wrap">
              <button type="button" class="btn-glossy-box" @click="closePopup"><img src="@/assets/img/launcher-readingclub/common/btn_close_no.webp" alt="아니요"></button>
              <button type="button" class="btn-glossy-box"><img src="@/assets/img/launcher-readingclub/common/btn_close_yes.webp" alt="예"></button>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:footer>
      </template>
    </Modal>
  </div>
</template>
<script>
import Modal from '@/components/modal'

export default {
  components : {
    Modal
  },
  methods: {
    closePopup() {
      this.$emit('closePopup');
    }
  }
}
</script>