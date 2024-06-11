<template>
  <!-- div로 루트를 감싸주어야 warning이 안뜸 -->
  <div>
    <Modal v-if="propsData.completeShowModal" @close="closePopup" :title="title">
      <template v-slot:body>
        <div class="modal-02">
          <div class="txt-guide">1:1 문의 내용이 삭제되었습니다.</div>
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
    },
  },
  data() {
    return {
      title: '',
      isReadingClub: false
    }
  },
  components: {
    Modal,
  },
  created() {
    if(window.location.href.match('readingclub')){
      this.isReadingClub = true
    }
  },
  methods: {
    closePopup() {
      console.log(this.setReadingClub)
      this.$emit('closePopup');
      //리딩클럽 진입 시 쿼리값 전달
      if(this.isReadingClub){
        this.$router.push({ name: 'StudySupportConsult', query:{ name: 'readingClub' } });
      } else this.$router.push({ name: 'StudySupportConsult' });
    },
  },
}
</script>

<style>
</style>