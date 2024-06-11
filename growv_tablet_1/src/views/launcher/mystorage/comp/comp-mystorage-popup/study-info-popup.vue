<template>
  <!-- div로 루트를 감싸주어야 warning이 안뜸 -->
  <div>
    <Modal v-if="propsData.studyInfoShowModal" @close="closePopup" :title="title">
      <template v-slot:body>
        <div class="modal-03 study-info">
          <div class="header-bg"></div>
          <div class="title">학습 안내</div>
          <div class="content">
            <p class="txt-guide">오늘의 학습을 완료해야<br>볼 수 있어요.</p>
          </div>
          <div class="btn-wrap">
            <button class="btn btn-type-01-sec gray" @click="closePopup, closeStorage()">닫기</button>
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
      studyInfoShowModal: Boolean,
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
    // 나만의 보관함 닫기 - 슈퍼V 메인화면으로 이동
    closeStorage() {
      // eslint-disable-next-line
      goGrowvAppPage("main");
    },
  },
}
</script>

<style>
@import "@/assets/css/launcher/modal/common-alert.css";
</style>