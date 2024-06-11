<template>
  <!-- V 스캔 : 도서 인식 -->
  <div class="vscan-mode rescan">
    <div class="sub-gnb">
      <h1>V스캔 도서 인식</h1>
      <div class="sub-gnb-right">
        <button type="button" class="btn-close"><router-link :to="{ name : 'ReadingClubMainView' }"></router-link></button>
      </div>
    </div>
    <div class="contents">
      <div class="img-wrap">
        <img src="@/assets/img/launcher-readingclub/vscan-mode/img_check_text.webp" alt="앗! 인식이 잘 안되나요? 이렇게 하면 더 잘 스캔할 수 있어요! 다시 한번 해볼까요?" class="text">
        <img src="@/assets/img/launcher-readingclub/vscan-mode/img_check_guide.webp" alt="안돼요! 어두운 조명, 빛 반사, 책 일부분. 좋아요! 책 전체 & 밝은 조명" class="guide">
      </div>
      <div class="btn-wrap">
        <button type="button" class="btn-round-360 type-blue">
          <router-link :to="{ name : 'ReadingClubMainView' }">
            <img src="@/assets/img/launcher-readingclub/common/btn_ico_x.webp" class="ico-x">
            <span class="txt">그만 할래요</span>
          </router-link>
        </button>
        <button type="button" class="btn-round-360 type-yellow" @click="reScan">
          <img src="@/assets/img/launcher-readingclub/common/btn_ico_o.webp" class="ico-o">
          <span class="txt">예</span>
        </button>
      </div>
    </div>
    <!-- Audio -->
    <audio autoplay style="position:absolute;opacity:0" ref="audioRescan">
      <source src="https://cdnfiles.superv.com/narration/Vscan_Na_004.mp3" type="audio/mp3">
    </audio>
  </div>
</template>
<script>
export default {
  methods : {
    openAppVscan(rc) {
      const userAgent = navigator.userAgent;
      if (userAgent === 'SuperV-Launcher') {
        // eslint-disable-next-line
        GrowvLauncherBridge.startVScan(rc)
      }
    },
    reScan() {
      this.$refs.audioRescan.pause();
      this.openAppVscan(4);
    },
  }
}
</script>