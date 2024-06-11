<template>
  <!-- V 스캔 : 도서 확인 -->
  <div class="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="vscan-mode check">
            <div class="sub-gnb">
              <h1>V스캔 도서 확인</h1>
              <div class="sub-gnb-right">
                <button type="button" class="btn-close" @click="closeVscanPopup"></button>
              </div>
            </div>
            <div class="contents thumb-info-lr">
              <div class="side-area left img-shadow">
                <img src="@/assets/img/launcher-readingclub/dummy/viewer_thumb_1.webp">
              </div>
              <div class="side-area right">
                <h3 class="view-title has-bg">
                  <img src="@/assets/img/launcher-readingclub/vscan-mode/img_txt_check.webp" alt="이 책을 찾고 있나요?">
                </h3>
                <div class="btn-wrap">
                  <button type="button" class="btn-glossy-box stop" @click="reScan(retryCount)"><img
                    src="@/assets/img/launcher-readingclub/vscan-mode/btn_no.webp"></button>
                  <button type="button" class="btn-glossy-box yes"><img
                    src="@/assets/img/launcher-readingclub/vscan-mode/btn_yes.webp"></button>
                </div>
              </div>
            </div>
            <!-- Audio -->
            <audio autoplay>
              <source src="https://cdnfiles.superv.com/narration/Vscan_Na_003.mp3" type="audio/mp3">
            </audio>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  data() {
    return {
      retryCount : this.$route.query.retryCount
    }
  },
  mounted() {

  },
  methods: {
    reScan(rc) {
      let c = +rc;
      this.closeVscanPopup();
      this.mixin_appVscan(++c);
    },
    closeVscanPopup() {
      this.$emit('closeVscanPopup');
    }
  }
}
</script>