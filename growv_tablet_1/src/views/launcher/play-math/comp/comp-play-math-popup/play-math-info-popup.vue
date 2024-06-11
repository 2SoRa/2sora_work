<template>
  <!-- div로 루트를 감싸주어야 warning이 안뜸 -->
  <div>
    <Modal v-if="propsData.infoShowModal" @close="closePopup">
      <template v-slot:body>
        <div class="math-modal info">
          <div class="modal-top">
<!--            <h1 class="title">수 비교 놀이</h1>-->
            <button @click="closePopup" class="math-modal-close"></button>
          </div>
          <div class="contents">

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
      infoShowModal: Boolean,
    },
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