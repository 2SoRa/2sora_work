<template>
  <!-- div로 루트를 감싸주어야 warning이 안뜸 -->
  <div>
    <Modal v-if="propsData.loginErrorShowModal" @close="closePopup" :title="title">
      <template v-slot:body>
        <div class="modal-02 login-error">
          <p class="txt-guide" v-html="propsData.message"></p>
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
      loginErrorShowModal: Boolean,
      message: ''
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