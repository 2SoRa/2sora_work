<template>
  <!-- div로 루트를 감싸주어야 warning이 안뜸 -->
  <div>
    <Modal v-if="propsData.cancelShowModal" @close="closePopup" :title="title">
      <template v-slot:body>
        <div class="modal-02">
          <p class="txt-guide">
            회원정보 수정을 취소하시겠습니까?
          </p>
          <div class="btn-wrap">
            <button class="btn btn-type-03-sec gray" @click="closePopup">취소</button>
            <button class="btn btn-type-03-sec" @click="openCompletePopup">확인</button>
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
      cancelShowModal: Boolean,
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
    openCompletePopup() {
      this.closePopup();
      this.$router.push({ name: 'MemberInfoMain' }); // TODO: 슈퍼V 메인으로 이동하는 처리 추가 필요
    }
  },
}
</script>

<style>
</style>