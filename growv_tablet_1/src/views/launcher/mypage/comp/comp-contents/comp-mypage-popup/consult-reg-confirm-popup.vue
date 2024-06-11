<template>
  <!-- div로 루트를 감싸주어야 warning이 안뜸 -->
  <div>
    <Modal v-if="propsData.regConfirmShowModal" @close="closePopup" :title="title">
      <template v-slot:body>
        <div class="modal-02">
          <p class="txt-guide">
            1:1 문의가 접수되었습니다.
          </p>
          <div class="btn-wrap btn-wrap-01">
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
      regConfirmShowModal: Boolean,
      isReadingClub:Boolean
    },
  },
  data() {
    return {
      title: '',
      // isReadingClub:false
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
      //리딩클럽에서 진입 시 쿼리값 보내주기
      if(this.propsData.isReadingClub){
        this.$router.push({ name: 'StudySupportConsult', query:{name: 'readingClub' } });
      }else  this.$router.push({ name: 'StudySupportConsult' });
    }
  },
}
</script>

<style>
</style>