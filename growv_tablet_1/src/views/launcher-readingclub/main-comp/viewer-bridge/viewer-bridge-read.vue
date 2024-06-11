<template>
  <!-- 뷰어 브릿지 : 다시 읽어볼까? -->
  <div class="viewer-bridge read">
    <div class="sub-gnb pos-absolute">
      <div class="sub-gnb-right">
        <button type="button" class="btn-close"><router-link :to="{ name: 'ReadingClubMainView' }"></router-link></button>
      </div>
    </div>
    <div class="contents thumb-info-lr">
      <div class="side-area left img-shadow">
        <img src="@/assets/img/launcher-readingclub/dummy/temp2.webp">
      </div>
      <div class="side-area right">
        <h3 class="view-title has-bg"><img src="@/assets/img/launcher-readingclub/viewer-bridge/img_txt_read.webp" alt="다시 읽어볼까?"></h3>
        <div class="btn-wrap">
          <button type="button" class="btn-glossy-box stop"><img src="@/assets/img/launcher-readingclub/viewer-bridge/btn_stop.webp"></button>
          <button type="button" class="btn-glossy-box yes"><img src="@/assets/img/launcher-readingclub/viewer-bridge/btn_like.webp"></button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
</script>