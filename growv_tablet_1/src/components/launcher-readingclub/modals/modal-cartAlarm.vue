<template>
  <div class="modal-alarm">
    <Modal v-if="propsData.isAlarmPopup">
      <template v-slot:body>
        <ul class="row-list row-2">
          <li>
            등록된 휴대전화로<br>
            알림톡 결제 링크를 보내 드렸습니다.
          </li>
          <li>
            <span>로그인 후 장바구니를 확인</span>하시고<br>
            최종 결제를 진행해 주세요.
          </li>
        </ul>
      </template>
      <template v-slot:footer>
        <div>
          <button type="button" class="btn-box-rounded btn-blue" @click="closePopup">확인</button>
        </div>
      </template>
    </Modal>
  </div>
</template>
<script>
import Modal from "@/components/modal.vue";

export default {
  props: {
    propsData: {
      isAlarmPopup: Boolean,
    },
  },
  components: {Modal},
  methods: {
    closePopup() {
      this.$emit('closePopup');
    },
  }
}
</script>