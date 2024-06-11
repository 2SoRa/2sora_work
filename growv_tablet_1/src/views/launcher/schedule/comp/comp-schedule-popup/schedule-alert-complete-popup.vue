<template>
  <!-- div로 루트를 감싸주어야 warning이 안뜸 -->
  <div>
    <Modal v-if="propsData.completeShowModal" @close="closePopup" :title="title">
      <template v-slot:body>
        <div class="modal-02">
          <div class="txt-guide">
            계획이<br>
            <span v-if="propsData.deleteShowModal">삭제</span>
            <span v-if="propsData.modiShowModal">수정</span>
            <span v-if="propsData.regShowModal">등록</span>
            되었습니다.
          </div>
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
      completeShowModal: Boolean,
      deleteShowModal: Boolean,
      regShowModal: Boolean,
      modiShowModal: Boolean,
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
      this.$emit('getScheduleList');
    },
  },
}
</script>

<style>
</style>