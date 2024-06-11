<template>
  <!-- 뷰어 브릿지 : 다시 읽기 -->
  <div class="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="viewer-bridge read">
            <div class="sub-gnb pos-absolute">
              <div class="sub-gnb-right">
                <button type="button" class="btn-close" @click="closeViewerPopup"></button>
              </div>
            </div>
            <div class="contents thumb-info-lr">
              <div class="side-area left img-shadow">
                <img :src="viewerInfo.modalData.item.thumbUrl" :alt="viewerInfo.modalData.item.bookNm" @error="replaceDefault">
              </div>
              <div class="side-area right">
                <h3 class="view-title has-bg"><img
                  src="@/assets/img/launcher-readingclub/viewer-bridge/img_txt_read.webp" alt="다시 읽어볼까?"></h3>
                <div class="btn-wrap">
                  <button type="button" ref="btn_audiono" class="btn-glossy-box stop" @click="closeViewerPopup">
                    <img src="@/assets/img/launcher-readingclub/viewer-bridge/btn_stop.webp?date=1012">
                  </button>
                  <button type="button" ref="btn_audioyes" class="btn-glossy-box yes" @click="openBook">
                    <img src="@/assets/img/launcher-readingclub/viewer-bridge/btn_like.webp?date=1012">
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div style="position:absolute;opacity:0;z-index:-9999">
      <audio autoplay ref="audioRe">
        <source src="https://cdnfiles.superv.com/narration/Viewer_Na_002_V0.1.mp3" type="audio/mp3">
      </audio>
      <audio ref="audioYes">
        <source src="https://cdnfiles.superv.com/narration/Viewer_Na_013.mp3" type="audio/mp3">
      </audio>
      <audio ref="audioNo">
        <source src="https://cdnfiles.superv.com/narration/Viewer_Na_012.mp3" type="audio/mp3">
      </audio>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      currentType: '',
      viewerInfo: this.propsData.viewerInfo,
    }
  },
  props: {
    propsData: {
      viewerInfo: Object,
    }
  },
  mounted() {
    this.$refs.audioRe.currentTime = 0;
    this.playSound();
    setTimeout(() => {
      this.closeViewerPopup();
    },14000);
  },
  methods: {
    playSound() {
      setTimeout(() => { this.$refs.audioYes.play(); },3300); //Yes
      setTimeout(() => { this.$refs.audioNo.play(); },6200); //Yes
      setTimeout(() => { this.$refs.btn_audioyes.classList.add('focus');},3500);
      setTimeout(() => { this.$refs.btn_audiono.classList.add('focus'); },6150);
    },
    stopSound() {
      this.$refs.audioRe.currentTime = 0;
      this.$refs.audioRe.pause();
      this.$refs.audioYes.currentTime = 0;
      this.$refs.audioYes.pause();
      this.$refs.audioNo.currentTime = 0;
      this.$refs.audioNo.pause();
    },
    openBook() {
      this.stopSound();
      this.closeViewerPopup();
      this.$emit('openBookRun');
    },
    openViewerPopup(info, item, type) {
      this.$emit('openViewerPopup', info, item, type);
    },
    closeViewerPopup() {
      this.$emit('closeViewerPopup');
    },
    replaceDefault(e) {
      e.target.src = require('@/assets/img/launcher-readingclub/common/thumbnail_default.png')
    }
  }
}
</script>