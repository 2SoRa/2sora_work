<template>
  <!-- V 스캔 : 콘텐츠 구매 안내 -->
  <div class="vscan-mode check">
    <div class="sub-gnb">
      <h1>V스캔 도서 확인</h1>
      <div class="sub-gnb-right">
        <button type="button" class="btn-close"><router-link :to="{ name : 'ReadingClubMainView' }"></router-link></button>
      </div>
    </div>
    <div class="contents thumb-info-lr">
      <div class="side-area left img-shadow">
        <img :src="getVscanBookInfo.sbBooks.items[0].thumbUrl" :alt="getVscanBookInfo.sbBooks.items[0].bookNm">
      </div>
      <div class="side-area right">
        <h3 class="view-title has-bg">
          <img src="@/assets/img/launcher-readingclub/vscan-mode/img_txt_check.webp" alt="이 책을 찾고 있나요?">
        </h3>
        <div class="btn-wrap">
          <!-- TODO : 라이팅 효과 .focus -->
          <button type="button" ref="btn_audiono" class="btn-glossy-box stop" @click="reScan"><img src="@/assets/img/launcher-readingclub/vscan-mode/btn_no.webp"></button>
          <button type="button" ref="btn_audioyes" class="btn-glossy-box yes" @click="goNext()"><img src="@/assets/img/launcher-readingclub/vscan-mode/btn_yes.webp"></button>
        </div>
      </div>
    </div>
    <!-- Audios -->
    <div class="audios" style="position:absolute;opacity:0;z-index:-9999">
      <audio ref="audioCheck">
        <source src="https://cdnfiles.superv.com/narration/Vscan_Na_003.mp3" type="audio/mp3">
      </audio>
      <audio ref="audioYes">
        <source src="https://cdnfiles.superv.com/narration/Viewer_Na_010.mp3" type="audio/mp3">
      </audio>
    </div>
  </div>
</template>
<script>
import {mapGetters} from "vuex";

export default {
  computed : {
    ...mapGetters('vscanStorage',['getVscanBookInfo']),
    rescanCount() {
      return this.$route.params.id;
    }
  },
  mounted() {
    this.playSound();
  },
  methods : {
    playSound() {
      setTimeout(() => { this.$refs.audioCheck.play(); },2000); //Yes
      setTimeout(() => { this.$refs.audioYes.play(); },4500); //Yes
      setTimeout(() => { this.$refs.btn_audiono.classList.add('focus');},4700);
      setTimeout(() => { this.$refs.btn_audioyes.classList.add('focus'); },6500);
    },
    stopSound() {
      this.$refs.audioCheck.currentTime = 0;
      this.$refs.audioCheck.pause();
      if (!this.$refs.audioYes.paused) {
        this.$refs.audioYes.currentTime = 0;
        this.$refs.audioYes.pause();
      }
    },
    openAppVscan(rc) {
      const userAgent = navigator.userAgent;
      if (userAgent === 'SuperV-Launcher') {
        // eslint-disable-next-line
        GrowvLauncherBridge.startVScan(rc)
      }
    },
    reScan() {
      this.stopSound();
      let count = parseInt(this.rescanCount);
      count++;
      switch(count) {
        case 4 :
          this.$router.push({name : 'vscanRescan'});
          break;
        case 5 :
          this.$router.push({name : 'vscanFail'});
          break;
        default :
          this.openAppVscan(count);
      }
    },
    goNext() {
      this.$router.push({name : 'vscanBuy' });
    }
  }
}
</script>