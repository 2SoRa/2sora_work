<template>
  <!-- div로 루트를 감싸주어야 warning이 안뜸 -->
  <div>
    <Modal v-if="propsData.childShowModal" @close="closePopup" :title="title">
      <template v-slot:body>
        <div class="modal-03 certify child-select">
          <div class="header-bg"></div>
          <div class="title">자녀를 선택해 주세요</div>
          <div class="content">
            <div class="select">
              <p>홍길동</p>
              <div>
                <label class="checkbox">
                  <input type="checkbox" />
                  <span class="checkmark"></span>
                </label>
              </div>
            </div>
          </div>
          <div class="btn-wrap">
            <button class="btn btn-type-01-sec disable" @click="closePopup">확인</button>
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
      childModal: Boolean,
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