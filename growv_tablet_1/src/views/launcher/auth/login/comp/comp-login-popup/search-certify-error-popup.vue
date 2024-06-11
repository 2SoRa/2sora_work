<template>
  <!-- div로 루트를 감싸주어야 warning이 안뜸 -->
  <div>
    <Modal v-if="propsData.alertShowModal" @close="closePopup" :title="title">
      <template v-slot:body>
        <div class="modal-02">
          <p class="txt-guide">인증번호가 일치하지 않습니다.<br>전송된 인증번호를 다시 확인해 주세요.</p>
          <div class="btn-wrap btn-wrap-01">
            <button class="btn btn-type-03-sec" @click="closePopup">확인</button>
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
      errorModal: Boolean,
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
</style>