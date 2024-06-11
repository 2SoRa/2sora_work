<template>
  <!-- 뷰어 브릿지 : 다시 읽기 -->
  <div class="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="viewer-bridge quiz">
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
                <h3 class="view-title has-bg"><img src="@/assets/img/launcher-readingclub/viewer-bridge/img_txt_quiz.webp" alt="독서 퀴즈를 시작해 볼까?"></h3>
                <div class="btn-wrap">
                  <button type="button" ref="btn_audiono" class="btn-glossy-box stop" @click="closeViewerPopup"><img src="@/assets/img/launcher-readingclub/viewer-bridge/btn_stop.webp?date=1012"></button>
                  <button type="button" ref="btn_audioyes" class="btn-glossy-box yes" @click="openBook"><img src="@/assets/img/launcher-readingclub/viewer-bridge/btn_like.webp?date=1012"></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div style="position:absolute;opacity:0;z-index:-9999">
      <audio ref="audioPy" autoplay>
        <source src="https://cdnfiles.superv.com/narration/Viewer_Na_003_V0.1.mp3" type="audio/mp3">
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
      currentType : '',
      viewerInfo : this.propsData.viewerInfo
    }
  },
  props : {
    propsData: {
      viewerInfo : Object,
    }
  },
  mounted() {
    this.playSound();
    setTimeout(() => {
      this.openBook();
    },14000);
  },
  methods : {
    playSound() {
      setTimeout(() => { this.$refs.audioYes.play(); },3400); //Yes
      setTimeout(() => { this.$refs.audioNo.play(); },6250); //Yes
      setTimeout(() => { this.$refs.btn_audioyes.classList.add('focus');},3400);
      setTimeout(() => { this.$refs.btn_audiono.classList.add('focus'); },6200);
    },
    stopSound() {
      this.$refs.audioPy.currentTime = 0;
      this.$refs.audioPy.pause();
      if (!this.$refs.audioYes.paused) {
        this.$refs.audioYes.currentTime = 0;
        this.$refs.audioYes.pause();
        this.$refs.audioNo.currentTime = 0;
        this.$refs.audioNo.pause();
      }
    },
    openBook() {
      this.stopSound();
      this.$emit('openBookRun','py');
      setTimeout(() => {
        this.closeViewerPopup();
      },1500);
    },
    openViewerPopup(info,item,type) {
      this.$emit('openViewerPopup',info,item,type);
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

