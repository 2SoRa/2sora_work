<template>
  <!-- div로 루트를 감싸주어야 warning이 안뜸 -->
  <div>
    <Modal v-if="propsData.cancelShowModal" @close="closePopup" :title="title">
      <template v-slot:body>
        <div class="modal-02">
          <p class="txt-guide">
            문의를 취소하시겠습니까? <br> 작성중인 글은 삭제됩니다.
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
      //리딩클럽 집입 여부
      isReadingClub:false,
    }
  },
  components: {
    Modal,
  },
  created() {
    //리딩클럽에서 진입 했다면 true로 바꿔주기
    if(window.location.href.match('readingclub')){
      this.isReadingClub = true
    }
  },
  methods: {
    closePopup() {
      this.$emit('closePopup');
    },
    openCompletePopup() {
      this.closePopup();
      //리딩클럽 진입시 쿼리값 전달
      if(this.isReadingClub){
        this.$router.push({ name: 'StudySupportConsult' , query:{name: 'readingClub' } });
      } else  this.$router.push({ name: 'StudySupportConsult' });
    }
  },
}
</script>

<style>
</style>