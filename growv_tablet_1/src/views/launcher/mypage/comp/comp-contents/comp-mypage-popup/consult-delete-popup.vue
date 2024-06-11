<template>
  <!-- div로 루트를 감싸주어야 warning이 안뜸 -->
  <div>
    <Modal v-if="propsData.deleteShowModal" @close="closePopup" :title="title">
      <template v-slot:body>
        <div class="modal-02">
          <p class="txt-guide">
            1:1 문의 내용을 삭제하시겠습니까?
          </p>
          <div class="btn-wrap">
            <button class="btn btn-type-03-sec gray" @click="closePopup">취소</button>
            <button class="btn btn-type-03-sec" @click="openCompletePopup">삭제</button>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <div>
        </div>
      </template>
    </Modal>
    <completeModal :propsData="{completeShowModal}" @closePopup="closeCompletePopup"></completeModal>
  </div>
</template>

<script>
import Modal from '@/components/modal';
import completeModal from './consult-delete-confirm-popup'

import mypageFactory from '@/api/mypage-factory';

const consultCode = mypageFactory.get('consultCode');

export default {
  props: {
    propsData: {
      deleteShowModal: Boolean,
      id: Number,
    },
  },
  data() {
    return {
      title: '',
      completeShowModal: false,
    }
  },
  components: {
    Modal,
    completeModal,
  },
  methods: {
    closePopup() {
      this.$emit('closePopup');
    },
    // 팝업 클릭시
    clickPopBtn() {
      document.querySelector('body').style.overflow = 'hidden';
    },
    // 완료팝업 열기
    openCompletePopup() {
      const deleteQna = consultCode.delete(this.propsData.id);
      deleteQna.then((res) => {
        if (res.status == 200) {
          // 완료 알림 팝업 띄우기
          this.completeShowModal = true;
          this.closePopup();
          this.clickPopBtn();
        }
      }).catch((error) => {
        console.log(error)
      });
    },
    // 완료팝업 닫기
    closeCompletePopup() {
      this.completeShowModal = false;
      document.querySelector('body').style.overflow = 'auto';
    },
  },
}
</script>

<style>
</style>