<template>
  <!-- div로 루트를 감싸주어야 warning이 안뜸 -->
  <div>
    <Modal v-if="propsData.enterShowModal" @close="closePopup" :title="title">
      <template v-slot:body>
        <div class="modal-03 enter">
          <div class="header-bg"></div>
          <div class="title">슈퍼비 화상수업</div>
          <div class="content">
            <p class="txt-guide">지금 선생님과<br>신나게 공부할 시간이에요!</p>
          </div>
          <div class="btn-wrap btn-wrap-01">
            <button class="btn btn-type-01-sec">
              <router-link to="">입장하기</router-link>
            </button>
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
      enterModal: Boolean,
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
@import "@/assets/css/launcher/modal/common-alert.css";
@import "@/assets/css/launcher/modal/auth-modal.css";
</style>