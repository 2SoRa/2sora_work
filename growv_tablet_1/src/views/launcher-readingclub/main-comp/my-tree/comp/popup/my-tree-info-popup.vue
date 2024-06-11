<template>
  <div>
    <!-- TODO : 임의로 폰트 사이즈 50px, 컬러 화이트 설정(퍼블리싱 시 삭제) -->
    <Modal v-if="propsData.infoShowModal" @close="closePopup" style="font-size:50px;color:#fff;">
      <template v-slot:header>
        <button type="button" @click="closePopup" style="font-size:50px;color:#fff">X</button>
      </template>
      <template v-slot:body>
        <div>운영 기간~</div>
        <div>미션 도전확인</div>
        <div>적립 기준</div>
      </template>
      <template v-slot:footer>
        <div></div>
      </template>
    </Modal>
  </div>
</template>

<script>
import Modal from '@/components/modal';

export default {
  props: {
    propsData: {
      infoShowModal: Boolean,
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

<style scoped>
</style>