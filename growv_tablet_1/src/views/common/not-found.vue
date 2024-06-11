<template>
  <!-- div로 루트를 감싸주어야 warning이 안뜸 -->
  <div>
    <Modal>
      <template v-slot:body>
        <div class="modal-02 conts-wrap">
          <p>
            <img :src="img">
          </p>
          <p class="txt-guide" style="height:auto;">
            페이지를 찾을 수 없습니다.
          </p>
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
  name: "NotFound",
  data() {
    return {
      img: require('@/assets/img/launcher/common/cmm_pop_alarmi_cha_wiz_03.png'),
    }
  },
  components: {
    Modal,
  },
}
</script>

<style scoped>
.conts-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  padding: 30px 80px 50px;
}
</style>