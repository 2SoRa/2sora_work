<template>
  <!-- V스캔 쇼핑몰 : 도서 상세 -->
  <!-- 모달로 빠질 예정 -->
  <div style="width:100vw; height:100vh; background-color:palevioletred;">
    <button type="button" @click="showDetailView" style="padding:20px; font-size:32px;">이 버튼 누르면 modal-detail-view 등장</button>
  </div>

  <detailViewModal v-if="isDetailView" @closePopup="closePopup"></detailViewModal>
</template>
<script>
import detailViewModal from '@/components/launcher-readingclub/modals/modal-detail-view.vue';

export default {
  data() {
    return {
      isDetailView : false,
    }
  },
  components : {
    detailViewModal
  },
  mounted() {
  },
  methods : {
    showDetailView() {
      this.isDetailView = true;
    },
    closePopup() {
      this.isDetailView = false;
    },
  }
};
</script>