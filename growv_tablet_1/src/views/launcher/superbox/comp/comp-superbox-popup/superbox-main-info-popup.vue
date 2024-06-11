<template>
  <div>
    <Modal v-if="propsData.infoShowModal">
      <template v-slot:body>
        <div class="modal-full superbox-pop">
          <h1 class="title">
            <p>1일 1권 슈퍼박스란?</p>
            <button class="modal-default-button" @click="closePopup()"></button>
          </h1>
          <div class="info-sup">
            <img src="@/assets/img/launcher/superbox/sup-pop-box@2x.webp" alt="">
          </div>
        </div>
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
  computed: {
  },
  methods: {
    closePopup() {
      this.$emit('closePopup');
    },
  }
}
</script>

<style>
@import url('@/assets/css/launcher/modal/mypage.css');
</style>