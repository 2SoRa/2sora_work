<template>
  <!--오늘의 책 완독 후 칭찬화면-->
  <div class="superpick">
    <div class="final">
      <div>
        <div class="sub-gnb pos-absolute">
          <div class="sub-gnb-right">
            <button type="button" class="btn-close" @click="closeComplimentPopup"></button>
          </div>
        </div>
        <img src="@/assets/img/launcher-readingclub/gif/todaybook_complete.gif" alt="완독완료 축하">
      </div>
      <div style="position:absolute;opacity:0;z-index:-9999">
        <audio autoplay ref="completed">
          <source src="https://cdnfiles.superv.com/narration/Main_Vitammin_Wiz_01.mp3" type="audio/mp3">

        </audio>
      </div>
    </div>
  </div>

</template>
<script>
export default {
  mounted() {
    this.playSound();
    setTimeout(() => {
      this.closeComplimentPopup();
    },4500);
  },
  methods: {
    playSound() {
      setTimeout(() => { this.$refs.completed.play(); },1500); //Yes
    },
    closeComplimentPopup() {
      this.$emit('closeComplimentPopup');
    }
  }
}
</script>